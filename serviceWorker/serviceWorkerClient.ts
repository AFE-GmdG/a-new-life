import { INITIALIZE, LOG, ResultMessage, RPCMessage, ReplyCallbacks, transformErrorForSerialization } from "./serviceWorkerCommon";

type ClientMessageHandler = {
  sendMessage(message: string): void;
  handleMessage(method: string, args: any[]): Promise<any>;
};

type ServiceWorkerInitializeResult = {
  id: string;
  methods: string[];
};

function isRPCMessage(message: ResultMessage | RPCMessage | undefined): message is RPCMessage {
  if (!message) {
    return false;
  }
  return (message as any).rpcId !== undefined;
}

class RPCClientProtocol {

  private lastSendRequestId: number;
  private pendingReplies: Map<number, ReplyCallbacks>;

  constructor(private readonly messageHandler: ClientMessageHandler) {
    this.lastSendRequestId = 0;
    this.pendingReplies = new Map<number, ReplyCallbacks>();

    // handle incomming messages.
    window.navigator.serviceWorker.addEventListener("message", this.handlePossibleResult.bind(this));
  }

  /* event handler */
  private handlePossibleResult(event: ServiceWorkerMessageEvent) {
    let message: ResultMessage | RPCMessage | undefined = undefined;
    try {
      message = JSON.parse(event.data);
    } catch (error) {
      // Ignore unknown and maleformed messages.
      if (LOG) console.error("RPCClientProtocol::handlePossibleResult - Malformed message ignored", error);
      return;
    }
    if (isRPCMessage(message)) {
      // Handle RPC request
      const rpcId = message.rpcId;
      this.messageHandler.handleMessage(message.method, message.args).then(result => {
        this.messageHandler.sendMessage(JSON.stringify({
          rpcId,
          result,
          error: undefined
        }));
      }, reason => {
        this.messageHandler.sendMessage(JSON.stringify({
          rpcId,
          result: undefined,
          error: transformErrorForSerialization(reason)
        }));
      });
      return;
    }

    if (!message || !message.requestId || typeof message.requestId !== "number") {
      // Ignore unknown and maleformed messages.
      if (LOG) console.error("RPCClientProtocol::handlePossibleResult - Malformed message ignored - no requestId found.", message);
      return;
    }

    const reply = this.pendingReplies.get(message.requestId);
    if (!reply) {
      console.warn("Got a reply to an unknown request: " + message.requestId.toString());
      return;
    }

    this.pendingReplies.delete(message.requestId);

    if (LOG) console.log("RPC Client: got answer:", message);

    if (message.error) {
      let error: any = message.error;
      if (error.$isError) {
        error = new Error();
        error.name = message.error.name;
        error.message = message.error.message;
        error.stack = message.error.stack;
      }
      reply.error && reply.error(error);
      return;
    }

    reply.resolve && reply.resolve(message.result);
    return;
  }

  /* public methods */
  public doRPCCall<TResult>(method: string, args: any[]): Promise<TResult> {
    // Create the ReplyCallback object...
    const reply: ReplyCallbacks = {};
    // ...and fill in the resolve and error members.
    const result = new Promise<TResult>((resolve, error) => {
      reply.resolve = resolve;
      reply.error = error;
    });
    // Save this callback object along with the request id...
    this.pendingReplies.set(++this.lastSendRequestId, reply);
    // ...and send the method along with its parameter and the request id to the service worker
    // (over the message handler)
    this.messageHandler.sendMessage(JSON.stringify({
      requestId: this.lastSendRequestId,
      method: method,
      args: args
    }));
    return result;
  }

}

/**
 * This class will be instanciated by the website. (Frontend)
 * It requests the RPC calls on the WorkspaceServiceServer
 */
export class ServiceWorkerClient<T> {

  private readonly protocol: RPCClientProtocol;
  private _id: string;

  public get id(): string {
    return this._id;
  }

  private constructor(private serviceWorker: ServiceWorker, rpcHandler: (method: string, args: any[]) => Promise<any>) {
    if (!this.serviceWorker) {
      throw new Error("ServiceWorkerClient: serviceWorker is null or undefined.");
    }

    this.protocol = new RPCClientProtocol({
      sendMessage: (message: string) => this.serviceWorker.postMessage(message),
      handleMessage: (method: string, args: any[]) => rpcHandler(method, args)
    });
  }

  public static async create<T>(serviceWorkerFile: string, rpcHandler: (method: string, args: any[]) => Promise<any>): Promise<T & { readonly id: string }> {
    if (LOG) console.log("ServiceWorkerClient::create - " + serviceWorkerFile);
    const serviceWorker = window.navigator.serviceWorker;

    let registration = await serviceWorker.getRegistration();
    if (!registration) {
      if (LOG) console.log("ServiceWorkerClient::create - Keine Registrierung gefunden, Neuregistrierung.");
      [registration] = await Promise.all([serviceWorker.ready, serviceWorker.register(serviceWorkerFile, { scope: "/" })]);
      if (LOG) console.log("ServiceWorkerClient::create - Neuregistrierung - " + (registration.active && registration.active.state));
    } else {
      if (LOG) console.log("ServiceWorkerClient::create - Registrierung gefunden, Starte diverse tests...");
      const url = new URL(serviceWorkerFile, registration.scope);
      if (registration.active && registration.active.scriptURL !== url.href) {
        if (LOG) console.log("ServiceWorkerClient::create - Test: unbekannter Serviceworker, Neuregistrierung");
        await registration.unregister();
        [registration] = await Promise.all([serviceWorker.ready, serviceWorker.register(serviceWorkerFile, { scope: "/" })]);
        if (LOG) console.log("ServiceWorkerClient::create - Neuregistrierung - " + (registration.active && registration.active.state));
      } else {
        if (LOG) console.log("ServiceWorkerClient::create - Test: Update");
        await registration.update().catch(error => {
          /* ignore errors on update - use the old service worker instead. */
          if (LOG) console.error("ServiceWorkerClient::create - catch - Error Ignored", error);
        });
        if (LOG) console.log("ServiceWorkerClient::create - Test: Update done");
      }
    }

    if (!registration.active) {
      throw new Error("No active service worker found.");
    }

    const instance = new ServiceWorkerClient<T>(registration.active, rpcHandler);

    // The registration is done, the service worker is updated, its ready for the initialization RPC call.
    const result = await instance.protocol.doRPCCall<ServiceWorkerInitializeResult>(INITIALIZE, []).catch(error => { throw error; });
    if (!result) {
      throw new Error("Service worker initialization failed.");
    }

    instance._id = result.id;

    const resultObject = {
    };

    Object.defineProperty(resultObject, "id", {
      configurable: false,
      enumerable: true,
      get: () => instance.id,
      set: () => { }
    });

    result.methods.forEach(method => {
      (resultObject as any)[method] = function () {
        return instance.protocol.doRPCCall<any>(method, [...arguments]);
      };
    });

    return resultObject as T & { readonly id: string };
  }

}

import { INITIALIZE, LOG, RequestMessage, ResultMessage, RPCResponseMessage, ReplyCallbacks, transformErrorForSerialization } from "./serviceWorkerCommon";

// #region -= server releated =-
const exclude = /(\/sockjs-node\/|\/api\/|\/socket.io\/)/;

type HashJson = {
  [key: string]: string;
};

type ServerMessageHandler = {
  sendMessage(clientId: string, message: string): void;
  handleMessage(clientId: string, method: string, args: any[]): Promise<any>;
};

function isWindowClient(source: Client | ServiceWorker | MessagePort | null): source is WindowClient {
  if (!source) {
    return false;
  }
  return source.constructor.name === "WindowClient";
}

function isRPCResponseMessage(message: RequestMessage | RPCResponseMessage | undefined): message is RPCResponseMessage {
  if (!message) {
    return false;
  }
  return (message as any).rpcId !== undefined;
}

class RPCServerProtocol {

  private lastSendRequestId: number;
  private pendingReplies: Map<number, ReplyCallbacks>;

  constructor(private readonly messageHandler: ServerMessageHandler) {
    this.lastSendRequestId = 0;
    this.pendingReplies = new Map<number, ReplyCallbacks>();
  }

  public handleMessage(clientId: string, serializedMessage: string): void {
    let message: RequestMessage | RPCResponseMessage | undefined = undefined;

    try {
      message = JSON.parse(serializedMessage);
    } catch {
      // Ignore unknown and maleformed messages.
      return;
    }

    if (isRPCResponseMessage(message)) {
      const reply = this.pendingReplies.get(message.rpcId);
      if (!reply) {
        console.warn("Got a reply to an unknown rpc request: " + message.rpcId.toString());
        return;
      }

      this.pendingReplies.delete(message.rpcId);

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

    if (!message || !message.requestId) {
      // Ignore unknown and maleformed messages.
      return;
    }

    const requestId = message.requestId;
    if (LOG) console.log("RPC Server: Handle received message " + requestId + ": " + message.method);

    this.messageHandler.handleMessage(clientId, message.method, message.args).then(result => {
      this.sendResultMessage(clientId, {
        requestId: requestId,
        result: result,
        error: undefined
      });
    }, reason => {
      this.sendResultMessage(clientId, {
        requestId: requestId,
        result: undefined,
        error: transformErrorForSerialization(reason)
      });
    });
  }

  private sendResultMessage(clientId: string, message: ResultMessage): void {
    this.messageHandler.sendMessage(clientId, JSON.stringify(message));
  }

  public doRPCCall<TResult>(clientId: string, method: string, args: any[]): Promise<TResult> {
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
    this.messageHandler.sendMessage(clientId, JSON.stringify({
      rpcId: this.lastSendRequestId,
      method: method,
      args: args
    }));
    return result;
  }
}

/**
 * This is the base class will be instanciated in the ServiceWorker.
 * It executes the RPCs of all WorkspaceClients.
 */
export abstract class ServiceWorkerServer {

  private initializePromise: Promise<void>;
  private protocol: RPCServerProtocol;
  private requestHandler: Map<string, Function>;
  private replacesClientId: string | null = null;
  private sessionMap: { [key: string]: string } = {};
  // protected app: Express;

  protected constructor(protected readonly serviceWorkerGlobalScope: ServiceWorkerGlobalScope) {

    // this.app = new Express(this.serviceWorkerGlobalScope);

    this.updateCache();

    this.protocol = new RPCServerProtocol({
      sendMessage: this.sendMessage.bind(this),
      handleMessage: this.handleMessage.bind(this)
    });

    this.serviceWorkerGlobalScope.addEventListener("install", this.onInstall.bind(this));
    this.serviceWorkerGlobalScope.addEventListener("activate", this.onActivate.bind(this));
    this.serviceWorkerGlobalScope.addEventListener("fetch", this.onFetch.bind(this));
    this.serviceWorkerGlobalScope.addEventListener("message", this.onMessage.bind(this));
  }

  /* event handler */
  private onInstall(event: ExtendableEvent & { registerForeignFetch: (arg: {}) => void }): void {
    if (LOG) console.log("ServiceWorkerServer::onInstall");

    event.waitUntil(this.initializePromise.then(() => this.serviceWorkerGlobalScope.skipWaiting()));
  }

  private onActivate(event: ExtendableEvent): void {
    if (LOG) console.log("ServiceWorkerServer::onActivate");

    const self = this.serviceWorkerGlobalScope;
    event.waitUntil(this.initializePromise.then(() => self.clients.claim()));
  }

  private onFetch(event: FetchEvent): void {
    // All operations on caches are async, including matching URLs, so we use
    // promises heavily. event.respondWith() even takes promises to enable this.

    if (LOG) console.log("ServiceWorkerServer::onFetch:", event); // (event.request && event.request.url));

    // Handle error phorne url requests by the browser
    if (!event.request || !event.request.url) {
      return;
    }

    // Distinction between main window and client window
    let jriSessionId: string | null = null;
    if (!event.clientId) {
      const resultingClientId = event.resultingClientId;
      const replacesClientId = this.replacesClientId;
      this.replacesClientId = null;
      const indexOfQuery = event.request.url.indexOf("?");
      const queries = indexOfQuery > 0
        ? event.request.url
        .substr(indexOfQuery + 1)
        .split("&")
        .reduce<{ [key: string]: string }>((acc, cur) => {
          const query = cur.split("=");
            acc[query[0]] = query[1];
            return acc;
          }, {})
        : {};
        jriSessionId = queries["jriSessionId"] || null;
      if (jriSessionId !== null) {
        // If jriSessionId is a string, this is the ClientId of main window.
        this.sessionMap[resultingClientId] = jriSessionId;
      } else {
        if (replacesClientId !== null) {
          // A known IFrame has done a navigation
          jriSessionId = this.sessionMap[resultingClientId] = replacesClientId;
        }
      }
    } else {
      // Try to find the clientId of the assigned main window for all other access
      jriSessionId = this.sessionMap[event.clientId] || null;
    }

    // Handle unloading of a document
    const self = this.serviceWorkerGlobalScope;
    const unloadUrl = `${self.location.origin}/api/unload`;

    const respondFromCacheOrFetch = () => {
      if (event.request.headers.has("x-cache")) {

        const cacheMode = event.request.headers.get("x-cache");
        const newHeaders = new Headers(event.request.headers);
        newHeaders.delete("x-cache");
        const request = new Request(event.request, {
          headers: newHeaders
        });

        return self.caches.open("data").then(
          cache => cache.match(request).then<[Cache, Response| undefined]>(resp => [cache, resp]),
          (reason: any) => {
            if (LOG) console.log(`Cache error while requesting ${request.url}. (Reason: ${reason}) Let the browser handle this request.`);
            return [undefined, undefined];
          }
        ).then(([dataCache, cacheResponse]) => {
          if (cacheMode === "always" && cacheResponse) {
            return cacheResponse;
          }

          return fetch(request).then((response) => {
            return Promise.all([
              response.clone().text(),
              cacheResponse && cacheResponse.clone().text() || Promise.resolve(null)
            ]).then(([responseText, cacheText]) => {
              if (dataCache && responseText !== cacheText) {
                dataCache.put(request, response.clone());
              }
              return response;
            });
          }, (reason: any) => {
            if (cacheResponse) {
              return cacheResponse;
            }
            return new Response("NOT FOUND", { status: 404, statusText: "Not Found" });
          });
        });
      }
      return self.caches.open("local").then(
        cache => cache.match(event.request),
        (reason: any) => {
          if (LOG) console.log(`Cache error while requesting ${event.request.url}. (Reason: ${reason}) Let the browser handle this request.`);
          return this.refetchOrGetOfflineResponse(event.request);
        }
      );
    };

    const handleMainWindowFetch = async (): Promise<Response | undefined> => {
      if (event.request.url.indexOf(unloadUrl) === 0) {
        // TODO: Handle main window closed
        return new Response("");
      }

      // /(\/sockjs-node\/|\/api\/|\/socket.io\/)/
      if (exclude.test(event.request.url) && !event.request.headers.has("x-cache")) {
        if (LOG) console.log("exclude url: " + event.request.url);
        return this.refetchOrGetOfflineResponse(event.request);
      }

      return respondFromCacheOrFetch().then(response => {
        // No cache Hit or index.html with query
        const uri = new URL(event.request.url);
        if (!response || ((uri.pathname === "/" || uri.pathname === "/index.html") && uri.search)) {
          // Check for mapping files in offline situations
          if (uri.pathname.endsWith(".map")) {
            if (LOG) console.log(`Let the browser handle the map file request.`);
            return fetch(event.request.url, { credentials: "same-origin" });
          }

          // redirect unknown requests to /index.html
          if (event.request.url.indexOf(`${self.location.origin}/`) === 0) {
            if (LOG) console.log(`Redirect ${event.request.url} to ${self.location.origin}/index.html.`);
            return this.redirect(new Request(`${self.location.origin}/index.html${uri.search || ""}`, { credentials: "same-origin" }));
          }

          if (LOG) console.log(`No cache hit for ${event.request.url}. Let the browser handle this request.`);
          return this.refetchOrGetOfflineResponse(event.request);
        }

        if (LOG) console.log(`Cache hit for ${event.request.url}.`);
        return response;
      }, (reason: any) => {
        if (LOG) console.log(`Error matching request ${event.request.url}. (Reason: ${reason}) Let the browser handle this request.`);
        return this.refetchOrGetOfflineResponse(event.request);
      });
    };

    const handleRunWindowFetch = async (jriSessionId: string): Promise<Response | undefined> => {
      if (event.request.url.indexOf(unloadUrl) === 0) {
        this.replacesClientId = this.sessionMap[event.clientId] || null;
        delete this.sessionMap[event.clientId];
        return new Response("");
      }
      const url = event.request.url.startsWith(self.location.origin) ? event.request.url.substr(self.location.origin.length) : event.request.url;
      return (
        this.protocol.doRPCCall<string| null>(jriSessionId, "getContent", [url]).then((virtualFile) => {
          if (virtualFile == null) return handleMainWindowFetch();
        const isDataUrl = virtualFile.indexOf("data:") === 0;
        let content: string | ArrayBuffer = virtualFile;
        let contentType = "text/plain";
        if (isDataUrl) {
          const contentIndex = virtualFile.indexOf(",", 5);
          if (contentIndex === -1) throw new Error("VirtualFile malformed.");
          const [mimeType, encoding] = virtualFile.slice(5, contentIndex).split(";");
          content = virtualFile.slice(contentIndex + 1);
          contentType = mimeType || contentType;
          switch (encoding) {
            case "base64":
              content = Uint8Array.from(atob(content), c => c.charCodeAt(0));
              break;
            case "charset=utf-8":
            default:
              break;
          }
        }
        return new Response(content, { headers: { "content-type": contentType } });
      }, reason => {
        throw new Error(reason);
      }));
    };

    event.respondWith(this.initializePromise.then(async () => {
      // distinguish Run-Window-Request
      const result = await (jriSessionId ? handleRunWindowFetch(jriSessionId) : handleMainWindowFetch());
      if (!result) {
        throw new Error("Error: No result.");
      }
      return result;
    }));
  }

  private onMessage(event: ExtendableMessageEvent): void {
    if (!isWindowClient(event.source)) {
      return;
    }
    if (LOG) console.log("ServiceWorkerServer::onMessage - Message received from client:", event.source);
    this.protocol.handleMessage(event.source.id, event.data);
  }

  /* private methods */
  private async sendMessage(clientId: string, message: string) {
    if (LOG) console.log("RPC Server: Answer to Client " + clientId + " with " + message);
    const client = await this.serviceWorkerGlobalScope.clients.get(clientId);
    client && client.postMessage(message);
  }

  private handleMessage(clientId: string, method: string, args: any[]): Promise<any> {
    if (method === INITIALIZE) {
      return this.initialize(clientId);
    }

    const fn = this.requestHandler && this.requestHandler.get(method);
    if (!fn) {
      return Promise.resolve(new Error("Missing requestHandler or method: " + method));
    }

    try {
      return Promise.resolve(fn.apply(this, args));
    } catch (error) {
      return Promise.resolve(error);
    }
  }

  private getHashJson(hashesResponse: Promise<Response | undefined>): Promise<HashJson | undefined> {
    return hashesResponse.then(response => {
      if (!response) return;
      return response.text().then(text => {
        if (!text) return;
        try {
          return JSON.parse(text) as HashJson;
        } catch {
          return;
        }
      }, _reason => undefined);
    }, _reason => undefined);
  }

  private refetchOrGetOfflineResponse(request: Request) {
    const self = this.serviceWorkerGlobalScope;
    return fetch(request).then(
      response => response,
      (reason: any) => {
        if (LOG) console.warn("Offline result. The reason is ", reason);
        if (request.url.indexOf(`${self.location.origin}/api`) === 0) {
          return self.caches.open("local").then(cache => cache.match("offline.json"));
        } else if (request.url.indexOf(`${self.location.origin}`) === 0) {
          return self.caches.open("local").then(cache => cache.match("offline.html"));
        }
        return undefined;
      }
    );
  }

  private redirect(request: Request) {
    const self = this.serviceWorkerGlobalScope;
    return self.caches.open("local").then(
      cache => cache.match(request),
      (reason: any) => {
        if (LOG) console.log(`Cache error while requesting ${request.url}. (Reason: ${reason}) Let the browser handle this request.`);
        return this.refetchOrGetOfflineResponse(request);
      }).then(response => {
        if (!response) {
          if (LOG) console.log(`No cache hit for ${request.url}. Let the browser handle this request.`);
          return this.refetchOrGetOfflineResponse(request);
        }
        return response;
      }, (reason: any) => {
        if (LOG) console.log(`Error matching request ${request.url}. (Reason: ${reason}) Let the browser handle this request.`);
        return this.refetchOrGetOfflineResponse(request);
      });
  }

  private checkForCacheUpdate(): Promise<any> {
    const self = this.serviceWorkerGlobalScope;
    const origin = self.location.origin + self.location.pathname.substr(0, self.location.pathname.lastIndexOf("/") + 1);

    return self.caches.open("local")
      .then(local => {
        // get file and hash lists.
        return Promise.all([
          local,
          local.keys(),
          this.getHashJson(local.match("hashes.json")),
          this.getHashJson(fetch("hashes.json", { credentials: "same-origin" }))
        ]);
      }).then(([local, localKeys, localHashes, serverHashes]) => {

        if (!localHashes) {
          localHashes = {};
        }

        // It is possible, that no serverHashes returned, because the server is offline.
        if (!serverHashes) {
          throw new Error("No serverHashes: Possible offline situation detected.");
        }

        const serverHashItems = Object.keys(serverHashes).map(key => ({ key, uri: new URL(key, origin).href, hash: serverHashes[key] }));
        const localHashItems = Object.keys(localHashes).map(key => {
          const uri = new URL(key, origin).href;
          if (localHashes && !localKeys!.some(localKey => localKey.url === uri)) {
            delete localHashes[key];
          }
          return {
            key,
            uri,
            hash: localHashes && localHashes[key]
          };
        });

        // select and remove old/unnecessary files.
        const toRemove = localKeys!.reduce<Promise<boolean>[]>((acc, request) => {
          const serverHashItem = serverHashItems.find(serverHashItem => request.url === serverHashItem.uri);
          if (serverHashItem) {
            // Found the request in the new hashes.json from the server.
            // Check, if the hash is modified.
            if (!localHashItems.some(localHashItem => (serverHashItem.uri === localHashItem.uri) && (serverHashItem.hash === localHashItem.hash))) {
              // The request is not found in the localHashItems or
              // it is found but the hash value is different from the server hash value.
              // This is a candidate to remove from cache.
              acc.push(local!.delete(request));
              // Try to remove this request from the localHashes.
              if (localHashes) {
                delete localHashes[serverHashItem.key];
              }
            }
          } else {
            // The request is not found in the new hashes.json from the server.
            // This is a candidate to remove from cache.
            acc.push(local!.delete(request));
          }

          return acc;
        }, []);

        return Promise.all([local, localKeys, localHashes, serverHashes, ...toRemove] as any[]);
      }).then(([local, localKeys, localHashes, serverHashes]: [Cache, Request[], HashJson, HashJson]) => {
        const serverHashItems = Object.keys(serverHashes).map(key => ({ key, uri: new URL(key, origin).href, hash: serverHashes[key] }));
        const localHashItems = Object.keys(localHashes).map(key => ({ key, uri: new URL(key, origin).href, hash: localHashes[key] }));

        // select new / modified files.
        const toAdd = serverHashItems.reduce<string[]>((acc, serverHashItem) => {
          if (!localHashItems.some(localHashItem => serverHashItem.key === localHashItem.key)) {
            // Found a request to put in the cache.
            acc.push(serverHashItem.uri);
          }
          return acc;
        }, []);

        // add the new hashes.json to the cache.
        const content = JSON.stringify(serverHashes);
        const responseInit: ResponseInit = {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Content-Length": content.length.toString()
          },
          status: 200,
          statusText: "OK"
        };

        // Split all requests into packages of 10 requests each.
        const splittedToAdd: string[][] = [];
        for (let index = 0; index < toAdd.length; ++index) {
          const firstIndex = Math.floor(index / 10);
          const secondArray = splittedToAdd[firstIndex] || splittedToAdd[splittedToAdd.push([]) && splittedToAdd.length - 1];
          secondArray.push(toAdd[index]);
        }

        return Promise.all([
          Promise.all(splittedToAdd.map(part => local.addAll(part.map(uri => new Request(uri, { credentials: "same-origin" }))))),
          local.put("hashes.json", new Response(content, responseInit))
        ]);
      }).catch(() => {
        if (LOG) console.log("Possible offline situation detected.");
        return;
      });
  }

  private initialize(clientId: string): Promise<{ id: string, methods: string[] }> {
    if (!this.requestHandler) {
      // Initialize / save all service methods.
      this.requestHandler = new Map<string, Function>();

      const proto = this.constructor.prototype;
      Object.getOwnPropertyNames(proto).forEach((name) => {
        const method = name !== "constructor" && proto[name];
        if (method instanceof Function) {
          this.requestHandler.set(name, method);
        }
      });

      this.requestHandler.set("$$updateCache$$", () => this.updateCache());
    }

    // Force the service worker to update itself.
    return this.updateCache().then(() => ({
      id: clientId,
      methods: [...this.requestHandler.keys()]
    }));
  }

  /* protected methods */
  protected updateCache() {
    return this.initializePromise = this.checkForCacheUpdate();
  }

}

// #endregion

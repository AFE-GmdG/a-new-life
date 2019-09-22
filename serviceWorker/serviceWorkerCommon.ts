export const INITIALIZE = "$initialize";
export const LOG = false;

type ValueCallback<T = any> = (value: T | PromiseLike<T>) => void;
type ErrorCallback = (error: any) => void;

export type ReplyCallbacks = {
  resolve?: ValueCallback;
  error?: ErrorCallback;
};

// Server
export type RequestMessage = {
  requestId: number;
  method: string;
  args: any[];
};


export type ResultMessage = {
  requestId: number;
  result: any;
  error: any;
};

// Client
export type RPCMessage = {
  rpcId: number;
  method: string;
  args: any[];
};

export type RPCResponseMessage = {
  rpcId: number;
  result: any;
  error: any;
};

// #region -= Error Transformer =-
export interface SerializedError {
  readonly $isError: true;
  readonly name: string;
  readonly message: string;
  readonly stack: string;
}

export function transformErrorForSerialization(error: Error): SerializedError;
export function transformErrorForSerialization(error: any): any;
export function transformErrorForSerialization(error: any): any {
  if (error instanceof Error) {
    let { name, message } = error;
    let stack: string = (<any>error).stacktrace || (<any>error).stack;
    return {
      $isError: true,
      name,
      message,
      stack
    };
  }

  // return as is
  return error;
}

// #endregion

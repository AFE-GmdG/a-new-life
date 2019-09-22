// bug: TS2.7.x => https://github.com/Microsoft/TypeScript/issues/14877
declare const self: ServiceWorkerGlobalScope;

import { ServiceWorkerServer } from "./serviceWorkerServer";

class AppServiceServer extends ServiceWorkerServer {
  constructor(serviceWorkerGlobalScope: ServiceWorkerGlobalScope) {
    super(serviceWorkerGlobalScope);
  }
}

export default new AppServiceServer(self);

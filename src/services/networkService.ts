import { delay } from "../common";

export interface INetworkService {
	cleanup(): void;
}

//#region Types
//#endregion

//#region Network Service
export async function createNetworkService() {
	const networkService: INetworkService = Object.create(null, {
		cleanup: { enumerable: true, configurable: false, writable: false, value: () => { } }
	});

	await delay(100);

	return networkService;
}
//#endregion

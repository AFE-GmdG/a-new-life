import { delay } from "../common";

export interface IAudioService {
	cleanup(): void;
}

//#region Types
//#endregion

//#region Audio Service
export async function createAudioService() {
	const audioService: IAudioService = Object.create(null, {
		cleanup: { enumerable: true, configurable: false, writable: false, value: () => { } }
	});

	await delay(100);

	return audioService;
}
//#endregion

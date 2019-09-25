import { orThrow } from ".";

import { IApplicationService } from "../services/applicationService";
import { IGameService } from "../services/gameService";
import { createGraphicServices } from "../services/graphicService";

import { resizeCanvasToDisplaySize } from "../webGL/utils";

export interface IGame {
	readonly running: boolean;
	readonly paused: boolean;

	resize(): void;
	run(): void;
	pause(): void;
}

export function createGame(canvas: HTMLCanvasElement, applicationService: IApplicationService, initializationUpdateCallback: (percent: number) => void) {
	return new Promise<IGame>(async (resolve, reject) => {
		try {
			initializationUpdateCallback(0);
			resizeCanvasToDisplaySize(canvas);
			const graphicService = await createGraphicServices(canvas, [], ["app", "f", "g"], ["simple"], [], createUpdateCallback(1, 60));


		} catch (error) {
			reject(error);
		}
	});

	function createUpdateCallback(mappedFrom: number, mappedTo: number) {
		const diff = mappedTo - mappedFrom;
		if (diff < 0 || mappedFrom < 0 || mappedTo > 100) {
			throw new Error("Invalid Parameter.");
		}
		return function (percent: number) {
			percent = Math.max(0, Math.min(100, percent));
			initializationUpdateCallback(percent * diff / 100 + mappedFrom);
		};
	}
}

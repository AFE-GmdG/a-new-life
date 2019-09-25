import { orThrow } from ".";

import { IApplicationService } from "../services/applicationService";
import { IGameService } from "../services/gameService";
import { createGraphicServices } from "../services/graphicService";
import { createInputService } from "../services/inputService";

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
			const graphicService = await createGraphicServices(canvas, [], ["app", "f", "g"], ["simple"], [], createUpdateCallback(1, 90));
			const inputService = createInputService(canvas);

			// The input service needs a redesign.
			// Input Mappigs must be stackable, only views in front should get input events.
			// Views in background should save the input mappings until the view become a front view again.
			// (The Main Menu is a front view at start, a Level is stacked on top of the main view.
			//   If a level is active the Main Menu becomes a background view and therefore the inputs should
			//   ignored until the view becomes active again. An Ingame Menu is stacked on top of the Level,
			//   therefore the Level becomes a background view until die Ingame Menu is closed.)
			inputService.keyboardState.addMapping("ArrowUp", true, isPressed => { console.log("ArrowUp was pressed.") });

			initializationUpdateCallback(100);

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

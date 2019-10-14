import { IApplicationService } from "../services/applicationService";
import { createGraphicService } from "../services/graphicService";
import { createInputService } from "../services/inputService";
import { createAudioService } from "../services/audioService";
import { createNetworkService } from "../services/networkService";
import { createGameService } from "../services/gameService";

import { createMainMenu } from "../views/mainMenu";

import { resizeCanvasToDisplaySize } from "../webGL/utils";

export interface IGame {
	readonly running: boolean;
	readonly paused: boolean;

	resize(): void;
	run(): void;
	pause(): void;
}

export function createGame(
	canvas: HTMLCanvasElement,
	applicationService: IApplicationService, initializationUpdateCallback: (percent: number) => void,
	canvasTop?: HTMLCanvasElement,
	canvasFront?: HTMLCanvasElement,
	canvasRight?: HTMLCanvasElement
) {
	return new Promise<IGame>(async (resolve, reject) => {
		try {
			initializationUpdateCallback(0);
			resizeCanvasToDisplaySize(canvas);
			const graphicService = await createGraphicService(canvas, ["Skybox-Grass-512.jpg"], ["app.png", "f.png", "g.png"], ["simple", "flat", "floor"], ["f"], createUpdateCallback(1, 90));
			const inputService = createInputService(canvas);
			const audioService = await createAudioService();
			const networkService = await createNetworkService();

			const gameService = createGameService(applicationService, graphicService, inputService, audioService, networkService, createMainMenu);

			// The input service needs a redesign.
			// Input Mappigs must be stackable, only views in front should get input events.
			// Views in background should save the input mappings until the view become a front view again.
			// (The Main Menu is a front view at start, a Level is stacked on top of the main view.
			//   If a level is active the Main Menu becomes a background view and therefore the inputs should
			//   ignored until the view becomes active again. An Ingame Menu is stacked on top of the Level,
			//   therefore the Level becomes a background view until die Ingame Menu is closed.)
			// inputService.keyboardState.addMapping("ArrowUp", true, isPressed => { console.log("ArrowUp was pressed.") });

			let paused = false;

			const game: IGame = Object.create(null, {
				running: { enumerable: true, configurable: false, get: () => gameService.gameLoop.running },
				paused: { enumerable: true, configurable: false, get: () => paused },

				resize: {
					enumerable: true,
					configurable: false,
					writable: false,
					value: () => {
						resizeCanvasToDisplaySize(canvas);
					}
				},
				run: {
					enumerable: true,
					configurable: false,
					writable: false,
					value: () => {
						paused = false;
						gameService.gameLoop.start();
					}
				},
				pause: {
					enumerable: true,
					configurable: false,
					writable: false,
					value: () => {
						paused = gameService.topView && gameService.topView.requestPause() || false;
					}
				}
			});

			initializationUpdateCallback(100);

			resolve(game);
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

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
			canvasTop && resizeCanvasToDisplaySize(canvasTop);
			canvasFront && resizeCanvasToDisplaySize(canvasFront);
			canvasRight && resizeCanvasToDisplaySize(canvasRight);
			const graphicService = await createGraphicService(
				canvas,
				["Skybox-Grass-512.jpg"],
				["app.png", "f.png", "g.png"],
				["simple", "flat", "floor"],
				["f"],
				createUpdateCallback(1, 90),
				canvasTop,
				canvasFront,
				canvasRight
			);
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

			const scale = 20.5;

			const { ctxTop, ctxFront, ctxRight } = graphicService;
			if (ctxTop) {
				const { width: w, height: h } = ctxTop.canvas;
				const w2 = (w >> 1);
				const h2 = (h >> 1);
				const getX = (x: number) => ((x / scale * h + w2) >> 0) + 0.5;
				const getY = (y: number) => ((-y / scale * h + h2) >> 0) + 0.5;
				const clear = () => {
					ctxTop.clearRect(0, 0, w, h);
					ctxTop.strokeStyle = "#000000";
					ctxTop.strokeRect(0.5, 0.5, w - 1, h - 1);
				};
				const line = (x1: number, y1: number, x2: number, y2: number, color: string = "#000000") => {
					ctxTop.strokeStyle = color;
					ctxTop.beginPath();
					ctxTop.moveTo(getX(x1), getY(y1));
					ctxTop.lineTo(getX(x2), getY(y2));
					ctxTop.stroke();
				};

				clear();
				line((-scale >> 0) - 2, 0, (scale >> 0) + 1 , 0, "#ff0000");
				for (let x = (-scale >> 0) - 2; x <= (scale >> 0) + 1; ++x) {
					x && line(x, -0.05, x, 0.05, "#7f0000");
				}
				line(0, (-scale >> 0), 0, (scale >> 0), "#00ff00");
				for (let y = (-scale >> 0); y <= (scale >> 0); ++y) {
					y && line(-0.05, y, 0.05, y, "#007f00");
				}
			}

			if (ctxFront) {
				const { width: w, height: h } = ctxFront.canvas;
				const w2 = (w >> 1);
				const h2 = (h >> 1);
				const getX = (x: number) => ((x / scale * h + w2) >> 0) + 0.5;
				const getY = (y: number) => ((-y / scale * h + h2) >> 0) + 0.5;
				const clear = () => {
					ctxFront.clearRect(0, 0, w, h);
					ctxFront.strokeStyle = "#000000";
					ctxFront.strokeRect(0.5, 0.5, w - 1, h - 1);
				};
				const line = (x1: number, y1: number, x2: number, y2: number, color: string = "#000000") => {
					ctxFront.strokeStyle = color;
					ctxFront.beginPath();
					ctxFront.moveTo(getX(x1), getY(y1));
					ctxFront.lineTo(getX(x2), getY(y2));
					ctxFront.stroke();
				};

				clear();
				line((-scale >> 0) - 2, 0, (scale >> 0) + 1, 0, "#ff0000");
				for (let x = (-scale >> 0) - 2; x <= (scale >> 0) + 1; ++x) {
					x && line(x, -0.05, x, 0.05, "#7f0000");
				}
				line(0, (-scale >> 0), 0, (scale >> 0), "#0000ff");
				for (let y = (-scale >> 0); y <= (scale >> 0); ++y) {
					y && line(-0.05, y, 0.05, y, "#00007f");
				}
			}

			if (ctxRight) {
				const { width: w, height: h } = ctxRight.canvas;
				const w2 = (w >> 1);
				const h2 = (h >> 1);
				const getX = (x: number) => ((x / scale * h + w2) >> 0) + 0.5;
				const getY = (y: number) => ((-y / scale * h + h2) >> 0) + 0.5;
				const clear = () => {
					ctxRight.clearRect(0, 0, w, h);
					ctxRight.strokeStyle = "#000000";
					ctxRight.strokeRect(0.5, 0.5, w - 1, h - 1);
				};
				const line = (x1: number, y1: number, x2: number, y2: number, color: string = "#000000") => {
					ctxRight.strokeStyle = color;
					ctxRight.beginPath();
					ctxRight.moveTo(getX(x1), getY(y1));
					ctxRight.lineTo(getX(x2), getY(y2));
					ctxRight.stroke();
				};

				clear();
				line((-scale >> 0) - 2, 0, (scale >> 0) + 1, 0, "#00ff00");
				for (let x = (-scale >> 0) - 2; x <= (scale >> 0) + 1; ++x) {
					x && line(x, -0.05, x, 0.05, "#007f00");
				}
				line(0, (-scale >> 0), 0, (scale >> 0), "#0000ff");
				for (let y = (-scale >> 0); y <= (scale >> 0); ++y) {
					y && line(-0.05, y, 0.05, y, "#00007f");
				}
			}

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

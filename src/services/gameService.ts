import { IApplicationService } from "./applicationService";
import { IGraphicService } from "./graphicService";
import { IInputService } from "./inputService";
import { IAudioService } from "./audioService";
import { INetworkService } from "./networkService";

export interface IGameService {
	readonly applicationService: IApplicationService
	readonly graphicService: IGraphicService;
	readonly inputService: IInputService;
	readonly audioService: IAudioService;
	readonly networkService: INetworkService;

	readonly topView: View | undefined;
	readonly gameLoop: GameLoop;
}

//#region Types
export type UpdateLogicCallback = (totalTime: number, deltaTime: number, isFrontView: boolean) => boolean;
export type UpdateGraphicCallback = (isFrontView: boolean) => void;
export type ResizeCallback = (newWidth: number, newHeight: number) => void;
export type CleanupCallback = () => void;

export type View = {
	readonly onUpdateLogic: UpdateLogicCallback;
	readonly onUpdateGraphic: UpdateGraphicCallback;
	readonly onResize?: ResizeCallback;
	readonly onCleanup?: CleanupCallback;

	readonly requestPause: () => boolean;
};

export type GameLoop = {
	readonly running: boolean;

	readonly start: () => void;
	readonly stop: () => void;
	readonly step: () => void;
};
//#endregion

//#region Game Service
export function createGameService(applicationService: IApplicationService, graphicService: IGraphicService, inputService: IInputService, audioService: IAudioService, networkService: INetworkService, createInitialView: (gameService: IGameService) => View) {
	const views: View[] = [];

	const gameService: IGameService = Object.create(null, {
		applicationService: { enumerable: true, configurable: false, writable: false, value: applicationService },
		graphicService: { enumerable: true, configurable: false, writable: false, value: graphicService },
		inputService: { enumerable: true, configurable: false, writable: false, value: inputService },
		audioService: { enumerable: true, configurable: false, writable: false, value: audioService },
		networkService: { enumerable: true, configurable: false, writable: false, value: networkService },

		topView: {
			enumerable: true,
			configurable: false,
			get: () => views.length && views[views.length - 1] || undefined
		},
		gameLoop: {
			enumerable: true,
			configurable: false,
			writable: false,
			value: createGameLoop()
		}
	});

	views.push(createInitialView(gameService));

	return gameService;

	function createGameLoop() {
		const deltaTime = 1 / 60;
		let autoRequestNextFrame = false;
		let totalTimeDifference = 0;
		let accumulatedTime = 0;
		let lastTime = 0;

		const gameLoop: GameLoop = Object.create(null, {
			running: { enumerable: true, configurable: false, get: () => autoRequestNextFrame },

			start: { enumerable: true, configurable: false, writable: false, value: start },
			stop: { enumerable: true, configurable: false, writable: false, value: stop },
			step: { enumerable: true, configurable: false, writable: false, value: step }
		});

		return gameLoop;

		function updateProxy(time: number) {
			let localLastTime = lastTime;

			if (lastTime === 0) {
				accumulatedTime = deltaTime;
				lastTime = time;
				localLastTime = time - deltaTime;
				totalTimeDifference = localLastTime;
			} else {
				accumulatedTime += (time - lastTime) / 1000;
				lastTime = time;
			}

			// Max one second between 2 frames:
			// If the browser is in background or paused in debugger,
			// cap the accumulatedTime to a maximum of one second.
			if (accumulatedTime > 1) {
				accumulatedTime = 1;
				localLastTime = time - 1 / deltaTime;
			}

			// Wait until at least one deltaTime is passed.
			if (accumulatedTime < deltaTime) {
				window.requestAnimationFrame(updateProxy);
				return;
			}

			// Call updateLogic until less than one deltaTime.
			while (accumulatedTime >= deltaTime) {
				if (!updateLogic(localLastTime - totalTimeDifference, deltaTime)) {
					// if updateLogic returnd false, end the gameloop / end the game.
					const { gl } = graphicService;
					autoRequestNextFrame = false;

					gl.clearColor(0.0, 0.0, 0.0, 1.0);
					gl.clearDepth(1.0);
					gl.clearStencil(0.0);
					gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
					cleanup();
					return;
				}
				accumulatedTime -= deltaTime;
				localLastTime += deltaTime * 1000;
			}

			updateGraphic();
			if (autoRequestNextFrame) {
				window.requestAnimationFrame(updateProxy);
			}
		};

		function start() {
			if (!autoRequestNextFrame) {
				autoRequestNextFrame = true;
				window.requestAnimationFrame(updateProxy);
			}
		}

		function stop() {
			autoRequestNextFrame = false;
		}

		function step() {
			autoRequestNextFrame = false;
			window.requestAnimationFrame(updateProxy);
		}
	}

	function updateLogic(totalTime: number, deltaTime: number) {
		let lastViewIndex = views.length - 1;
		if (lastViewIndex < 0) {
			return false;
		}

		while (!views[lastViewIndex].onUpdateLogic(totalTime, deltaTime, true)) {
			const view = views.pop();
			view && view.onCleanup && view.onCleanup();
			--lastViewIndex;
			if (lastViewIndex < 0) {
				return false;
			}
		}

		while (lastViewIndex >= 0) {
			views[lastViewIndex].onUpdateLogic(totalTime, deltaTime, false);
			--lastViewIndex;
		}

		return true;
	}

	function updateGraphic() {
		const gl = graphicService.gl;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		views.forEach((view, index) => view.onUpdateGraphic(index === views.length - 1));
	}

	function cleanup() {
		graphicService.cleanup();
		inputService.cleanup();
		audioService.cleanup();
		networkService.cleanup();
	}
}
//#endregion

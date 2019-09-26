import { IGameService, View } from "../services/gameService";

export function createMainMenu(gameService: IGameService) {
	const { graphicService, inputService } = gameService;

	inputService.keyboardState.addMapping("Escape");

	const mainMenu: View = Object.create(null, {
		onUpdateLogic: { enumerable: true, configurable: false, writable: false, value: onUpdateLogic },
		onUpdateGraphic: { enumerable: true, configurable: false, writable: false, value: onUpdateGraphic },
		onResize: { enumerable: true, configurable: false, writable: false, value: onResize },

		requestPause: { enumerable: true, configurable: false, writable: false, value: requestPause }
	});

	return mainMenu;

	function onUpdateLogic(totalTime: number, deltaTime: number, isFrontView: boolean) {
		if (!isFrontView) {
			return true;
		}

		if (inputService.keyboardState.isPressed("Escape")) {
			return false;
		}


		return true;
	}

	function onUpdateGraphic(isFrontView: boolean) {
		if (!isFrontView) {
			return;
		}

		const { gl } = graphicService;
		const { width, height } = gl.canvas;

	}

	function onResize(newWidth: number, newHeight: number) {
	}

	function requestPause() {
		return false;
	}
}

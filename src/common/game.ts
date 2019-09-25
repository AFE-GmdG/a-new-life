import { orThrow } from ".";

import { IApplicationService } from "../services/applicationService";
import { IGameService } from "../services/gameService";

export interface IGame {
	readonly running: boolean;
	readonly paused: boolean;

	resize(): void;
	run(): void;
	pause(): void;
}

export function createGame(canvas: HTMLCanvasElement, applicationService: IApplicationService, initializationUpdateCallback: (percent: number) => void) {
	return new Promise<IGame>((resolve, reject) => {
		try {
			let percent = 0;
			const interval = window.setInterval(() => {
				percent++;
				initializationUpdateCallback(percent);
				if (percent >= 100) {
					window.clearTimeout(interval);
				}
			}, 25);
		} catch (error) {
			reject(error);
		}
	});
}

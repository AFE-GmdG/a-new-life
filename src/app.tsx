import * as React from "react";
import * as ReactDOM from "react-dom";

import { createGame } from "./common";
import { ApplicationService, IApplicationService } from "./services/applicationService";

const swPromise: Promise<IApplicationService> = window.navigator.serviceWorker
	? ApplicationService.create("sw.js")
	: Promise.reject();

swPromise.then(applicationService => {
	// webpack reload
	if (process.env.NODE_ENV === "development") {
		const socket = require("webpack-dev-server/client/socket");
		const onSocketMsg = {
			ok: function msgOk() {
				applicationService.updateCache();
			},
			warnings: function msgWarnings() {
				applicationService.updateCache();
			},
			invalid: function msgInvalid() {
				console.log("Recompiling…")
			},
			errors: function msgErrors(data: any) {
				console.log("Errors while compiling. Reload prevented.");
			}
		};
		socket("/sockjs-node", onSocketMsg);
	}

	// const appDiv = document.getElementById("app")!;
	// const canvas = document.createElement("canvas");
	// canvas.id = "main-canvas";
	// appDiv.appendChild(canvas);
	// const canvasTop = document.createElement("canvas");
	// canvasTop.id = "canvas-top";
	// appDiv.appendChild(canvasTop);
	// const canvasFront = document.createElement("canvas");
	// canvasFront.id = "canvas-front";
	// appDiv.appendChild(canvasFront);
	// const canvasRight = document.createElement("canvas");
	// canvasRight.id = "canvas-right";
	// appDiv.appendChild(canvasRight);

	// const labelTop = document.createElement("div");
	// labelTop.id = "label-top";
	// labelTop.textContent = "top";
	// appDiv.appendChild(labelTop);
	// const labelFront = document.createElement("div");
	// labelFront.id = "label-front";
	// labelFront.textContent = "front";
	// appDiv.appendChild(labelFront);
	// const labelRight = document.createElement("div");
	// labelRight.id = "label-right";
	// labelRight.textContent = "right";
	// appDiv.appendChild(labelRight);

	// const progress = document.createElement("div");
	// progress.id = "main-progress";
	// appDiv.appendChild(progress);
	// progress.classList.add("visible");

	// const onInitializationUpdate = (percent: number) => {
	// 	const value = `${percent.toFixed(0)}%`;
	// 	progress.textContent = value;
	// 	progress.style.backgroundSize = value;
	// 	if (percent >= 100) {
	// 		progress.classList.remove("visible");
	// 	}
	// }

	// return createGame(canvas, applicationService, onInitializationUpdate, canvasTop, canvasFront, canvasRight);

	const App: React.FC = props => {
		return (
			<canvas id="main-canvas"></canvas>
		);
	};

	return new Promise<void>(resolve => ReactDOM.render(<App />, document.getElementById("app"), resolve));
}).then(() => {
}).catch(reason => {
	const appDiv = document.getElementById("app")!;

	// const canvas = document.getElementById("main-canvas");
	// canvas && appDiv.removeChild(canvas);

	// const progress = document.getElementById("main-progress");
	// progress && appDiv.removeChild(progress);

	const h1 = document.createElement("h1");
	h1.textContent = "Something went wrong!";
	const p = document.createElement("p");
	p.textContent = reason && reason.message || reason.toString() || "Unknown Reason";
	appDiv.appendChild(h1);
	appDiv.appendChild(p);
});

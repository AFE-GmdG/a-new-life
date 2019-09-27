import { createGame } from "./common";
import { ApplicationService, IApplicationService } from "./services/applicationService";

import { Float2 } from "./webGL/float2";
import { Float3 } from "./webGL/float3";
import { Float4 } from "./webGL/float4";
import { Matrix2x2 } from "./webGL/matrix2x2";
import { Matrix3x3 } from "./webGL/matrix3x3";
import { Matrix4x4 } from "./webGL/matrix4x4";

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
				// setBusyStateAction("Recompiling…");
			},
			errors: function msgErrors(data: any) {
				console.log("Errors while compiling. Reload prevented.");
				// setBusyStateAction(null);
				// modalService.addModal({
				// 	title: "Errors while compiling. Reload prevented.",
				// 	content: (<ShowAnsi ansiText= { data.toString() } />),
				// 	buttons: [{
				// 		label: "Ok"
				// 	}]
				// });
			}
		};
		socket("/sockjs-node", onSocketMsg);
	}

	const appDiv = document.getElementById("app")!;
	const canvas = document.createElement("canvas");
	canvas.id = "main-canvas";
	appDiv.appendChild(canvas);

	const progress = document.createElement("div");
	progress.id = "main-progress";
	appDiv.appendChild(progress);
	progress.classList.add("visible");

	const onInitializationUpdate = (percent: number) => {
		const value = `${percent.toFixed(0)}%`;
		progress.textContent = value;
		progress.style.backgroundSize = value;
		if (percent >= 100) {
			progress.classList.remove("visible");
		}
	}

	return createGame(canvas, applicationService, onInitializationUpdate);
}).then(game => {
	game.run();
}).catch(reason => {
	const appDiv = document.getElementById("app")!;

	const canvas = document.getElementById("main-canvas");
	canvas && appDiv.removeChild(canvas);

	const progress = document.getElementById("main-progress");
	progress && appDiv.removeChild(progress);

	const h1 = document.createElement("h1");
	h1.textContent = "Something went wrong!";
	const p = document.createElement("p");
	p.textContent = reason && reason.message || reason.toString() || "Unknown Reason";
	appDiv.appendChild(h1);
	appDiv.appendChild(p);
});

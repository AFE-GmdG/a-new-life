import { createGame, orThrow } from "./common";
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
		const value = `${percent}%`;
		progress.textContent = value;
		progress.style.backgroundSize = value;
		if (percent >= 100) {
			progress.classList.remove("visible");
		}
	}

	return createGame(canvas, applicationService, onInitializationUpdate);

	// resizeCanvasToDisplaySize(canvas);
	// const context = canvas.getContext("webgl2") || orThrow("Could not create WebGL-Context.");
	// loadTextures(context, "f", "g");

	// return createProgram(context, "simple");
// }).then(({ context, vs, fs, program, positionAttributeLocation, positionBuffer }) => {
	// context.viewport(0, 0, context.canvas.width, context.canvas.height);
	// context.clearColor(0, 0, 0, 0);
	// context.clear(context.COLOR_BUFFER_BIT);

	// context.useProgram(program);
	// context.enableVertexAttribArray(positionAttributeLocation);

	// context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
	// var size = 2;
	// var type = context.FLOAT;
	// var normalize = false;
	// var stride = 0;
	// var offset = 0;
	// context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	// var primitiveType = context.TRIANGLES;
	// var offset = 0;
	// var count = 3;
	// context.drawArrays(primitiveType, offset, count);
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

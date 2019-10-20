import { Float3, Matrix4x4, Quaternion, PI_OVER_TWO } from "./webGL";
import { bootstrapper } from "./webGL/math.wasm";

const axis = new Float3(0.0, 0.1, 1.0).normalized;
const m1 = Matrix4x4.createRotationMatrix(new Quaternion(axis, PI_OVER_TWO));
const m2 = Matrix4x4.createTranslationMatrix(0.3, 0.2, -0.5);
const out = new Matrix4x4();

console.log(Matrix4x4.mul(m1, m2, out).toString("mul"));

performance.mark("1");
for (let i = 0; i < 10000000; ++i) {
	Matrix4x4.mul(m1, m2, out);
}
performance.mark("2");

bootstrapper().then(wasmObj => {
	console.log(wasmObj.m44m44mul(m1, m2, out).toString("m44m44mul"));

	performance.mark("3");
	for (let i = 0; i < 10000000; ++i) {
		wasmObj.m44m44mul(m1, m2, out);
	}
	performance.mark("4");

	performance.measure("1-2", "1", "2");
	performance.measure("3-4", "3", "4");
	console.log(performance.getEntriesByType("measure"));
	performance.clearMarks();
	performance.clearMeasures();

});

// import { createGame } from "./common";
// import { ApplicationService, IApplicationService } from "./services/applicationService";

// const swPromise: Promise<IApplicationService> = window.navigator.serviceWorker
// 	? ApplicationService.create("sw.js")
// 	: Promise.reject();

// swPromise.then(applicationService => {
// 	// webpack reload
// 	if (process.env.NODE_ENV === "development") {
// 		const socket = require("webpack-dev-server/client/socket");
// 		const onSocketMsg = {
// 			ok: function msgOk() {
// 				applicationService.updateCache();
// 			},
// 			warnings: function msgWarnings() {
// 				applicationService.updateCache();
// 			},
// 			invalid: function msgInvalid() {
// 				console.log("Recompiling…")
// 			},
// 			errors: function msgErrors(data: any) {
// 				console.log("Errors while compiling. Reload prevented.");
// 			}
// 		};
// 		socket("/sockjs-node", onSocketMsg);
// 	}

// 	const appDiv = document.getElementById("app")!;
// 	const canvas = document.createElement("canvas");
// 	canvas.id = "main-canvas";
// 	appDiv.appendChild(canvas);
// 	const canvasTop = document.createElement("canvas");
// 	canvasTop.id = "canvas-top";
// 	appDiv.appendChild(canvasTop);
// 	const canvasFront = document.createElement("canvas");
// 	canvasFront.id = "canvas-front";
// 	appDiv.appendChild(canvasFront);
// 	const canvasRight = document.createElement("canvas");
// 	canvasRight.id = "canvas-right";
// 	appDiv.appendChild(canvasRight);

// 	const labelTop = document.createElement("div");
// 	labelTop.id = "label-top";
// 	labelTop.textContent = "top";
// 	appDiv.appendChild(labelTop);
// 	const labelFront = document.createElement("div");
// 	labelFront.id = "label-front";
// 	labelFront.textContent = "front";
// 	appDiv.appendChild(labelFront);
// 	const labelRight = document.createElement("div");
// 	labelRight.id = "label-right";
// 	labelRight.textContent = "right";
// 	appDiv.appendChild(labelRight);

// 	const progress = document.createElement("div");
// 	progress.id = "main-progress";
// 	appDiv.appendChild(progress);
// 	progress.classList.add("visible");

// 	const onInitializationUpdate = (percent: number) => {
// 		const value = `${percent.toFixed(0)}%`;
// 		progress.textContent = value;
// 		progress.style.backgroundSize = value;
// 		if (percent >= 100) {
// 			progress.classList.remove("visible");
// 		}
// 	}

// 	return createGame(canvas, applicationService, onInitializationUpdate, canvasTop, canvasFront, canvasRight);
// }).then(game => {
// 	game.run();
// }).catch(reason => {
// 	const appDiv = document.getElementById("app")!;

// 	const canvas = document.getElementById("main-canvas");
// 	canvas && appDiv.removeChild(canvas);

// 	const progress = document.getElementById("main-progress");
// 	progress && appDiv.removeChild(progress);

// 	const h1 = document.createElement("h1");
// 	h1.textContent = "Something went wrong!";
// 	const p = document.createElement("p");
// 	p.textContent = reason && reason.message || reason.toString() || "Unknown Reason";
// 	appDiv.appendChild(h1);
// 	appDiv.appendChild(p);
// });

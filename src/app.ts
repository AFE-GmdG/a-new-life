import { Float3, Matrix4x4, Quaternion, PI_OVER_TWO } from "./webGL";
import { GameObject, Transform } from "./common";

const empty = new GameObject("empty");
empty.transform.localPosition = new Float3(1, 0, 0);

const fObject = new GameObject("f");
fObject.transform.localPosition = new Float3(1, 0, 0);
fObject.transform.setParent(empty.transform, false);

empty.transform.localRotation = new Quaternion(new Float3(0, 0, 1), PI_OVER_TWO);

console.log(fObject.transform.position.toString("fObject WorldPosition"));

fObject.transform.position = new Float3(-4, 3, 1);
console.log(fObject.transform.localPosition.toString("fObject LocalPosition"));
console.log(fObject.transform.position.toString("fObject WorldPosition"));

const out = new Matrix4x4();
const axis = new Float3(0.1, 0.5, -0.3).normalized;
console.log(axis.toString("Rotation Axis"));
Matrix4x4.createRotationMatrix(axis, PI_OVER_TWO, out);
console.log(out.toString("Axis-Angle-Rotation-Matrix"));
const q = new Quaternion(axis, PI_OVER_TWO);
console.log(q.toString("Axis-Angle-Quaternion"));
Matrix4x4.createRotationMatrix(q, out);
console.log(out.toString("Quaternion-Rotation-Matrix"));

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

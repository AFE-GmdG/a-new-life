import { Float3, Float4, Matrix4x4, Quaternion } from "./webGL";

const position = Matrix4x4.createTranslationMatrix(1.5, -0.2, 0.6);
const rotation = Matrix4x4.createRotationMatrix(new Float3(-0.1, 0.1, 1.0).normalized, 0.15);
const scale = Matrix4x4.createScaleMatrix(2.0, 1.5, 0.8);
console.log(position.toString("Position"));
console.log(rotation.toString("Rotation"));
console.log(scale.toString("Scale"));

const res1 = new Matrix4x4();

Matrix4x4.mul(position, rotation, res1);
console.log(res1.toString("Position * Rotation"));
Matrix4x4.mul(res1, scale, res1);
console.log(res1.toString("Position * Rotation * Scale"));

const dTranslation = new Float3();
const dRotation = new Quaternion();
const dScale = new Float3();
const dSkew = new Float3();
const dPerspective = new Float4();

res1.decompose(dTranslation, dRotation, dScale, dSkew, dPerspective);
console.log("\n");
console.log(dTranslation.toString("dTranslation"));
console.log(dRotation.toString("dRotation"));
console.log(dScale.toString("dScale"));
console.log(dSkew.toString("dSkew"));
console.log(dPerspective.toString("dPerspective"));

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

import React from "react";
import ReactDOM from "react-dom";
import { get, set } from "@easm/core";
import { useSceneStore } from "./store/applicationStore";

import { Camera } from "./common/camera";
import { Scene } from "./common/scene";
import { CameraView } from "./components/cameraView";
import { ProgressBar } from "./components/progressbar";
import { TopView } from "./components/topView";
import { ApplicationService, IApplicationService } from "./services/applicationService";
import { Float3 } from "./webGL/float3";
import { resizeCanvasToDisplaySize } from "./webGL/utils";

const swPromise: Promise<IApplicationService> = window.navigator.serviceWorker
	? ApplicationService.create("sw.js")
	: Promise.reject();

let setProgressCallback: ((progress: number | null) => void) | undefined = undefined;
const onInitializationUpdate = (progress: number | null) => {
	setProgressCallback && setProgressCallback(progress);
};

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

	const scene = new Scene("Scene 01");
	const mainCamera = new Camera("Main Camera");
	const additionalCamera = new Camera("Additional Camera");
	scene.add(mainCamera);
	scene.add(additionalCamera);
	scene.activeCamera = mainCamera;
	mainCamera.transform.localSetPositionLookAt(new Float3(0, -8, 1.6), new Float3(0, 0, 0.8));

	const sceneStore = useSceneStore();
	set(sceneStore.state.activeCamera, mainCamera);

	const canvasRef = React.createRef<HTMLCanvasElement>();
	const App: React.FC = _props => {

		const [progress, setProgress] = React.useState<number | null>(null);
		setProgressCallback = setProgress;

		// <canvas key="main-canvas" id="main-canvas" ref={ canvasRef }></canvas>
		return (
			<>
				<TopView />
				<CameraView />
				<ProgressBar key="progress" percent={ progress } />
			</>
		);
	};

	return new Promise<HTMLCanvasElement>(resolve => ReactDOM.render(<App />, document.getElementById("app"), () => resolve(canvasRef && canvasRef.current || undefined)));
}).then(canvas => {
	// onInitializationUpdate(0);
	// resizeCanvasToDisplaySize(canvas);
	// const scene = new Scene("Scene 01");
	// const mainCamera = new Camera("Main Camera");
	// const additionalCamera = new Camera("Additional Camera");
	// scene.add(mainCamera);
	// scene.add(additionalCamera);
	// scene.activeCamera = mainCamera;
	// mainCamera.transform.localSetPositionLookAt(new Float3(0, -8, 1.6), new Float3(0, 0, 0.8));

	onInitializationUpdate(null);
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

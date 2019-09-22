import { ApplicationService, IApplicationService } from "./services/applicationService";

const swPromise: Promise<IApplicationService> = window.navigator.serviceWorker
	? ApplicationService.create("/sw.js")
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
	const h1 = document.createElement("h1");
	h1.textContent = "Ok!";
	appDiv.appendChild(h1);

}).catch(reason => {
	const appDiv = document.getElementById("app")!;
	const h1 = document.createElement("h1");
	h1.textContent = "Something went wrong!";
	const p = document.createElement("p");
	p.textContent = reason && reason.message || reason.toString() || "Unknown Reason";
	appDiv.appendChild(h1);
	appDiv.appendChild(p);
});

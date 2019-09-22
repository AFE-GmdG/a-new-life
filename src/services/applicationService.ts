import { ServiceWorkerClient } from "../../serviceWorker/serviceWorkerClient";
import { LOG } from "../../serviceWorker/serviceWorkerCommon";

export interface IApplicationService {
	id: string;
	updateCache(): Promise<void>;
}

const rpcHandler = (method: string, args: any[]): Promise<any> => {
	// ToDo: Implement handler methods the ServiceWorker could call.
	// Currently there are no such methods.
	// switch (method) {
	// }
	return Promise.reject("Unknown method: " + method);
};

export class ApplicationService implements IApplicationService {

	private constructor(private client: IApplicationService & { readonly id: string; readonly [key: string]: any; }) { }

	public static async create(serviceWorkerFile: string): Promise<IApplicationService> {
		if (LOG) console.log("WorkspaceService::create starting");
		const client = await ServiceWorkerClient.create<IApplicationService>(serviceWorkerFile, rpcHandler);
		if (LOG) console.log("WorkspaceService::create finished", client);
		return new ApplicationService(client);
	}

	public get id(): string {
		return this.client.id;
	}

	public updateCache(): Promise<void> {
		return this.client["$$updateCache$$"]();
	}
}

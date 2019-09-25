import { IInputService } from "./inputService";

export interface IGameService {
	readonly graphic: undefined;
	readonly input: IInputService;
	readonly audio: undefined;
	readonly network: undefined;
}

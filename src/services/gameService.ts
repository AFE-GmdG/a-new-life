import { IGraphicService } from "./graphicService";
import { IInputService } from "./inputService";

export interface IGameService {
	readonly graphic: IGraphicService;
	readonly input: IInputService;
	readonly audio: undefined;
	readonly network: undefined;
}

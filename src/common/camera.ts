import { GameObject } from "./gameObject";
import { Transform } from "./transform";
export class Camera extends GameObject {

	//#region ctor
	constructor(name: string, transform: Transform = new Transform()) {
		super(name, transform);
	}
	//#endregion
}

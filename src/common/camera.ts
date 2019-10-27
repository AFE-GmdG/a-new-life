import { DEG2RAD, PI_OVER_THREE } from "../webGL/utils";

import { GameObject } from "./gameObject";
import { Transform } from "./transform";
export class Camera extends GameObject {
	//#region Fields
	private _fieldOfView: number;
	public isOrthogonal: boolean;
	//#endregion

	//#region Properties
	get fieldOfView() { return this._fieldOfView; }
	set fieldOfView(value: number) {
		this._fieldOfView = Math.min(DEG2RAD * 179, Math.max(DEG2RAD * 10, value));
	}
	//#endregion

	//#region ctor
	constructor(name: string, transform: Transform = new Transform(), fieldOfView: number = PI_OVER_THREE) {
		super(name, transform);
		this.fieldOfView = fieldOfView;
	}
	//#endregion
}

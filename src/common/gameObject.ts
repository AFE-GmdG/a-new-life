import { Float3, Matrix4x4, Quaternion } from "../webGL";
import { Transform } from "./transform";

//#region GameObject
export class GameObject {
	private static maxId: number = 0;

	readonly name: string;
	readonly transform: Transform

	constructor();
	constructor(name: string);
	constructor(name?: string) {
		if (name === undefined) {
			name = `GameObject[${GameObject.maxId++}]`;
		}
		this.name = name;
		this.transform = new Transform();
	}

}
//#endregion

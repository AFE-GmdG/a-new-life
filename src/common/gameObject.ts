import { Float3 } from "../webGL/float3";
import { Matrix4x4 } from "../webGL/matrix4x4";
import { Quaternion } from "../webGL/quaternion";
import { Transform } from "./transform";

//#region GameObject
export class GameObject {
	private static maxId: number = 0;

	readonly name: string;
	readonly transform: Transform

	constructor();
	constructor(name: string);
	constructor(transform: Transform);
	constructor(name: string, transform: Transform);
	constructor(name?: string | Transform, transform?: Transform) {
		if (name instanceof Transform) {
			transform = name;
			name = undefined;
		}
		if (name === undefined) {
			name = `GameObject[${GameObject.maxId++}]`;
		}
		if (transform === undefined) {
			transform = new Transform();
		}
		this.name = name;
		this.transform = transform;
	}

}
//#endregion

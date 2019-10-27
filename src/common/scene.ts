import { Camera } from "./camera";
import { GameObject } from "./gameObject";
import { Transform } from "./transform";

export class Scene {
	//#region Fields
	readonly name: string;
	readonly gameObjects: GameObject[];
	private _activeCamera: Camera;
	//#endregion

	//#region Properties
	get activeCamera() { return this._activeCamera; }
	set activeCamera(value: Camera) {
		this.gameObjects.includes(value) || this.add(value);
		this._activeCamera = value;
	}

	get cameras(): IterableIterator<Camera> {
		const instance = this;
		let nextIndex = 0;
		return {
			next(): IteratorResult<Camera, undefined> {
				while (nextIndex < instance.gameObjects.length) {
					const potentialCamera = instance.gameObjects[nextIndex++];
					if (potentialCamera instanceof Camera) {
						return { value: potentialCamera, done: false };
					}
				}
				return { value: undefined, done: true };
			},
			return() {
				// console.log("return was called.");
				return { value: undefined, done: true };
			},
			[Symbol.iterator]() { return this; }
		}
	}
	//#endregion

	//#region ctor
	constructor(name: string) {
		this.name = name;
		this.gameObjects = [];
	}
	//#endregion

	//#region Methods
	add(gameObject: GameObject) {
		if (this.gameObjects.includes(gameObject)) {
			throw new Error("gameObject already added.");
		}
		this.gameObjects.push(gameObject);
	}

	setActiveCameraByName(cameraName: string): Camera | undefined {
		for (const camera of this.cameras) {
			if (camera.name === cameraName) {
				return this._activeCamera = camera;
			}
		}
		return undefined;
	}
	//#endregion
}

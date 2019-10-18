import { GameObject } from ".";
import { Float3, Matrix4x4, Quaternion } from "../webGL";

export class Transform {
	private readonly _localPosition: Float3;
	private readonly _localRotation: Quaternion;
	private readonly _localScale: Float3;
	parent?: Transform;

	get position(): Float3 {
		if (!this.parent) {
			return this._localPosition;
		}
		const [parentX, parentY, parentZ] = this.parent.position.elements;
		const [localX, localY, localZ] = this._localPosition.elements;
		return new Float3(parentX + localX, parentY + localY, parentZ + localZ);
	}
	set position(value: Float3) {
		if (!this.parent) {
			this._localPosition.xyz = value;
		} else {
			const [parentX, parentY, parentZ] = this.parent.position.elements;
			const [valueX, valueY, valueZ] = value.elements;
			this._localPosition.elements = [valueX - parentX, valueY - parentY, valueZ - parentZ];
		}
	}

	get localPosition(): Float3 { return this._localPosition; }
	set localPosition(value: Float3) { this._localPosition.xyz = value; }

	constructor() {
		this._localPosition = new Float3();
		this._localRotation = new Quaternion();
		this._localScale = new Float3();
	}

	/**
	 * Set the parent of the transform. The world position stays at the current position.
	 * @param parent: The new parent. Set to undefined to clear the current parent.
	 */
	setParent(parent: GameObject | Transform | undefined): void;
	/**
	 * Set the parent of the transform.
	 * @param parent The new parent. Set to undefined to clear the current parent.
	 * @param worldPositionStays True if the current world position should be unchanged.
	 */
	setParent(parent: GameObject | Transform | undefined, worldPositionStays: boolean): void;
	setParent(parent: GameObject | Transform | undefined, worldPositionStays: boolean = true) {
		if (parent === this.parent) {
			return;
		}
		if (parent instanceof GameObject) {
			parent = parent.transform;
		}
		if (!worldPositionStays) {
			this.parent = parent;
			return;
		}
		if (this.parent) {
			this.localPosition = this.position;
			// rotation
			// scale
			this.parent = undefined;
		}
		if (parent) {
			this.parent = parent;
			// scale
			// rotation
			this.position = this.localPosition;
		}
	}

};

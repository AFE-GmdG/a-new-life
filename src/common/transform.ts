import { GameObject } from "./gameObject";
import { PRECISION } from "../webGL/utils";
import { Float3 } from "../webGL/float3";
import { Matrix4x4 } from "../webGL/matrix4x4";
import { Quaternion } from "../webGL/quaternion";

enum MatrixState {
	Invalid,
	LocalToWorldMatrix,
	WorldToLocalMatrix
}

export class Transform {
	private readonly _tmpMatrix: Matrix4x4;
	private _tmpMatrixState: MatrixState;
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
		this._tmpMatrixState = MatrixState.Invalid;
		if (!this.parent) {
			this._localPosition.xyz = value;
		} else {
			const [parentX, parentY, parentZ] = this.parent.position.elements;
			const [valueX, valueY, valueZ] = value.elements;
			this._localPosition.elements = [valueX - parentX, valueY - parentY, valueZ - parentZ];
		}
	}

	get localPosition(): Float3 { return this._localPosition; }
	set localPosition(value: Float3) {
		this._tmpMatrixState = MatrixState.Invalid;
		this._localPosition.xyz = value;
	}

	get localRotation(): Quaternion { return this._localRotation; }
	set localRotation(value: Quaternion) {
		this._tmpMatrixState = MatrixState.Invalid;
		this._localRotation.elements = value.elements;
	}

	get localScale(): Float3 { return this._localScale; }
	set localScale(value: Float3) {
		this._tmpMatrixState = MatrixState.Invalid;
		this._localScale.xyz = value;
	}

	constructor() {
		this._tmpMatrix = new Matrix4x4();
		this._tmpMatrixState = MatrixState.Invalid;
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

	localToWorldMatrix(outMatrix: Matrix4x4 = new Matrix4x4()): Matrix4x4 {
		if (this._tmpMatrixState !== MatrixState.LocalToWorldMatrix) {
			if (parent) {

			} else {

			}

			this._tmpMatrixState = MatrixState.LocalToWorldMatrix;
		}
		outMatrix.elements = this._tmpMatrix.elements;
		return outMatrix;
	}

	localSetPositionLookAt(position: Float3, lookAt: Float3, up: Float3 = new Float3(0, 0, 1)) {
		// debugger;
		const forward = new Float3(0, 1, 0);
		const zero = Float3.zero;
		const cforward = Float3.sub(lookAt, position);
		if (cforward.equals(zero) || up.equals(zero)) {
			this._localRotation.elements = [0, 0, 0, 1];
		} else {
			const nup = up.normalized;
			cforward.normalize();
			if (nup.equals(cforward)) {

			} else {
				const v = Float3.mul(nup, -Float3.dot(nup, cforward));
				Float3.add(cforward, v, v);
				const q = Quaternion.createFromToRotation(forward, v);
				Quaternion.mul(Quaternion.createFromToRotation(v, cforward), q, this._localRotation);
			}
		}

		// console.log(this._localRotation.toString("Rotation"));


		this._localPosition.xyz = position;
	}
};

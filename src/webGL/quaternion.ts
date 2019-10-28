import { format, PRECISION, COS_ONE_OVER_TWO } from "./utils";
import { Float3 } from "./float3";

export class Quaternion {
	//#region Fields
	private readonly _elements: Float32Array;
	//#endregion

	//#region Properties
	get x() { return this._elements[0]; } set x(value: number) { this._elements[0] = value; }
	get y() { return this._elements[1]; } set y(value: number) { this._elements[1] = value; }
	get z() { return this._elements[2]; } set z(value: number) { this._elements[2] = value; }
	get w() { return this._elements[3]; } set w(value: number) { this._elements[3] = value; }

	get elements(): [number, number, number, number] { return Array.from(this._elements) as [number, number, number, number]; }
	set elements(value: [number, number, number, number]) { this._elements.set(value); }

	/** Returns the quaternion rotation angle. */
	get angle() {
		if (Math.abs(this._elements[3]) > COS_ONE_OVER_TWO) {
			return Math.asin(Math.hypot(this._elements[0], this._elements[1], this._elements[2])) * 2;
		}
		return Math.acos(this._elements[3]) * 2;
	}

	/** Returns the quaternion rotation axis. */
	get axis() {
		const tmp1 = 1 - this._elements[3] * this._elements[3];
		if (tmp1 <= 0) {
			return new Float3(0, 0, 1);
		}
		const tmp2 = 1 / Math.sqrt(tmp1);
		return new Float3(this._elements[0] * tmp2, this._elements[1] * tmp2, this._elements[2] * tmp2);
	}

	/** Returns the conjugated quaternion */
	get conjugated() {
		return new Quaternion(-this._elements[0], -this._elements[1], -this._elements[2], this._elements[3]);
	}

	/** Returns the identity quaternion. */
	get identity() {
		return new Quaternion();
	}

	/** Returns the inverted quaternion. */
	get inversed() {
		const dot = this._elements[0] * this._elements[0] + this._elements[1] * this._elements[1] + this._elements[2] * this._elements[2] + this._elements[3] * this._elements[3];
		return new Quaternion(-this._elements[0] / dot, -this._elements[1] / dot, -this._elements[2] / dot, this._elements[3] / dot);
	}

	/** Returns a normalized quaternion. */
	get normalized() {
		const length = Math.hypot(
			this._elements[0],
			this._elements[1],
			this._elements[2],
			this._elements[3]);
		if (length > PRECISION) {
			return new Quaternion(
				this._elements[0] / length,
				this._elements[1] / length,
				this._elements[2] / length,
				this._elements[3] / length);
		}
		return new Quaternion();
	}
	//#endregion

	//#region ctor
	constructor();
	/**
	 * Build a quaternion from a normalized axis and an angle.
	 * @param axis A normalized axis.
	 * @param angle The rotation angle.
	 */
	constructor(axis: Float3, angle: number);
	constructor(x: number, y: number, z: number, w: number);
	constructor(x?: Float3 | number, y?: number, z?: number, w?: number) {
		if (x === undefined) {
			this._elements = new Float32Array([0, 0, 0, 1]);
		} else if (x instanceof Float3) {
			const sin = Math.sin(y! * 0.5);
			this._elements = new Float32Array([x.x * sin, x.y * sin, x.z * sin, Math.cos(y! * 0.5)]);
		} else {
			this._elements = new Float32Array([x!, y!, z!, w!]);
		}
	}
	//#endregion

	//#region Operators
	static mul(left: Quaternion, right: number, out?: Quaternion): Quaternion;
	static mul(left: Quaternion, right: Quaternion, out?: Quaternion): Quaternion;
	static mul(left: Quaternion, right: number | Quaternion, out = new Quaternion()) {
		if (right instanceof Quaternion) {
			out.x = left.w * right.x + left.x * right.w + left.y * right.z - left.z * right.y;
			out.y = left.w * right.y - left.x * right.z + left.y * right.w + left.z * right.x;
			out.z = left.w * right.z + left.x * right.y - left.y * right.x + left.z * right.w;
			out.w = left.w * right.w - left.x * right.x - left.y * right.y - left.z * right.z;
		} else {
			out.x = left.x * right;
			out.y = left.y * right;
			out.z = left.z * right;
			out.w = left.w * right;
		}
		return out;
	}
	//#endregion

	//#region Instance Methods
	conjugate() {
		this._elements[0] = -this._elements[0];
		this._elements[1] = -this._elements[1];
		this._elements[2] = -this._elements[2];
		return this;
	}

	equals(other: Quaternion) {
		return (this === other)
			|| (
				Math.abs(this._elements[0] - other._elements[0]) <= PRECISION
				&& Math.abs(this._elements[1] - other._elements[1]) <= PRECISION
				&& Math.abs(this._elements[2] - other._elements[2]) <= PRECISION
				&& Math.abs(this._elements[3] - other._elements[3]) <= PRECISION
			);
	}

	invert() {
		const dot = this._elements[0] * this._elements[0] + this._elements[1] * this._elements[1] + this._elements[2] * this._elements[2] + this._elements[3] * this._elements[3];
		this._elements[0] = -this._elements[0] / dot;
		this._elements[1] = -this._elements[1] / dot;
		this._elements[2] = -this._elements[2] / dot;
		this._elements[3] = this._elements[3] / dot;
		return this;
	}

	normalize() {
		const length = Math.hypot(
			this._elements[0],
			this._elements[1],
			this._elements[2],
			this._elements[3]);
		if (length > PRECISION) {
			this._elements[0] /= length;
			this._elements[1] /= length;
			this._elements[2] /= length;
			this._elements[3] /= length;
		}
		return this;
	}

	toString(name?: string) {
		return `Quaternion${name && `: ${name}` || ""}\n(${format(this._elements[0], 8, 3)}  ${format(this._elements[1], 8, 3)}  ${format(this._elements[2], 8, 3)}  ${format(this._elements[3], 8, 3)})`;
	}
	//#endregion

	//#region Static Methods

	/**
	 * Creates a quaternion to rotate the start direction in a way
	 * to look to the destination direction.
	 * @param start The start direction.
	 * @param destination The destination direction.
	 * @param out Optional output quaternion to write the result to.
	 */
	static createFromToRotation(start: Float3, destination: Float3, out = new Quaternion()): Quaternion {
		const from = start.normalized
		const to = destination.normalized
		const cosTheta = Float3.dot(from, to);
		const axis = new Float3
		if (cosTheta < 1 - PRECISION) {
			Float3.cross(new Float3(0, 0, 1), from, axis);
			if (axis.length < PRECISION) {
				Float3.cross(new Float3(1, 0, 0), from, axis);
			}
			out.elements = [axis.x, axis.y, axis.z, 0];
		} else {
			Float3.cross(from, to, axis);
			const s = Math.sqrt((1 + cosTheta) * 2);
			const i = 1 / s;
			out.elements = [axis.x * i, axis.y * i, axis.z * i, s * 0.5];
		}
		return out;
	}

	static dot(lhs: Quaternion, rhs: Quaternion): number {
		return lhs._elements[0] * rhs._elements[0] + lhs._elements[1] * rhs._elements[1] + lhs._elements[2] * rhs._elements[2] + lhs._elements[3] * rhs._elements[3];
	}

	// ToDo:
	// mix
	// lerp
	// slerp
	// cross

	//#endregion
}

import { Float3, format, PRECISION, COS_ONE_OVER_TWO } from ".";

export class Quaternion {
	//#region Fields
	private readonly _elements: Float32Array;
	//#endregion

	//#region Properties
	get x() { return this._elements[0]; } set x(value: number) { this._elements[0] = value; }
	get y() { return this._elements[1]; } set y(value: number) { this._elements[1] = value; }
	get z() { return this._elements[2]; } set z(value: number) { this._elements[2] = value; }
	get w() { return this._elements[3]; } set w(value: number) { this._elements[3] = value; }

	get identity() {
		return new Quaternion();
	}

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

		}
	}
	//#endregion

	//#region Instance Methods
	equals(other: Quaternion) {
		return (this === other)
			|| (
				Math.abs(this._elements[0] - other._elements[0]) <= PRECISION
				&& Math.abs(this._elements[1] - other._elements[1]) <= PRECISION
				&& Math.abs(this._elements[2] - other._elements[2]) <= PRECISION
				&& Math.abs(this._elements[3] - other._elements[3]) <= PRECISION
			);
	}

	normalize() {
		const length = Math.hypot(
			this._elements[0],
			this._elements[1],
			this._elements[2],
			this._elements[3]);
		if (length > PRECISION) {
			this._elements[0] / length;
			this._elements[1] / length;
			this._elements[2] / length;
			this._elements[3] / length;
		}
		return this;
	}

	toString(name?: string) {
		return `Quaternion${name && `: ${name}` || ""}\n(${format(this._elements[0], 8, 3)}  ${format(this._elements[1], 8, 3)}  ${format(this._elements[2], 8, 3)}  ${format(this._elements[3], 8, 3)})`;
	}
	//#endregion

	//#region trigonometric
	/** Returns the quaternion rotation angle */
	angle() {
		if (Math.abs(this.w) > COS_ONE_OVER_TWO) {
			return Math.asin(Math.hypot(this.x, this.y, this.z)) * 2;
		}
		return Math.acos(this.w) * 2;
	}

	/** Returns the quaternion rotation axis */
	axis() {
		const tmp1 = 1 - this.w * this.w;
		if (tmp1 <= 0) {
			return new Float3(0, 0, 1);
		}
		const tmp2 = 1 / Math.sqrt(tmp1);
		return new Float3(this.x * tmp2, this.y * tmp2, this.z * tmp2);
	}
	//#endregion
}

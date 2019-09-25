import { PRECISION } from "./constants";

export class Vector3 {

	private elements: [number, number, number];
	public static readonly Zero = new Vector3(0, 0, 0);
	public static readonly X = new Vector3(1, 0, 0);
	public static readonly Y = new Vector3(0, 1, 0);
	public static readonly Z = new Vector3(0, 0, 1);
	public static readonly MinusX = new Vector3(-1, 0, 0);
	public static readonly MinusY = new Vector3(0, -1, 0);
	public static readonly MinusZ = new Vector3(0, 0, -1);

	constructor(x: number | [number, number, number], y?: number, z?: number) {
		if (Array.isArray(x)) {
			if (y !== undefined || z !== undefined) {
				throw new Error("ArgumentException: Either use an array with 3 elements or 3 single numbers to initialize the Vector.");
			}
			if (x.length !== 3) {
				throw new Error("ArgumentOutOfRangeException: The array must contain 3 numbers");
			}
			this.elements = [x[0], x[1], x[2]];
			return;
		}
		if (y === undefined || z === undefined || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
			throw new Error("ArgumentException: Either use an array with 3 elements or 3 single numbers to initialize the Vector.");
		}
		this.elements = [x, y, z];
	}

	/* properties */

	public get x() {
		return this.elements[0];
	}

	public get y() {
		return this.elements[1];
	}

	public get z() {
		return this.elements[2];
	}

	public get length() {
		return Math.sqrt(this.dot(this));
	}

	public get lengthSquared() {
		return this.dot(this);
	}

	/* public methods */
	public toArray() {
		return [...this.elements];
	}

	public toFloat32Array() {
		return new Float32Array(this.elements);
	}

	public map(callbackfn: (value: number, index: number) => number, thisArg?: any) {
		return new Vector3(callbackfn.call(thisArg, this.elements[0], 0),
			callbackfn.call(thisArg, this.elements[1], 1),
			callbackfn.call(thisArg, this.elements[2], 2));
	}

	public toUnitVector() {
		const length = this.length;
		if (length === 0 || length === 1) {
			return new Vector3(this.elements[0], this.elements[1], this.elements[2]);
		}
		return this.map(skalar => skalar / length);
	}

	public angleFrom(vector: Vector3) {
		const length = this.length * vector.length;
		if (length === 0) {
			return undefined;
		}
		const theta = this.dot(vector) / length;
		return Math.acos(Math.min(Math.max(theta, -1), 1));
	}

	public distanceFrom(object: Vector3 /*| Plane*/) {
		// if (object instanceof Plane) {
		//   return object.distanceFrom(this);
		// }
		const dx = this.elements[0] - object.elements[0];
		const dy = this.elements[1] - object.elements[1];
		const dz = this.elements[2] - object.elements[2];
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public isEqualTo(vector: Vector3) {
		return Math.abs(this.elements[0] - vector.elements[0]) <= PRECISION
			&& Math.abs(this.elements[1] - vector.elements[1]) <= PRECISION
			&& Math.abs(this.elements[2] - vector.elements[2]) <= PRECISION;
	}

	public isParallelTo(vector: Vector3) {
		const angle = this.angleFrom(vector);
		return angle === undefined ? undefined : angle <= PRECISION;
	}

	public isAntiparallelTo(vector: Vector3) {
		const angle = this.angleFrom(vector);
		return angle === undefined ? undefined : Math.abs(angle - Math.PI) <= PRECISION;
	}

	public isPerpendicularTo(vector: Vector3) {
		return Math.abs(this.dot(vector)) <= PRECISION;
	}

	public add(vector: Vector3) {
		return new Vector3(this.elements[0] + vector.elements[0],
			this.elements[1] + vector.elements[1],
			this.elements[2] + vector.elements[2]);
	}

	public subtract(vector: Vector3) {
		return new Vector3(this.elements[0] - vector.elements[0],
			this.elements[1] - vector.elements[1],
			this.elements[2] - vector.elements[2]);
	}

	public multiply(skalar: number) {
		return this.map(value => value * skalar);
	}

	public dot(vector: Vector3) {
		return this.elements[0] * vector.elements[0]
			+ this.elements[1] * vector.elements[1]
			+ this.elements[2] * vector.elements[2];
	}

	public cross(vector: Vector3) {
		return new Vector3((this.elements[1] * vector.elements[2]) - (this.elements[2] * vector.elements[1]),
			(this.elements[2] * vector.elements[0]) - (this.elements[0] * vector.elements[2]),
			(this.elements[0] * vector.elements[1]) - (this.elements[1] * vector.elements[0]));
	}

	public static Random() {
		return new Vector3(Math.random(), Math.random(), Math.random());
	}

	public round() {
		return this.map(Math.round);
	}

}

export class Vector4 {

	private readonly elements: [number, number, number, number];
	public static readonly Zero = new Vector4(0, 0, 0, 0);
	public static readonly X = new Vector4(1, 0, 0, 0);
	public static readonly Y = new Vector4(0, 1, 0, 0);
	public static readonly Z = new Vector4(0, 0, 1, 0);
	public static readonly W = new Vector4(0, 0, 0, 1);

	constructor(x: number | [number, number, number, number], y?: number, z?: number, w?: number) {
		if (Array.isArray(x)) {
			if (y !== undefined || z !== undefined || w !== undefined) {
				throw new Error("ArgumentException: Either use an array with 4 elements or 4 single numbers to initialize the Vector.");
			}
			if (x.length !== 4) {
				throw new Error("ArgumentOutOfRangeException: The array must contain 4 numbers");
			}
			this.elements = [x[0], x[1], x[2], x[3]];
			return;
		}
		if (y === undefined || z === undefined || w === undefined || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) || !Number.isFinite(w)) {
			throw new Error("ArgumentException: Either use an array with 4 elements or 4 single numbers to initialize the Vector.");
		}
		this.elements = [x, y, z, w];
	}

	/* properties */

	public get x() {
		return this.elements[0];
	}

	public get y() {
		return this.elements[1];
	}

	public get z() {
		return this.elements[2];
	}

	public get w() {
		return this.elements[3];
	}

	public get length() {
		return Math.sqrt(this.dot(this));
	}

	public get lengthSquared() {
		return this.dot(this);
	}

	/* public methods */
	public toArray() {
		return [...this.elements];
	}

	public toFloat32Array() {
		return new Float32Array(this.elements);
	}

	public map(callbackfn: (value: number, index: number) => number, thisArg?: any) {
		return new Vector4(callbackfn.call(thisArg, this.elements[0], 0),
			callbackfn.call(thisArg, this.elements[1], 1),
			callbackfn.call(thisArg, this.elements[2], 2),
			callbackfn.call(thisArg, this.elements[3], 3));
	}

	public toUnitVector() {
		const length = this.length;
		if (length === 0 || length === 1) {
			return new Vector4(this.elements[0], this.elements[1], this.elements[2], this.elements[3]);
		}
		return this.map(skalar => skalar / length);
	}

	public angleFrom(vector: Vector4) {
		const length = this.length * vector.length;
		if (length === 0) {
			return undefined;
		}
		const theta = this.dot(vector) / length;
		return Math.acos(Math.min(Math.max(theta, -1), 1));
	}

	public distanceFrom(object: Vector4 /*| Plane*/) {
		// if (object instanceof Plane) {
		//   return object.distanceFrom(this);
		// }
		const dx = this.elements[0] - object.elements[0];
		const dy = this.elements[1] - object.elements[1];
		const dz = this.elements[2] - object.elements[2];
		const dw = this.elements[3] - object.elements[3];
		return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
	}

	public isEqualTo(vector: Vector4) {
		return Math.abs(this.elements[0] - vector.elements[0]) <= PRECISION
			&& Math.abs(this.elements[1] - vector.elements[1]) <= PRECISION
			&& Math.abs(this.elements[2] - vector.elements[2]) <= PRECISION
			&& Math.abs(this.elements[3] - vector.elements[3]) <= PRECISION;
	}

	public isParallelTo(vector: Vector4) {
		const angle = this.angleFrom(vector);
		return angle === undefined ? undefined : angle <= PRECISION;
	}

	public isAntiparallelTo(vector: Vector4) {
		const angle = this.angleFrom(vector);
		return angle === undefined ? undefined : Math.abs(angle - Math.PI) <= PRECISION;
	}

	public isPerpendicularTo(vector: Vector4) {
		return Math.abs(this.dot(vector)) <= PRECISION;
	}

	public add(vector: Vector4) {
		return new Vector4(this.elements[0] + vector.elements[0],
			this.elements[1] + vector.elements[1],
			this.elements[2] + vector.elements[2],
			this.elements[3] + vector.elements[3]);
	}

	public subtract(vector: Vector4) {
		return new Vector4(this.elements[0] - vector.elements[0],
			this.elements[1] - vector.elements[1],
			this.elements[2] - vector.elements[2],
			this.elements[3] - vector.elements[3]);
	}

	public multiply(skalar: number) {
		return this.map(value => value * skalar);
	}

	public dot(vector: Vector4) {
		return this.elements[0] * vector.elements[0]
			+ this.elements[1] * vector.elements[1]
			+ this.elements[2] * vector.elements[2]
			+ this.elements[3] * vector.elements[3];
	}

	public static Random() {
		return new Vector4(Math.random(), Math.random(), Math.random(), Math.random());
	}

	public round() {
		return this.map(Math.round);
	}

}

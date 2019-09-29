import { clamp, format, PRECISION } from "./utils";

import { Float3 } from "./float3";
import { Float4 } from "./float4";
import { Matrix3x3 } from "./matrix3x3";

export class Matrix4x4 {
	//#region Fields
	private _m00: number;
	private _m01: number;
	private _m02: number;
	private _m03: number;
	private _m10: number;
	private _m11: number;
	private _m12: number;
	private _m13: number;
	private _m20: number;
	private _m21: number;
	private _m22: number;
	private _m23: number;
	private _m30: number;
	private _m31: number;
	private _m32: number;
	private _m33: number;
	//#endregion

	//#region Properties
	get determinant() {
		// 00 01 02 03
		// 10 11 12 13
		// 20 21 22 23
		// 30 31 32 33

		return (
			this._m00 * this.getSubmatrix(0, 0).determinant
			- this._m01 * this.getSubmatrix(0, 1).determinant
			+ this._m02 * this.getSubmatrix(0, 2).determinant
			- this._m03 * this.getSubmatrix(0, 3).determinant);
	}

	get elements() {
		return [this._m00, this._m10, this._m20, this._m30,
			this._m01, this._m11, this._m21, this._m31,
			this._m02, this._m12, this._m22, this._m32,
			this._m03, this._m13, this._m23, this._m33]
	}

	get inverse() {
		// https://www.youtube.com/watch?v=T8vHPIJqO3Q
		// 00 01 02 03
		// 10 11 12 13
		// 20 21 22 23
		// 30 31 32 33

		const det = this.determinant;
		if (Math.abs(det) <= PRECISION) {
			return Matrix4x4.zero;
		}

		// Adjunkte berechnen
		const adj = new Matrix4x4(
			new Float4(this.getSubmatrix(0, 0).determinant, -this.getSubmatrix(0, 1).determinant, this.getSubmatrix(0, 2).determinant, -this.getSubmatrix(0, 3).determinant),
			new Float4(-this.getSubmatrix(1, 0).determinant, this.getSubmatrix(1, 1).determinant, -this.getSubmatrix(1, 2).determinant, this.getSubmatrix(1, 3).determinant),
			new Float4(this.getSubmatrix(2, 0).determinant, -this.getSubmatrix(2, 1).determinant, this.getSubmatrix(2, 2).determinant, -this.getSubmatrix(2, 3).determinant),
			new Float4(-this.getSubmatrix(3, 0).determinant, this.getSubmatrix(3, 1).determinant, -this.getSubmatrix(3, 2).determinant, this.getSubmatrix(3, 3).determinant));

		return Matrix4x4.mul(adj, 1.0 / det);
	}

	get transposed() {
		return Matrix4x4.transposeMatrix(this);
	}

	static get zero() {
		return new Matrix4x4();
	}

	static get identity() {
		return new Matrix4x4(new Float4(1, 0, 0, 0), new Float4(0, 1, 0, 0), new Float4(0, 0, 1, 0), new Float4(0, 0, 0, 1));
	}
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Matrix4x4);
	constructor(column0: Float4, column1: Float4, column2: Float4, column3: Float4);
	constructor(column0?: Matrix4x4 | Float4, column1?: Float4, column2?: Float4, column3?: Float4) {
		if (column0 === undefined) {
			this._m00 = this._m01 = this._m02 = this._m03 = this._m10 = this._m11 = this._m12 = this._m13 = this._m20 = this._m21 = this._m22 = this._m23 = this._m30 = this._m31 = this._m32 = this._m33 = 0;
		} else if (column0 instanceof Matrix4x4) {
			this._m00 = column0._m00;
			this._m01 = column0._m01;
			this._m02 = column0._m02;
			this._m03 = column0._m03;
			this._m10 = column0._m10;
			this._m11 = column0._m11;
			this._m12 = column0._m12;
			this._m13 = column0._m13;
			this._m20 = column0._m20;
			this._m21 = column0._m21;
			this._m22 = column0._m22;
			this._m23 = column0._m23;
			this._m30 = column0._m30;
			this._m31 = column0._m31;
			this._m32 = column0._m32;
			this._m33 = column0._m33;
		} else if (column1 === undefined || column2 === undefined || column3 === undefined) {
			throw new Error("Invalid ctor overload.");
		} else {
			this._m00 = column0.x;
			this._m01 = column1.x;
			this._m02 = column2.x;
			this._m03 = column3.x;
			this._m10 = column0.y;
			this._m11 = column1.y;
			this._m12 = column2.y;
			this._m13 = column3.y;
			this._m20 = column0.z;
			this._m21 = column1.z;
			this._m22 = column2.z;
			this._m23 = column3.z;
			this._m30 = column0.w;
			this._m31 = column1.w;
			this._m32 = column2.w;
			this._m33 = column3.w;
		}
	}
	//#endregion

	//#region Operators
	static mul(left: Matrix4x4, right: number): Matrix4x4;
	static mul(left: Matrix4x4, right: Float3): Float4;
	static mul(left: Matrix4x4, right: Float4): Float4;
	static mul(left: Matrix4x4, right: Matrix4x4): Matrix4x4;
	static mul(left: Matrix4x4, right: number | Float3 | Float4 | Matrix4x4) {
		if (right instanceof Float3) {
			return new Float4(
				left._m00 * right.x + left._m01 * right.y + left._m02 * right.z + left._m03,
				left._m10 * right.x + left._m11 * right.y + left._m12 * right.z + left._m13,
				left._m20 * right.x + left._m21 * right.y + left._m22 * right.z + left._m23,
				left._m30 * right.x + left._m31 * right.y + left._m32 * right.z + left._m33
			);
		} else if (right instanceof Float4) {
			return new Float4(
				left._m00 * right.x + left._m01 * right.y + left._m02 * right.z + left._m03 * right.w,
				left._m10 * right.x + left._m11 * right.y + left._m12 * right.z + left._m13 * right.w,
				left._m20 * right.x + left._m21 * right.y + left._m22 * right.z + left._m23 * right.w,
				left._m30 * right.x + left._m31 * right.y + left._m32 * right.z + left._m33 * right.w
			);
		} else if (right instanceof Matrix4x4) {
			return new Matrix4x4(
				new Float4(
					left._m00 * right._m00 + left._m01 * right._m10 + left._m02 * right._m20 + left._m03 * right._m30,
					left._m10 * right._m00 + left._m11 * right._m10 + left._m12 * right._m20 + left._m13 * right._m30,
					left._m20 * right._m00 + left._m21 * right._m10 + left._m22 * right._m20 + left._m23 * right._m30,
					left._m30 * right._m00 + left._m31 * right._m10 + left._m32 * right._m20 + left._m33 * right._m30),
				new Float4(
					left._m00 * right._m01 + left._m01 * right._m11 + left._m02 * right._m21 + left._m03 * right._m31,
					left._m10 * right._m01 + left._m11 * right._m11 + left._m12 * right._m21 + left._m13 * right._m31,
					left._m20 * right._m01 + left._m21 * right._m11 + left._m22 * right._m21 + left._m23 * right._m31,
					left._m30 * right._m01 + left._m31 * right._m11 + left._m32 * right._m21 + left._m33 * right._m31),
				new Float4(
					left._m00 * right._m02 + left._m01 * right._m12 + left._m02 * right._m22 + left._m03 * right._m32,
					left._m10 * right._m02 + left._m11 * right._m12 + left._m12 * right._m22 + left._m13 * right._m32,
					left._m20 * right._m02 + left._m21 * right._m12 + left._m22 * right._m22 + left._m23 * right._m32,
					left._m30 * right._m02 + left._m31 * right._m12 + left._m32 * right._m22 + left._m33 * right._m32),
				new Float4(
					left._m00 * right._m03 + left._m01 * right._m13 + left._m02 * right._m23 + left._m03 * right._m33,
					left._m10 * right._m03 + left._m11 * right._m13 + left._m12 * right._m23 + left._m13 * right._m33,
					left._m20 * right._m03 + left._m21 * right._m13 + left._m22 * right._m23 + left._m23 * right._m33,
					left._m30 * right._m03 + left._m31 * right._m13 + left._m32 * right._m23 + left._m33 * right._m33));
		}
		return new Matrix4x4(
			Float4.mul(left.getColumn(0), right),
			Float4.mul(left.getColumn(1), right),
			Float4.mul(left.getColumn(2), right),
			Float4.mul(left.getColumn(3), right));
	}
	//#endregion

	//#region Instance Methods
	getColumn(column: 0 | 1 | 2 | 3) {
		return column === 0
			? new Float4(this._m00, this._m10, this._m20, this._m30)
			: column === 1
				? new Float4(this._m01, this._m11, this._m21, this._m31)
				: column === 2
					? new Float4(this._m02, this._m12, this._m22, this._m32)
					: new Float4(this._m03, this._m13, this._m23, this._m33);
	}

	setColumn(column: 0 | 1 | 2 | 3, v: Float4) {
		if (column === 0) {
			this._m00 = v.x;
			this._m10 = v.y;
			this._m20 = v.z;
			this._m30 = v.w;
		} else if (column === 1) {
			this._m01 = v.x;
			this._m11 = v.y;
			this._m21 = v.z;
			this._m31 = v.w;
		} else if (column === 2) {
			this._m02 = v.x;
			this._m12 = v.y;
			this._m22 = v.z;
			this._m32 = v.w;
		} else {
			this._m03 = v.x;
			this._m13 = v.y;
			this._m23 = v.z;
			this._m33 = v.w;
		}
	}

	getRow(row: 0 | 1 | 2 | 3) {
		return row === 0
			? new Float4(this._m00, this._m01, this._m02, this._m03)
			: row === 1
				? new Float4(this._m10, this._m11, this._m12, this._m13)
				: row === 2
					? new Float4(this._m20, this._m21, this._m22, this._m23)
					: new Float4(this._m30, this._m31, this._m32, this._m33);
	}

	setRow(row: 0 | 1 | 2 | 3, v: Float4) {
		if (row === 0) {
			this._m00 = v.x;
			this._m01 = v.y;
			this._m02 = v.z;
			this._m03 = v.w;
		} else if (row === 1) {
			this._m10 = v.x;
			this._m11 = v.y;
			this._m12 = v.z;
			this._m13 = v.w;
		} else if (row === 2) {
			this._m20 = v.x;
			this._m21 = v.y;
			this._m22 = v.z;
			this._m23 = v.w;
		} else {
			this._m30 = v.x;
			this._m31 = v.y;
			this._m32 = v.z;
			this._m33 = v.w;
		}
	}

	getSubmatrix(row: 0 | 1 | 2 | 3, column: 0 | 1 | 2 | 3) {
		// 00 01 02 03
		// 10 11 12 13
		// 20 21 22 23
		// 30 31 32 33

		switch (row) {
			case 0:
				switch (column) {
					case 0:
						return new Matrix3x3(new Float3(this._m11, this._m21, this._m31), new Float3(this._m12, this._m22, this._m32), new Float3(this._m13, this._m23, this._m33));
					case 1:
						return new Matrix3x3(new Float3(this._m10, this._m20, this._m30), new Float3(this._m12, this._m22, this._m32), new Float3(this._m13, this._m23, this._m33));
					case 2:
						return new Matrix3x3(new Float3(this._m10, this._m20, this._m30), new Float3(this._m11, this._m21, this._m31), new Float3(this._m13, this._m23, this._m33));
				}
				return new Matrix3x3(new Float3(this._m10, this._m20, this._m30), new Float3(this._m11, this._m21, this._m31), new Float3(this._m12, this._m22, this._m32));
			case 1:
				switch (column) {
					case 0:
						return new Matrix3x3(new Float3(this._m01, this._m21, this._m31), new Float3(this._m02, this._m22, this._m32), new Float3(this._m03, this._m23, this._m33));
					case 1:
						return new Matrix3x3(new Float3(this._m00, this._m20, this._m30), new Float3(this._m02, this._m22, this._m32), new Float3(this._m03, this._m23, this._m33));
					case 2:
						return new Matrix3x3(new Float3(this._m00, this._m20, this._m30), new Float3(this._m01, this._m21, this._m31), new Float3(this._m03, this._m23, this._m33));
				}
				return new Matrix3x3(new Float3(this._m00, this._m20, this._m30), new Float3(this._m01, this._m21, this._m31), new Float3(this._m02, this._m22, this._m32));
			case 2:
				switch (column) {
					case 0:
						return new Matrix3x3(new Float3(this._m01, this._m11, this._m31), new Float3(this._m02, this._m12, this._m32), new Float3(this._m03, this._m13, this._m33));
					case 1:
						return new Matrix3x3(new Float3(this._m00, this._m10, this._m30), new Float3(this._m02, this._m12, this._m32), new Float3(this._m03, this._m13, this._m33));
					case 2:
						return new Matrix3x3(new Float3(this._m00, this._m10, this._m30), new Float3(this._m01, this._m11, this._m31), new Float3(this._m03, this._m13, this._m33));
				}
				return new Matrix3x3(new Float3(this._m00, this._m10, this._m30), new Float3(this._m01, this._m11, this._m31), new Float3(this._m02, this._m12, this._m32));
		}
		switch (column) {
			case 0:
				return new Matrix3x3(new Float3(this._m01, this._m11, this._m21), new Float3(this._m02, this._m12, this._m22), new Float3(this._m03, this._m13, this._m23));
			case 1:
				return new Matrix3x3(new Float3(this._m00, this._m10, this._m20), new Float3(this._m02, this._m12, this._m22), new Float3(this._m03, this._m13, this._m23));
			case 2:
				return new Matrix3x3(new Float3(this._m00, this._m10, this._m20), new Float3(this._m01, this._m11, this._m21), new Float3(this._m03, this._m13, this._m23));
		}
		return new Matrix3x3(new Float3(this._m00, this._m10, this._m20), new Float3(this._m01, this._m11, this._m21), new Float3(this._m02, this._m12, this._m22));
	}

	multiplyPoint(p: Float3) {
		const x = (this._m00 * p.x + this._m01 * p.y + this._m02 * p.z) + this._m03;
		const y = (this._m10 * p.x + this._m11 * p.y + this._m12 * p.z) + this._m13;
		const z = (this._m20 * p.x + this._m21 * p.y + this._m22 * p.z) + this._m23;
		const w = (this._m30 * p.x + this._m31 * p.y + this._m32 * p.z) + this._m33;
		if (Math.abs(w) <= PRECISION) {
			return Float3.zero;
		}
		const n = 1.0 / w;
		return new Float3(x * n, y * n, z * n);
	}

	multiplyPointFast(p: Float3) {
		return new Float3(
			(this._m00 * p.x + this._m01 * p.y + this._m02 * p.z) + this._m03,
			(this._m10 * p.x + this._m11 * p.y + this._m12 * p.z) + this._m13,
			(this._m20 * p.x + this._m21 * p.y + this._m22 * p.z) + this._m23);
	}

	multiplyVector(v: Float3 | Float4) {
		return new Float3(
			this._m00 * v.x + this._m01 * v.y + this._m02 * v.z,
			this._m10 * v.x + this._m11 * v.y + this._m12 * v.z,
			this._m20 * v.x + this._m21 * v.y + this._m22 * v.z);
	}

	equals(other: Matrix4x4) {
		return (this === other)
			|| (Math.abs(this._m00 - other._m00) <= PRECISION
				&& Math.abs(this._m01 - other._m01) <= PRECISION
				&& Math.abs(this._m02 - other._m02) <= PRECISION
				&& Math.abs(this._m03 - other._m03) <= PRECISION
				&& Math.abs(this._m10 - other._m10) <= PRECISION
				&& Math.abs(this._m11 - other._m11) <= PRECISION
				&& Math.abs(this._m12 - other._m12) <= PRECISION
				&& Math.abs(this._m13 - other._m13) <= PRECISION
				&& Math.abs(this._m20 - other._m20) <= PRECISION
				&& Math.abs(this._m21 - other._m21) <= PRECISION
				&& Math.abs(this._m22 - other._m22) <= PRECISION
				&& Math.abs(this._m23 - other._m23) <= PRECISION
				&& Math.abs(this._m30 - other._m30) <= PRECISION
				&& Math.abs(this._m31 - other._m31) <= PRECISION
				&& Math.abs(this._m32 - other._m32) <= PRECISION
				&& Math.abs(this._m33 - other._m33) <= PRECISION
			);
	}

	toString() {
		return `Matrix4x4\n|${format(this._m00, 8, 3)}  ${format(this._m01, 8, 3)}  ${format(this._m02, 8, 3)}  ${format(this._m03, 8, 3)}|\n|${format(this._m10, 8, 3)}  ${format(this._m11, 8, 3)}  ${format(this._m12, 8, 3)}  ${format(this._m13, 8, 3)}|\n|${format(this._m20, 8, 3)}  ${format(this._m21, 8, 3)}  ${format(this._m22, 8, 3)}  ${format(this._m23, 8, 3)}|\n|${format(this._m30, 8, 3)}  ${format(this._m31, 8, 3)}  ${format(this._m32, 8, 3)}  ${format(this._m33, 8, 3)}|`;
	}
	//#endregion

	//#region Static Methods
	static createLookAtMatrix(eye: Float3, at: Float3, up: Float3) {
		const zAxis = Float3.sub(at, eye).normalized;
		const xAxis = Float3.cross(up, zAxis).normalized;
		const yAxis = Float3.cross(zAxis, xAxis);

		return new Matrix4x4(
			new Float4(xAxis.x, xAxis.y, xAxis.z, -Float3.dot(xAxis, eye)),
			new Float4(yAxis.x, yAxis.y, yAxis.z, -Float3.dot(yAxis, eye)),
			new Float4(zAxis.x, zAxis.y, zAxis.z, -Float3.dot(zAxis, eye)),
			new Float4(0, 0, 0, 1));
	}

	static createPerspectiveMatrix(width: number, height: number, near: number, far: number) {
		if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(near) || !Number.isFinite(far) || width <= 0 || height <= 0 || near <= 0 || far < near) {
			throw new Error('Invalid Parameter Values.');
		}

		return new Matrix4x4(
			new Float4(2 * near / width, 0, 0, 0),
			new Float4(0, 2 * near / height, 0, 0),
			new Float4(0, 0, far / (far - near), near * far / (near - far)),
			new Float4(0, 0, 1, 0));
	}

	static createPerspectiveFoVMatrix(fov: number, aspectRatio: number, near: number, far: number) {
		if (!Number.isFinite(fov) || !Number.isFinite(aspectRatio) || !Number.isFinite(near) || !Number.isFinite(far) || fov <= 0 || fov >= Math.PI || aspectRatio <= 0 || near <= 0 || far < near) {
			throw new Error('Invalid Parameter Values.');
		}

		const fov2 = fov * 0.5;
		const yScale = 1 / Math.tan(fov2);
		const xScale = yScale / aspectRatio;

		return new Matrix4x4(
			new Float4(xScale, 0, 0, 0),
			new Float4(0, yScale, 0, 0),
			new Float4(0, 0, far / (far - near), -near * far / (far - near)),
			new Float4(0, 0, 1, 0));
	}

	static createOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
		if (!Number.isFinite(left)
			|| !Number.isFinite(right)
			|| !Number.isFinite(top)
			|| !Number.isFinite(bottom)
			|| !Number.isFinite(near)
			|| !Number.isFinite(far)
			|| Math.abs(left - right) < PRECISION
			|| Math.abs(bottom - top) < PRECISION
			|| Math.abs(near - far) < PRECISION) {
			throw new Error('Invalid Parameter Values.');
		}

		const widthRatio = 1.0 / (right - left);
		const heightRatio = 1.0 / (top - bottom);
		const depthRatio = 1.0 / (far - near);

		const sx = 2 * widthRatio;
		const sy = 2 * heightRatio;
		const sz = -2 * depthRatio;

		const tx = -(right + left) * widthRatio;
		const ty = -(top + bottom) * heightRatio;
		const tz = -(far + near) * depthRatio;

		return new Matrix4x4(
			new Float4(sx, 0, 0, 0),
			new Float4(0, sx, 0, 0),
			new Float4(0, 0, sz, 0),
			new Float4(tx, ty, tz, 1));
	}

	static createRotationMatrix(axis: Float3, angle: number) {
		const { x, y, z } = axis.normalized;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		return new Matrix4x4(
			new Float4(cos + x * x * (1 - cos), y * x * (1 - cos) + z * sin, z * x * (1 - cos) - y * sin, 0),
			new Float4(x * y * (1 - cos) - z * sin, cos + y * y * (1 - cos), z * y * (1 - cos) + x * sin, 0),
			new Float4(x * z * (1 - cos) + y * sin, y * z * (1 - cos) - x * sin, cos + z * z * (1 - cos), 0),
			new Float4(0, 0, 0, 1));
	}

	static createScreenSpaceTransformMatrix(width: number, height: number) {
		const halfWidth = (clamp(width, 4096) | 0) * 0.5;
		const halfHeight = (clamp(height, 4096) | 0) * 0.5;

		return new Matrix4x4(
			new Float4(halfWidth, 0, 0, 0),
			new Float4(0, -halfHeight, 0, 0),
			new Float4(0, 0, 1, 0),
			new Float4(halfWidth, halfHeight, 0, 1));
	}

	static createTranslationMatrix(x: number, y: number, z: number) {
		return new Matrix4x4(
			new Float4(1, 0, 0, 0),
			new Float4(0, 1, 0, 0),
			new Float4(0, 0, 1, 0),
			new Float4(x, y, z, 1));
	}

	static transposeMatrix(matrix: Matrix4x4) {
		return new Matrix4x4(matrix.getRow(0), matrix.getRow(1), matrix.getRow(2), matrix.getRow(3));
	}
	//#endregion
}

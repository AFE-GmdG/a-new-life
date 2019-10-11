import { format, PRECISION } from "./utils";

import { Float2 } from "./float2";
import { Float3 } from "./float3";
import { Matrix2x2 } from "./matrix2x2";

export class Matrix3x3 {
	//#region Fields
	private _m00: number;
	private _m01: number;
	private _m02: number;
	private _m10: number;
	private _m11: number;
	private _m12: number;
	private _m20: number;
	private _m21: number;
	private _m22: number;
	//#endregion

	//#region Properties
	get determinant() {
		// 00 01 02
		// 10 11 12
		// 20 21 22

		return (this._m00 * this._m11 * this._m22
			+ this._m01 * this._m12 * this._m20
			+ this._m02 * this._m10 * this._m21
			- this._m20 * this._m11 * this._m02
			- this._m21 * this._m12 * this._m00
			- this._m22 * this._m10 * this._m01);
	}

	get inverse() {
		// https://www.youtube.com/watch?v=T8vHPIJqO3Q
		// 00 01 02
		// 10 11 12
		// 20 21 22

		const det = this.determinant;
		if (Math.abs(det) <= PRECISION) {
			return Matrix3x3.zero;
		}

		// Adjunkte berechnen
		const adj = new Matrix3x3(
			new Float3(this.getSubmatrix(0, 0).determinant, -this.getSubmatrix(0, 1).determinant, this.getSubmatrix(0, 2).determinant),
			new Float3(-this.getSubmatrix(1, 0).determinant, this.getSubmatrix(1, 1).determinant, -this.getSubmatrix(1, 2).determinant),
			new Float3(this.getSubmatrix(2, 0).determinant, -this.getSubmatrix(2, 1).determinant, this.getSubmatrix(2, 2).determinant));

		return Matrix3x3.mul(adj, 1.0 / det);
	}

	get transposed() {
		return Matrix3x3.transposeMatrix(this);
	}

	static get zero() {
		return new Matrix3x3();
	}

	static get identity() {
		return new Matrix3x3(new Float3(1, 0, 0), new Float3(0, 1, 0), new Float3(0, 0, 1));
	}
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Matrix3x3);
	constructor(column0: Float3, column1: Float3, column2: Float3);
	constructor(column0?: Matrix3x3 | Float3, column1?: Float3, column2?: Float3) {
		if (column0 === undefined) {
			this._m00 = this._m01 = this._m02 = this._m10 = this._m11 = this._m12 = this._m20 = this._m21 = this._m22 = 0;
		} else if (column0 instanceof Matrix3x3) {
			this._m00 = column0._m00;
			this._m01 = column0._m01;
			this._m02 = column0._m02;
			this._m10 = column0._m10;
			this._m11 = column0._m11;
			this._m12 = column0._m12;
			this._m20 = column0._m20;
			this._m21 = column0._m21;
			this._m22 = column0._m22;
		} else if (column1 === undefined || column2 === undefined) {
			throw new Error("Invalid ctor overload.");
		} else {
			this._m00 = column0.x;
			this._m01 = column1.x;
			this._m02 = column2.x;
			this._m10 = column0.y;
			this._m11 = column1.y;
			this._m12 = column2.y;
			this._m20 = column0.z;
			this._m21 = column1.z;
			this._m22 = column2.z;
		}
	}
	//#endregion

	//#region Operators
	static mul(left: Matrix3x3, right: number): Matrix3x3;
	static mul(left: Matrix3x3, right: Matrix3x3): Matrix3x3;
	static mul(left: Matrix3x3, right: number | Matrix3x3) {
		if (right instanceof Matrix3x3) {
			return new Matrix3x3(
				new Float3(
					left._m00 * right._m00 + left._m01 * right._m10 + left._m02 * right._m20,
					left._m10 * right._m00 + left._m11 * right._m10 + left._m12 * right._m20,
					left._m20 * right._m00 + left._m21 * right._m10 + left._m22 * right._m20),
				new Float3(
					left._m00 * right._m01 + left._m01 * right._m11 + left._m02 * right._m21,
					left._m10 * right._m01 + left._m11 * right._m11 + left._m12 * right._m21,
					left._m20 * right._m01 + left._m21 * right._m11 + left._m22 * right._m21),
				new Float3(
					left._m00 * right._m02 + left._m01 * right._m12 + left._m02 * right._m22,
					left._m10 * right._m02 + left._m11 * right._m12 + left._m12 * right._m22,
					left._m20 * right._m02 + left._m21 * right._m12 + left._m22 * right._m22));
		}
		return new Matrix3x3(
			Float3.mul(left.getColumn(0), right),
			Float3.mul(left.getColumn(1), right),
			Float3.mul(left.getColumn(2), right));
	}
	//#endregion

	//#region Instance Methods
	getColumn(column: 0 | 1 | 2) {
		return column === 0
			? new Float3(this._m00, this._m10, this._m20)
			: column === 1
				? new Float3(this._m01, this._m11, this._m21)
				: new Float3(this._m02, this._m12, this._m22);
	}

	setColumn(column: 0 | 1 | 2, v: Float3) {
		if (column === 0) {
			this._m00 = v.x;
			this._m10 = v.y;
			this._m20 = v.z;
		} else if (column === 1) {
			this._m01 = v.x;
			this._m11 = v.y;
			this._m21 = v.z;
		} else {
			this._m02 = v.x;
			this._m12 = v.y;
			this._m22 = v.z;
		}
	}

	getRow(row: 0 | 1 | 2) {
		return row === 0
			? new Float3(this._m00, this._m01, this._m02)
			: row === 1
				? new Float3(this._m10, this._m11, this._m12)
				: new Float3(this._m20, this._m21, this._m22);
	}

	setRow(row: 0 | 1 | 2, v: Float3) {
		if (row === 0) {
			this._m00 = v.x;
			this._m01 = v.y;
			this._m02 = v.z;
		} else if (row === 1) {
			this._m10 = v.x;
			this._m11 = v.y;
			this._m12 = v.z;
		} else {
			this._m20 = v.x;
			this._m21 = v.y;
			this._m22 = v.z;
		}
	}

	getSubmatrix(row: 0 | 1 | 2, column: 0 | 1 | 2) {
		// 00 01 02
		// 10 11 12
		// 20 21 22

		switch (row) {
			case 0:
				switch (column) {
					case 0:
						return new Matrix2x2(new Float2(this._m11, this._m21), new Float2(this._m12, this._m22));
					case 1:
						return new Matrix2x2(new Float2(this._m10, this._m20), new Float2(this._m12, this._m22));
				}
				return new Matrix2x2(new Float2(this._m10, this._m20), new Float2(this._m11, this._m21));
			case 1:
				switch (column) {
					case 0:
						return new Matrix2x2(new Float2(this._m01, this._m21), new Float2(this._m02, this._m22));
					case 1:
						return new Matrix2x2(new Float2(this._m00, this._m20), new Float2(this._m02, this._m22));
				}
				return new Matrix2x2(new Float2(this._m00, this._m20), new Float2(this._m01, this._m21));
		}
		switch (column) {
			case 0:
				return new Matrix2x2(new Float2(this._m01, this._m11), new Float2(this._m02, this._m12));
			case 1:
				return new Matrix2x2(new Float2(this._m00, this._m10), new Float2(this._m02, this._m12));
		}
		return new Matrix2x2(new Float2(this._m00, this._m10), new Float2(this._m01, this._m11));
	}

	equals(other: Matrix3x3) {
		return (this === other)
			|| (Math.abs(this._m00 - other._m00) <= PRECISION
				&& Math.abs(this._m01 - other._m01) <= PRECISION
				&& Math.abs(this._m02 - other._m02) <= PRECISION
				&& Math.abs(this._m10 - other._m10) <= PRECISION
				&& Math.abs(this._m11 - other._m11) <= PRECISION
				&& Math.abs(this._m12 - other._m12) <= PRECISION
				&& Math.abs(this._m20 - other._m20) <= PRECISION
				&& Math.abs(this._m21 - other._m21) <= PRECISION
				&& Math.abs(this._m22 - other._m22) <= PRECISION);
	}

	toString() {
		return `Matrix3x3\n|${format(this._m00, 8, 3)}  ${format(this._m01, 8, 3)}  ${format(this._m02, 8, 3)}|\n|${format(this._m10, 8, 3)}  ${format(this._m11, 8, 3)}  ${format(this._m12, 8, 3)}|\n|${format(this._m20, 8, 3)}  ${format(this._m21, 8, 3)}  ${format(this._m22, 8, 3)}|`;
	}
	//#endregion

	//#region Static Methods
	static transposeMatrix(matrix: Matrix3x3) {
		return new Matrix3x3(matrix.getRow(0), matrix.getRow(1), matrix.getRow(2));
	}
	//#endregion
}

(window as any).Matrix3x3 = Matrix3x3;

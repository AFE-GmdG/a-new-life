import { format, PRECISION } from "./utils";
import { Float2 } from "./float2";

export class Matrix2x2 {
	//#region Fields
	private _m00: number;
	private _m01: number;
	private _m10: number;
	private _m11: number;
	//#endregion

	//#region Properties
	get determinant() {
		// 00 01
		// 10 11

		return (this._m00 * this._m11
			- this._m10 * this._m01);
	}

	get inverse(): Matrix2x2 {
		// https://www.youtube.com/watch?v=T8vHPIJqO3Q
		// 00 01
		// 10 11

		const det = this.determinant;
		if (Math.abs(det) <= PRECISION) {
			return Matrix2x2.zero;
		}

		// Adjunkte berechnen
		const adj = new Matrix2x2(
			new Float2(this._m11, -this._m10),
			new Float2(-this._m01, this._m00));

		return Matrix2x2.mul(adj, 1.0 / det);
	}

	get transposed() {
		return Matrix2x2.transposeMatrix(this);
	}

	static get zero() {
		return new Matrix2x2();
	}

	static get identity() {
		return new Matrix2x2(new Float2(1, 0), new Float2(0, 1));
	}
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Matrix2x2);
	constructor(column0: Float2, column1: Float2);
	constructor(column0?: Matrix2x2 | Float2, column1?: Float2) {
		if (column0 === undefined) {
			this._m00 = this._m01 = this._m10 = this._m11 = 0;
		} else if (column0 instanceof Matrix2x2) {
			this._m00 = column0._m00;
			this._m01 = column0._m01;
			this._m10 = column0._m10;
			this._m11 = column0._m11;
		} else if (column1 === undefined) {
			throw new Error("Invalid ctor overload.");
		} else {
			this._m00 = column0.x;
			this._m01 = column1.x;
			this._m10 = column0.y;
			this._m11 = column1.y;
		}
	}
	//#endregion

	//#region Operators
	static mul(left: Matrix2x2, right: number): Matrix2x2;
	static mul(left: Matrix2x2, right: Matrix2x2): Matrix2x2;
	static mul(left: Matrix2x2, right: number | Matrix2x2) {
		if (right instanceof Matrix2x2) {
			return new Matrix2x2(
				new Float2(
					left._m00 * right._m00 + left._m01 * right._m10,
					left._m10 * right._m00 + left._m11 * right._m10),
				new Float2(
					left._m00 * right._m01 + left._m01 * right._m11,
					left._m10 * right._m01 + left._m11 * right._m11));
		}
		return new Matrix2x2(
			Float2.mul(left.getColumn(0), right),
			Float2.mul(left.getColumn(1), right));
	}
	//#endregion

	//#region Instance Methods
	getColumn(column: 0 | 1) {
		return column === 0
			? new Float2(this._m00, this._m10)
			: new Float2(this._m01, this._m11);
	}

	setColumn(column: 0 | 1, v: Float2) {
		if (column === 0) {
			this._m00 = v.x;
			this._m10 = v.y;
		} else {
			this._m01 = v.x;
			this._m11 = v.y;
		}
	}

	getRow(row: 0 | 1) {
		return row === 0
			? new Float2(this._m00, this._m01)
			: new Float2(this._m10, this._m11);
	}

	setRow(row: 0 | 1 | 2, v: Float2) {
		if (row === 0) {
			this._m00 = v.x;
			this._m01 = v.y;
		} else {
			this._m10 = v.x;
			this._m11 = v.y;
		}
	}

	equals(other: Matrix2x2) {
		return (this === other)
			|| (Math.abs(this._m00 - other._m00) <= PRECISION
				&& Math.abs(this._m01 - other._m01) <= PRECISION
				&& Math.abs(this._m10 - other._m10) <= PRECISION
				&& Math.abs(this._m11 - other._m11) <= PRECISION);
	}

	toString() {
		return `Matrix2x2\n|${format(this._m00, 8, 3)}  ${format(this._m01, 8, 3)}|\n|${format(this._m10, 8, 3)}  ${format(this._m11, 8, 3)}|`;
	}
	//#endregion

	//#region Static Methods
	static transposeMatrix(matrix: Matrix2x2) {
		return new Matrix2x2(matrix.getRow(0), matrix.getRow(1));
	}
	//#endregion
}

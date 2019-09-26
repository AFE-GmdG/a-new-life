import { format, PRECISION, DEG2RAD } from "./utils";
import { Float3 } from "./float3";
import { Float4 } from "./float4";

export class Float2 {
	//#region Fields
	private _x: number;
	private _y: number;
	//#endregion

	//#region Properties
	get x() { return this._x; } set x(value: number) { this._x = value; }
	get y() { return this._y; } set y(value: number) { this._y = value; }

	get xx() { return new Float2(this._x, this._x); } set xx(value: Float2) { this._x = value._y; }
	get xy() { return new Float2(this._x, this._y); } set xy(value: Float2) { this._x = value._x; this._y = value._y; }
	get yx() { return new Float2(this._y, this._x); } set yx(value: Float2) { this._y = value._x; this._x = value._y; }
	get yy() { return new Float2(this._y, this._y); } set yy(value: Float2) { this._y = value._y; }

	get xxx() { return new Float3(this._x, this._x, this._x); } set xxx(value: Float3) { this._x = value.z; }
	get xxy() { return new Float3(this._x, this._x, this._y); } set xxy(value: Float3) { this._x = value.y; this._y = value.z; }
	get xyx() { return new Float3(this._x, this._y, this._x); } set xyx(value: Float3) { this._y = value.y; this._x = value.z; }
	get xyy() { return new Float3(this._x, this._y, this._y); } set xyy(value: Float3) { this._x = value.x; this._y = value.z; }
	get yxx() { return new Float3(this._y, this._x, this._x); } set yxx(value: Float3) { this._y = value.x; this._x = value.z; }
	get yxy() { return new Float3(this._y, this._x, this._y); } set yxy(value: Float3) { this._x = value.y; this._y = value.z; }
	get yyx() { return new Float3(this._y, this._y, this._x); } set yyx(value: Float3) { this._y = value.y; this._x = value.z; }
	get yyy() { return new Float3(this._y, this._y, this._y); } set yyy(value: Float3) { this._y = value.z; }

	get xxxx() { return new Float4(this._x, this._x, this._x, this._x); } set xxxx(value: Float4) { this._x = value.w; }
	get xxxy() { return new Float4(this._x, this._x, this._x, this._y); } set xxxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get xxyx() { return new Float4(this._x, this._x, this._y, this._x); } set xxyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get xxyy() { return new Float4(this._x, this._x, this._y, this._y); } set xxyy(value: Float4) { this._x = value.y; this._y = value.w; }
	get xyxx() { return new Float4(this._x, this._y, this._x, this._x); } set xyxx(value: Float4) { this._y = value.y; this._x = value.w; }
	get xyxy() { return new Float4(this._x, this._y, this._x, this._y); } set xyxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get xyyx() { return new Float4(this._x, this._y, this._y, this._x); } set xyyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get xyyy() { return new Float4(this._x, this._y, this._y, this._y); } set xyyy(value: Float4) { this._x = value.x; this._y = value.w; }
	get yxxx() { return new Float4(this._y, this._x, this._x, this._x); } set yxxx(value: Float4) { this._y = value.x; this._x = value.w; }
	get yxxy() { return new Float4(this._y, this._x, this._x, this._y); } set yxxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get yxyx() { return new Float4(this._y, this._x, this._y, this._x); } set yxyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get yxyy() { return new Float4(this._y, this._x, this._y, this._y); } set yxyy(value: Float4) { this._x = value.y; this._y = value.w; }
	get yyxx() { return new Float4(this._y, this._y, this._x, this._x); } set yyxx(value: Float4) { this._y = value.y; this._x = value.w; }
	get yyxy() { return new Float4(this._y, this._y, this._x, this._y); } set yyxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get yyyx() { return new Float4(this._y, this._y, this._y, this._x); } set yyyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get yyyy() { return new Float4(this._y, this._y, this._y, this._y); } set yyyy(value: Float4) { this._y = value.w; }

	get length() { return Float2.magnitude(this); }
	get normalized() { return Float2.normalize(this); }

	static get zero() { return new Float2(); }
	static get one() { return new Float2(1); }
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Float2);
	constructor(x: number);
	constructor(x: number, y: number);
	constructor(x?: number | Float2, y?: number) {
		if (x === undefined) {
			this._x = this._y = 0;
		} else if (x instanceof Float2) {
			this._x = x._x;
			this._y = x._y;
		} else if (y === undefined) {
			this._x = this._y = x;
		} else {
			this._x = x;
			this._y = y;
		}
	}
	//#endregion

	//#region Operators
	static add(left: Float2, right: number): Float2;
	static add(left: Float2, right: Float2): Float2;
	static add(left: Float2, right: number | Float2) {
		if (right instanceof Float2) {
			return new Float2(left._x + right._x, left._y + right._y);
		}
		return new Float2(left._x + right, left._y + right);
	}

	static sub(left: Float2, right: number): Float2;
	static sub(left: Float2, right: Float2): Float2;
	static sub(left: Float2, right: number | Float2) {
		if (right instanceof Float2) {
			return new Float2(left._x - right._x, left._y - right._y);
		}
		return new Float2(left._x - right, left._y - right);
	}

	static mul(left: Float2, right: number): Float2;
	static mul(left: Float2, right: Float2): Float2;
	static mul(left: Float2, right: number | Float2) {
		if (right instanceof Float2) {
			return new Float2(left._x * right._x, left._y * right._y);
		}
		return new Float2(left._x * right, left._y * right);
	}

	static div(left: Float2, right: number): Float2;
	static div(left: Float2, right: Float2): Float2;
	static div(left: Float2, right: number | Float2) {
		if (right instanceof Float2) {
			return new Float2(left._x / right._x, left._y / right._y);
		}
		return new Float2(left._x / right, left._y / right);
	}

	static mod(left: Float2, right: number): Float2;
	static mod(left: Float2, right: Float2): Float2;
	static mod(left: Float2, right: number | Float2) {
		if (right instanceof Float2) {
			const x = left._x % right._x, y = left._y % right._y;
			return new Float2(x < 0 ? x + right._x : x, y < 0 ? y + right._y : y);
		}
		const x = left._x % right, y = left._y % right;
		return new Float2(x < 0 ? x + right : x, y < 0 ? y + right : y);
	}
	//#endregion

	//#region Instance Methods
	equals(other: Float2) {
		return (this === other)
			|| (Math.abs(this._x - other._x) <= PRECISION && Math.abs(this._y - other._y) <= PRECISION);
	}

	toString() {
		return `Float2(${format(this._x, 8, 3)}  ${format(this._y, 8, 3)})`;
	}
	//#endregion

	//#region Static Methods
	static abs(v: Float2) {
		return new Float2(Math.abs(v._x), Math.abs(v._y));
	}

	static cross(v1: Float2, v2: Float2) {
		return v1._x * v2._y - v2._x * v1._y;
	}

	static distance(a: Float2, b: Float2) {
		return Float2.magnitude(Float2.sub(a, b));
	}

	static dot(v1: Float2, v2: Float2) {
		return v1._x * v2._x + v1._y * v2._y;
	}

	static floor(v: Float2) {
		return new Float2(Math.floor(v._x), Math.floor(v._y));
	}

	static frac(v: Float2) {
		const x = v._x % 1, y = v._y % 1;
		return new Float2(x < 0 ? x + 1 : x, y < 0 ? y + 1 : y);
	}

	static lerp(a: Float2, b: Float2, t: number) {
		return new Float2(a._x + (b._x - a._x) * t, a._y + (b._y - a._y) * t);
	}

	static magnitude(v: Float2) {
		return Math.hypot(v._x, v._y);
	}

	static max(...v: Float2[]) {
		return new Float2(Math.max(...v.map(v => v._x)), Math.max(...v.map(v => v._y)));
	}

	static min(...v: Float2[]) {
		return new Float2(Math.min(...v.map(v => v._x)), Math.min(...v.map(v => v._y)));
	}

	static normalize(v: Float2) {
		const num = Float2.magnitude(v);
		if (num > 9.99999974737875E-06) {
			return Float2.div(v, num);
		}
		return Float2.zero;
	}

	static rotateDegrees(v: Float2, angle: number) {
		return Float2.rotateRadians(v, angle * DEG2RAD);
	}

	static rotateRadians(v: Float2, angle: number) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Float2(v._x * cos - v._y * sin, v._x * sin + v._y * cos);
	}

	static sqrMagnitude(v: Float2) {
		return Float2.dot(v, v);
	}
	//#endregion
}

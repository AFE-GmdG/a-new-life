import { format, PRECISION, DEG2RAD } from "./utils";
import { Float2 } from "./float2";
import { Float4 } from "./float4";

export class Float3 {
	//#region Fields
	private _x: number;
	private _y: number;
	private _z: number;
	//#endregion

	//#region Properties
	get x() { return this._x; } set x(value: number) { this._x = value; }
	get y() { return this._y; } set y(value: number) { this._y = value; }
	get z() { return this._z; } set z(value: number) { this._z = value; }
	get elements(): [number, number, number] { return [this._x, this._y, this._z]; }
	set elements(value: [number, number, number]) { this._x = value[0]; this._y = value[1]; this._z = value[2]; }

	get xx() { return new Float2(this._x, this._x); } set xx(value: Float2) { this._x = value.y; }
	get xy() { return new Float2(this._x, this._y); } set xy(value: Float2) { this._x = value.x; this._y = value.y; }
	get xz() { return new Float2(this._x, this._z); } set xz(value: Float2) { this._x = value.x; this._z = value.y; }
	get yx() { return new Float2(this._y, this._x); } set yx(value: Float2) { this._y = value.x; this._x = value.y; }
	get yy() { return new Float2(this._y, this._y); } set yy(value: Float2) { this._y = value.y; }
	get yz() { return new Float2(this._y, this._z); } set yz(value: Float2) { this._y = value.x; this._z = value.y; }
	get zx() { return new Float2(this._z, this._x); } set zx(value: Float2) { this._z = value.x; this._x = value.y; }
	get zy() { return new Float2(this._z, this._y); } set zy(value: Float2) { this._z = value.x; this._y = value.y; }
	get zz() { return new Float2(this._z, this._z); } set zz(value: Float2) { this._z = value.y; }

	get xxx() { return new Float3(this._x, this._x, this._x); } set xxx(value: Float3) { this._x = value._z; }
	get xxy() { return new Float3(this._x, this._x, this._y); } set xxy(value: Float3) { this._x = value._y; this._y = value._z; }
	get xxz() { return new Float3(this._x, this._x, this._z); } set xxz(value: Float3) { this._x = value._y; this._z = value._z; }
	get xyx() { return new Float3(this._x, this._y, this._x); } set xyx(value: Float3) { this._y = value._y; this._x = value._z; }
	get xyy() { return new Float3(this._x, this._y, this._y); } set xyy(value: Float3) { this._x = value._x; this._y = value._z; }
	get xyz() { return new Float3(this._x, this._y, this._z); } set xyz(value: Float3) { this._x = value._x; this._y = value._y; this._z = value._z; }
	get xzx() { return new Float3(this._x, this._z, this._x); } set xzx(value: Float3) { this._z = value._y; this._x = value._z; }
	get xzy() { return new Float3(this._x, this._z, this._y); } set xzy(value: Float3) { this._x = value._x; this._z = value._y; this._y = value._z; }
	get xzz() { return new Float3(this._x, this._z, this._z); } set xzz(value: Float3) { this._x = value._x; this._z = value._z; }
	get yxx() { return new Float3(this._y, this._x, this._x); } set yxx(value: Float3) { this._y = value._x; this._x = value._z; }
	get yxy() { return new Float3(this._y, this._x, this._y); } set yxy(value: Float3) { this._x = value._y; this._y = value._z; }
	get yxz() { return new Float3(this._y, this._x, this._z); } set yxz(value: Float3) { this._y = value._x; this._x = value._y; this._z = value._z; }
	get yyx() { return new Float3(this._y, this._y, this._x); } set yyx(value: Float3) { this._y = value._y; this._x = value._z; }
	get yyy() { return new Float3(this._y, this._y, this._y); } set yyy(value: Float3) { this._y = value._z; }
	get yyz() { return new Float3(this._y, this._y, this._z); } set yyz(value: Float3) { this._y = value._y; this._z = value._z; }
	get yzx() { return new Float3(this._y, this._z, this._x); } set yzx(value: Float3) { this._y = value._x; this._z = value._y; this._x = value._z; }
	get yzy() { return new Float3(this._y, this._z, this._y); } set yzy(value: Float3) { this._z = value._y; this._y = value._z; }
	get yzz() { return new Float3(this._y, this._z, this._z); } set yzz(value: Float3) { this._y = value._x; this._z = value._z; }
	get zxx() { return new Float3(this._z, this._x, this._x); } set zxx(value: Float3) { this._z = value._x; this._x = value._z; }
	get zxy() { return new Float3(this._z, this._x, this._y); } set zxy(value: Float3) { this._z = value._x; this._x = value._y; this._y = value._z; }
	get zxz() { return new Float3(this._z, this._x, this._z); } set zxz(value: Float3) { this._x = value._y; this._z = value._z; }
	get zyx() { return new Float3(this._z, this._y, this._x); } set zyx(value: Float3) { this._z = value._x; this._y = value._y; this._x = value._z; }
	get zyy() { return new Float3(this._z, this._y, this._y); } set zyy(value: Float3) { this._z = value._x; this._y = value._z; }
	get zyz() { return new Float3(this._z, this._y, this._z); } set zyz(value: Float3) { this._y = value._y; this._z = value._z; }
	get zzx() { return new Float3(this._z, this._z, this._x); } set zzx(value: Float3) { this._z = value._y; this._x = value._z; }
	get zzy() { return new Float3(this._z, this._z, this._y); } set zzy(value: Float3) { this._z = value._y; this._y = value._z; }
	get zzz() { return new Float3(this._z, this._z, this._z); } set zzz(value: Float3) { this._z = value._z; }

	get xxxx() { return new Float4(this._x, this._x, this._x, this._x); } set xxxx(value: Float4) { this._x = value.w; }
	get xxxy() { return new Float4(this._x, this._x, this._x, this._y); } set xxxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get xxxz() { return new Float4(this._x, this._x, this._x, this._z); } set xxxz(value: Float4) { this._x = value.z; this._z = value.w; }
	get xxyx() { return new Float4(this._x, this._x, this._y, this._x); } set xxyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get xxyy() { return new Float4(this._x, this._x, this._y, this._y); } set xxyy(value: Float4) { this._x = value.y; this._y = value.w; }
	get xxyz() { return new Float4(this._x, this._x, this._y, this._z); } set xxyz(value: Float4) { this._x = value.y; this._y = value.z; this._z = value.w; }
	get xxzx() { return new Float4(this._x, this._x, this._z, this._x); } set xxzx(value: Float4) { this._z = value.z; this._x = value.w; }
	get xxzy() { return new Float4(this._x, this._x, this._z, this._y); } set xxzy(value: Float4) { this._x = value.y; this._z = value.z; this._y = value.w; }
	get xxzz() { return new Float4(this._x, this._x, this._z, this._z); } set xxzz(value: Float4) { this._x = value.y; this._z = value.w; }
	get xyxx() { return new Float4(this._x, this._y, this._x, this._x); } set xyxx(value: Float4) { this._y = value.y; this._x = value.w; }
	get xyxy() { return new Float4(this._x, this._y, this._x, this._y); } set xyxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get xyxz() { return new Float4(this._x, this._y, this._x, this._z); } set xyxz(value: Float4) { this._y = value.y; this._x = value.z; this._z = value.w; }
	get xyyx() { return new Float4(this._x, this._y, this._y, this._x); } set xyyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get xyyy() { return new Float4(this._x, this._y, this._y, this._y); } set xyyy(value: Float4) { this._x = value.x; this._y = value.w; }
	get xyyz() { return new Float4(this._x, this._y, this._y, this._z); } set xyyz(value: Float4) { this._x = value.x; this._y = value.z; this._z = value.w; }
	get xyzx() { return new Float4(this._x, this._y, this._z, this._x); } set xyzx(value: Float4) { this._y = value.y; this._z = value.z; this._x = value.w; }
	get xyzy() { return new Float4(this._x, this._y, this._z, this._y); } set xyzy(value: Float4) { this._x = value.x; this._z = value.z; this._y = value.w; }
	get xyzz() { return new Float4(this._x, this._y, this._z, this._z); } set xyzz(value: Float4) { this._x = value.x; this._y = value.y; this._z = value.w; }
	get xzxx() { return new Float4(this._x, this._z, this._x, this._x); } set xzxx(value: Float4) { this._z = value.y; this._x = value.w; }
	get xzxy() { return new Float4(this._x, this._z, this._x, this._y); } set xzxy(value: Float4) { this._z = value.y; this._x = value.z; this._y = value.w; }
	get xzxz() { return new Float4(this._x, this._z, this._x, this._z); } set xzxz(value: Float4) { this._x = value.z; this._z = value.w; }
	get xzyx() { return new Float4(this._x, this._z, this._y, this._x); } set xzyx(value: Float4) { this._z = value.y; this._y = value.z; this._x = value.w; }
	get xzyy() { return new Float4(this._x, this._z, this._y, this._y); } set xzyy(value: Float4) { this._x = value.x; this._z = value.y; this._y = value.w; }
	get xzyz() { return new Float4(this._x, this._z, this._y, this._z); } set xzyz(value: Float4) { this._x = value.x; this._y = value.z; this._z = value.w; }
	get xzzx() { return new Float4(this._x, this._z, this._z, this._x); } set xzzx(value: Float4) { this._z = value.z; this._x = value.w; }
	get xzzy() { return new Float4(this._x, this._z, this._z, this._y); } set xzzy(value: Float4) { this._x = value.x; this._z = value.z; this._y = value.w; }
	get xzzz() { return new Float4(this._x, this._z, this._z, this._z); } set xzzz(value: Float4) { this._x = value.x; this._z = value.w; }
	get yxxx() { return new Float4(this._y, this._x, this._x, this._x); } set yxxx(value: Float4) { this._y = value.x; this._x = value.w; }
	get yxxy() { return new Float4(this._y, this._x, this._x, this._y); } set yxxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get yxxz() { return new Float4(this._y, this._x, this._x, this._z); } set yxxz(value: Float4) { this._y = value.x; this._x = value.z; this._z = value.w; }
	get yxyx() { return new Float4(this._y, this._x, this._y, this._x); } set yxyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get yxyy() { return new Float4(this._y, this._x, this._y, this._y); } set yxyy(value: Float4) { this._x = value.y; this._y = value.w; }
	get yxyz() { return new Float4(this._y, this._x, this._y, this._z); } set yxyz(value: Float4) { this._x = value.y; this._y = value.z; this._z = value.w; }
	get yxzx() { return new Float4(this._y, this._x, this._z, this._x); } set yxzx(value: Float4) { this._y = value.x; this._z = value.z; this._x = value.w; }
	get yxzy() { return new Float4(this._y, this._x, this._z, this._y); } set yxzy(value: Float4) { this._x = value.y; this._z = value.z; this._y = value.w; }
	get yxzz() { return new Float4(this._y, this._x, this._z, this._z); } set yxzz(value: Float4) { this._y = value.x; this._x = value.y; this._z = value.w; }
	get yyxx() { return new Float4(this._y, this._y, this._x, this._x); } set yyxx(value: Float4) { this._y = value.y; this._x = value.w; }
	get yyxy() { return new Float4(this._y, this._y, this._x, this._y); } set yyxy(value: Float4) { this._x = value.z; this._y = value.w; }
	get yyxz() { return new Float4(this._y, this._y, this._x, this._z); } set yyxz(value: Float4) { this._y = value.y; this._x = value.z; this._z = value.w; }
	get yyyx() { return new Float4(this._y, this._y, this._y, this._x); } set yyyx(value: Float4) { this._y = value.z; this._x = value.w; }
	get yyyy() { return new Float4(this._y, this._y, this._y, this._y); } set yyyy(value: Float4) { this._y = value.w; }
	get yyyz() { return new Float4(this._y, this._y, this._y, this._z); } set yyyz(value: Float4) { this._y = value.z; this._z = value.w; }
	get yyzx() { return new Float4(this._y, this._y, this._z, this._x); } set yyzx(value: Float4) { this._y = value.y; this._z = value.z; this._x = value.w; }
	get yyzy() { return new Float4(this._y, this._y, this._z, this._y); } set yyzy(value: Float4) { this._z = value.z; this._y = value.w; }
	get yyzz() { return new Float4(this._y, this._y, this._z, this._z); } set yyzz(value: Float4) { this._y = value.y; this._z = value.w; }
	get yzxx() { return new Float4(this._y, this._z, this._x, this._x); } set yzxx(value: Float4) { this._y = value.x; this._z = value.y; this._x = value.w; }
	get yzxy() { return new Float4(this._y, this._z, this._x, this._y); } set yzxy(value: Float4) { this._z = value.y; this._x = value.z; this._y = value.w; }
	get yzxz() { return new Float4(this._y, this._z, this._x, this._z); } set yzxz(value: Float4) { this._y = value.x; this._x = value.z; this._z = value.w; }
	get yzyx() { return new Float4(this._y, this._z, this._y, this._x); } set yzyx(value: Float4) { this._z = value.y; this._y = value.z; this._x = value.w; }
	get yzyy() { return new Float4(this._y, this._z, this._y, this._y); } set yzyy(value: Float4) { this._z = value.y; this._y = value.w; }
	get yzyz() { return new Float4(this._y, this._z, this._y, this._z); } set yzyz(value: Float4) { this._y = value.z; this._z = value.w; }
	get yzzx() { return new Float4(this._y, this._z, this._z, this._x); } set yzzx(value: Float4) { this._y = value.x; this._z = value.z; this._x = value.w; }
	get yzzy() { return new Float4(this._y, this._z, this._z, this._y); } set yzzy(value: Float4) { this._z = value.z; this._y = value.w; }
	get yzzz() { return new Float4(this._y, this._z, this._z, this._z); } set yzzz(value: Float4) { this._y = value.x; this._z = value.w; }
	get zxxx() { return new Float4(this._z, this._x, this._x, this._x); } set zxxx(value: Float4) { this._z = value.x; this._x = value.w; }
	get zxxy() { return new Float4(this._z, this._x, this._x, this._y); } set zxxy(value: Float4) { this._z = value.x; this._x = value.z; this._y = value.w; }
	get zxxz() { return new Float4(this._z, this._x, this._x, this._z); } set zxxz(value: Float4) { this._x = value.z; this._z = value.w; }
	get zxyx() { return new Float4(this._z, this._x, this._y, this._x); } set zxyx(value: Float4) { this._z = value.x; this._y = value.z; this._x = value.w; }
	get zxyy() { return new Float4(this._z, this._x, this._y, this._y); } set zxyy(value: Float4) { this._z = value.x; this._x = value.y; this._y = value.w; }
	get zxyz() { return new Float4(this._z, this._x, this._y, this._z); } set zxyz(value: Float4) { this._x = value.y; this._y = value.z; this._z = value.w; }
	get zxzx() { return new Float4(this._z, this._x, this._z, this._x); } set zxzx(value: Float4) { this._z = value.z; this._x = value.w; }
	get zxzy() { return new Float4(this._z, this._x, this._z, this._y); } set zxzy(value: Float4) { this._x = value.y; this._z = value.z; this._y = value.w; }
	get zxzz() { return new Float4(this._z, this._x, this._z, this._z); } set zxzz(value: Float4) { this._x = value.y; this._z = value.w; }
	get zyxx() { return new Float4(this._z, this._y, this._x, this._x); } set zyxx(value: Float4) { this._z = value.x; this._y = value.y; this._x = value.w; }
	get zyxy() { return new Float4(this._z, this._y, this._x, this._y); } set zyxy(value: Float4) { this._z = value.x; this._x = value.z; this._y = value.w; }
	get zyxz() { return new Float4(this._z, this._y, this._x, this._z); } set zyxz(value: Float4) { this._y = value.y; this._x = value.z; this._z = value.w; }
	get zyyx() { return new Float4(this._z, this._y, this._y, this._x); } set zyyx(value: Float4) { this._z = value.x; this._y = value.z; this._x = value.w; }
	get zyyy() { return new Float4(this._z, this._y, this._y, this._y); } set zyyy(value: Float4) { this._z = value.x; this._y = value.w; }
	get zyyz() { return new Float4(this._z, this._y, this._y, this._z); } set zyyz(value: Float4) { this._y = value.z; this._z = value.w; }
	get zyzx() { return new Float4(this._z, this._y, this._z, this._x); } set zyzx(value: Float4) { this._y = value.y; this._z = value.z; this._x = value.w; }
	get zyzy() { return new Float4(this._z, this._y, this._z, this._y); } set zyzy(value: Float4) { this._z = value.z; this._y = value.w; }
	get zyzz() { return new Float4(this._z, this._y, this._z, this._z); } set zyzz(value: Float4) { this._y = value.y; this._z = value.w; }
	get zzxx() { return new Float4(this._z, this._z, this._x, this._x); } set zzxx(value: Float4) { this._z = value.y; this._x = value.w; }
	get zzxy() { return new Float4(this._z, this._z, this._x, this._y); } set zzxy(value: Float4) { this._z = value.y; this._x = value.z; this._y = value.w; }
	get zzxz() { return new Float4(this._z, this._z, this._x, this._z); } set zzxz(value: Float4) { this._x = value.z; this._z = value.w; }
	get zzyx() { return new Float4(this._z, this._z, this._y, this._x); } set zzyx(value: Float4) { this._z = value.y; this._y = value.z; this._x = value.w; }
	get zzyy() { return new Float4(this._z, this._z, this._y, this._y); } set zzyy(value: Float4) { this._z = value.y; this._y = value.w; }
	get zzyz() { return new Float4(this._z, this._z, this._y, this._z); } set zzyz(value: Float4) { this._y = value.z; this._z = value.w; }
	get zzzx() { return new Float4(this._z, this._z, this._z, this._x); } set zzzx(value: Float4) { this._z = value.z; this._x = value.w; }
	get zzzy() { return new Float4(this._z, this._z, this._z, this._y); } set zzzy(value: Float4) { this._z = value.z; this._y = value.w; }
	get zzzz() { return new Float4(this._z, this._z, this._z, this._z); } set zzzz(value: Float4) { this._z = value.w; }

	get length() { return Float3.magnitude(this); }
	get normalized() { return Float3.normalize(this); }

	static get zero() { return new Float3(); }
	static get one() { return new Float3(1); }
	static get right() { return new Float3(1, 0, 0); }
	static get left() { return new Float3(-1, 0, 0); }
	static get up() { return new Float3(0, 1, 0); }
	static get down() { return new Float3(0, -1, 0); }
	static get front() { return new Float3(0, 0, 1); }
	static get back() { return new Float3(0, 0, -1); }
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Float3);
	constructor(x: number);
	constructor(x: number, y: number, z: number);
	constructor(x?: number | Float3, y?: number, z?: number) {
		if (x === undefined) {
			this._x = this._y = this._z = 0;
		} else if (x instanceof Float3) {
			this._x = x._x;
			this._y = x._y;
			this._z = x._z;
		} else if (y === undefined) {
			this._x = this._y = this._z = x;
		} else if (z !== undefined) {
			this._x = x;
			this._y = y;
			this._z = z;
		} else {
			throw new Error("Invalid ctor overload.");
		}
	}
	//#endregion

	//#region Operators
	static add(left: Float3, right: number, out?: Float3): Float3;
	static add(left: Float3, right: Float3, out?: Float3): Float3;
	static add(left: Float3, right: number | Float3, out = new Float3()) {
		if (right instanceof Float3) {
			out.x = left._x + right._x;
			out.y = left._y + right._y;
			out.z = left._z + right._z;
		} else {
			out.x = left._x + right;
			out.y = left._y + right;
			out.z = left._z + right;
		}
		return out;
	}

	static sub(left: Float3, right: number, out?: Float3): Float3;
	static sub(left: Float3, right: Float3, out?: Float3): Float3;
	static sub(left: Float3, right: number | Float3, out = new Float3()) {
		if (right instanceof Float3) {
			out.x = left._x - right._x;
			out.y = left._y - right._y;
			out.z = left._z - right._z;
		} else {
			out.x = left._x - right;
			out.y = left._y - right;
			out.z = left._z - right;
		}
		return out;
	}

	static mul(left: Float3, right: number, out?: Float3): Float3;
	static mul(left: Float3, right: Float3, out?: Float3): Float3;
	static mul(left: Float3, right: number | Float3, out = new Float3()) {
		if (right instanceof Float3) {
			out.x = left._x * right._x;
			out.y = left._y * right._y;
			out.z = left._z * right._z;
		} else {
			out.x = left._x * right;
			out.y = left._y * right;
			out.z = left._z * right;
		}
		return out;
	}

	static div(left: Float3, right: number, out?: Float3): Float3;
	static div(left: Float3, right: Float3, out?: Float3): Float3;
	static div(left: Float3, right: number | Float3, out = new Float3()) {
		if (right instanceof Float3) {
			out.x = left._x / right._x;
			out.y = left._y / right._y;
			out.z = left._z / right._z;
		} else {
			out.x = left._x / right;
			out.y = left._y / right;
			out.z = left._z / right;
		}
		return out;
	}

	static mod(left: Float3, right: number): Float3;
	static mod(left: Float3, right: Float3): Float3;
	static mod(left: Float3, right: number | Float3) {
		if (right instanceof Float3) {
			const x = left._x % right._x, y = left._y % right._y, z = left._z % right._z;
			return new Float3(x < 0 ? x + right._x : x, y < 0 ? y + right._y : y, z < 0 ? z + right._z : z);
		}
		const x = left._x % right, y = left._y % right, z = left._z % right;
		return new Float3(x < 0 ? x + right : x, y < 0 ? y + right : y, z < 0 ? z + right : z);
	}
	//#endregion

	//#region Instance Methods
	normalize() {
		const num = Float3.magnitude(this);
		if (num > 9.99999974737875E-06 && num !== 1) {
			this._x /= num;
			this._y /= num;
			this._z /= num;
		}
	}

	update(f: Float3): void;
	update(x: number, y: number, z: number): void;
	update(x: Float3 | number, y?: number, z?: number) {
		if (x instanceof Float3) {
			this._x = x._x;
			this._y = x._y;
			this._z = x._z;
		} else {
			this._x = x;
			this._y = y!;
			this._z = z!;
		}
	}

	equals(other: Float3) {
		return (this === other)
			|| (Math.abs(this._x - other._x) <= PRECISION && Math.abs(this._y - other._y) <= PRECISION && Math.abs(this._z - other._z) <= PRECISION);
	}

	toString(name?: string) {
		return `Float3${name && `: ${name}` || ""}(${format(this._x, 8, 3)}  ${format(this._y, 8, 3)}  ${format(this._z, 8, 3)})`;
	}
	//#endregion

	//#region Static Methods
	static abs(v: Float3) {
		return new Float3(Math.abs(v._x), Math.abs(v._y), Math.abs(v._z));
	}

	static cross(a: Float3, b: Float3, out = new Float3()) {
		out._x = a._y * b._z - a._z * b._y;
		out._y = a._z * b._x - a._x * b._z;
		out._z = a._x * b._y - a._y * b._x;
		return out;
	}

	static distance(a: Float3, b: Float3) {
		return Float3.magnitude(Float3.sub(a, b));
	}

	static dot(a: Float3, b: Float3) {
		return a._x * b._x + a._y * b._y + a._z * b._z;
	}

	static floor(v: Float3) {
		return new Float3(Math.floor(v._x), Math.floor(v._y), Math.floor(v._z));
	}

	static frac(v: Float3) {
		const x = v._x % 1, y = v._y % 1, z = v._z % 1;
		return new Float3(x < 0 ? x + 1 : x, y < 0 ? y + 1 : y, z < 0 ? z + 1 : z);
	}

	static lerp(a: Float3, b: Float3, t: number) {
		return new Float3(a._x + (b._x - a._x) * t, a._y + (b._y - a._y) * t, a._z + (b._z - a._z) * t);
	}

	static linearCombine(a: Float3, b: Float3, ascl: number, bscl: number, out = new Float3()) {
		out.x = a._x * ascl + b._x * bscl;
		out.y = a._y * ascl + b._y * bscl;
		out.z = a._z * ascl + b._z * bscl;
		return out;
	}

	static magnitude(v: Float3) {
		return Math.hypot(v._x, v._y, v._z);
	}

	static max(...v: Float3[]) {
		return new Float3(Math.max(...v.map(v => v._x)), Math.max(...v.map(v => v._y)), Math.max(...v.map(v => v._z)));
	}

	static min(...v: Float3[]) {
		return new Float3(Math.min(...v.map(v => v._x)), Math.min(...v.map(v => v._y)), Math.min(...v.map(v => v._z)));
	}

	static normalize(v: Float3) {
		const num = Float3.magnitude(v);
		if (num > 9.99999974737875E-06) {
			return Float3.div(v, num);
		}
		return Float3.zero;
	}

	static rotateDegrees(v: Float3, axis: Float3, angle: number) {
		return this.rotateRadians(v, axis, angle * DEG2RAD);
	}

	static rotateRadians(v: Float3, axis: Float3, angle: number) {
		throw new Error("Not Implemented.");
	}

	static scale(v: Float3, factor: number, out = new Float3()) {
		const f = factor / Float3.magnitude(v);
		out.x = v.x * f;
		out.y = v.y * f;
		out.z = v.z * f;
		return out;
	}

	static sqrMagnitude(v: Float3) {
		return Float3.dot(v, v);
	}
	//#endregion
}

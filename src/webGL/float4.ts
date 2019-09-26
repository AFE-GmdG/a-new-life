import { format, PRECISION } from "./utils";
import { Float2 } from "./float2";
import { Float3 } from "./float3";

export class Float4 {
	//#region Fields
	private _x: number;
	private _y: number;
	private _z: number;
	private _w: number;
	//#endregion

	//#region Properties
	get x() { return this._x; } set x(value: number) { this._x = value; }
	get y() { return this._y; } set y(value: number) { this._y = value; }
	get z() { return this._z; } set z(value: number) { this._z = value; }
	get w() { return this._w; } set w(value: number) { this._w = value; }

	get xx() { return new Float2(this._x, this._x); } set xx(value: Float2) { this._x = value.y; }
	get xy() { return new Float2(this._x, this._y); } set xy(value: Float2) { this._x = value.x; this._y = value.y; }
	get xz() { return new Float2(this._x, this._z); } set xz(value: Float2) { this._x = value.x; this._z = value.y; }
	get xw() { return new Float2(this._x, this._w); } set xw(value: Float2) { this._x = value.x; this._w = value.y; }
	get yx() { return new Float2(this._y, this._x); } set yx(value: Float2) { this._y = value.x; this._x = value.y; }
	get yy() { return new Float2(this._y, this._y); } set yy(value: Float2) { this._y = value.y; }
	get yz() { return new Float2(this._y, this._z); } set yz(value: Float2) { this._y = value.x; this._z = value.y; }
	get yw() { return new Float2(this._y, this._w); } set yw(value: Float2) { this._y = value.x; this._w = value.y; }
	get zx() { return new Float2(this._z, this._x); } set zx(value: Float2) { this._z = value.x; this._x = value.y; }
	get zy() { return new Float2(this._z, this._y); } set zy(value: Float2) { this._z = value.x; this._y = value.y; }
	get zz() { return new Float2(this._z, this._z); } set zz(value: Float2) { this._z = value.y; }
	get zw() { return new Float2(this._z, this._w); } set zw(value: Float2) { this._z = value.x; this._w = value.y; }
	get wx() { return new Float2(this._w, this._x); } set wx(value: Float2) { this._w = value.x; this._x = value.y; }
	get wy() { return new Float2(this._w, this._y); } set wy(value: Float2) { this._w = value.x; this._y = value.y; }
	get wz() { return new Float2(this._w, this._z); } set wz(value: Float2) { this._w = value.x; this._z = value.y; }
	get ww() { return new Float2(this._w, this._w); } set ww(value: Float2) { this._w = value.y; }

	get xxx() { return new Float3(this._x, this._x, this._x); } set xxx(value: Float3) { this._x = value.z; }
	get xxy() { return new Float3(this._x, this._x, this._y); } set xxy(value: Float3) { this._x = value.y; this._y = value.z; }
	get xxz() { return new Float3(this._x, this._x, this._z); } set xxz(value: Float3) { this._x = value.y; this._z = value.z; }
	get xxw() { return new Float3(this._x, this._x, this._w); } set xxw(value: Float3) { this._x = value.y; this._w = value.z; }
	get xyx() { return new Float3(this._x, this._y, this._x); } set xyx(value: Float3) { this._y = value.y; this._x = value.z; }
	get xyy() { return new Float3(this._x, this._y, this._y); } set xyy(value: Float3) { this._x = value.x; this._y = value.z; }
	get xyz() { return new Float3(this._x, this._y, this._z); } set xyz(value: Float3) { this._x = value.x; this._y = value.y; this._z = value.z; }
	get xyw() { return new Float3(this._x, this._y, this._w); } set xyw(value: Float3) { this._x = value.x; this._y = value.y; this._w = value.z; }
	get xzx() { return new Float3(this._x, this._z, this._x); } set xzx(value: Float3) { this._z = value.y; this._x = value.z; }
	get xzy() { return new Float3(this._x, this._z, this._y); } set xzy(value: Float3) { this._x = value.x; this._z = value.y; this._y = value.z; }
	get xzz() { return new Float3(this._x, this._z, this._z); } set xzz(value: Float3) { this._x = value.x; this._z = value.z; }
	get xzw() { return new Float3(this._x, this._z, this._w); } set xzw(value: Float3) { this._x = value.x; this._z = value.y; this._w = value.z; }
	get xwx() { return new Float3(this._x, this._w, this._x); } set xwx(value: Float3) { this._w = value.y; this._x = value.z; }
	get xwy() { return new Float3(this._x, this._w, this._y); } set xwy(value: Float3) { this._x = value.x; this._w = value.y; this._y = value.z; }
	get xwz() { return new Float3(this._x, this._w, this._z); } set xwz(value: Float3) { this._x = value.x; this._w = value.y; this._z = value.z; }
	get xww() { return new Float3(this._x, this._w, this._w); } set xww(value: Float3) { this._x = value.x; this._w = value.z; }
	get yxx() { return new Float3(this._y, this._x, this._x); } set yxx(value: Float3) { this._y = value.x; this._x = value.z; }
	get yxy() { return new Float3(this._y, this._x, this._y); } set yxy(value: Float3) { this._x = value.y; this._y = value.z; }
	get yxz() { return new Float3(this._y, this._x, this._z); } set yxz(value: Float3) { this._y = value.x; this._x = value.y; this._z = value.z; }
	get yxw() { return new Float3(this._y, this._x, this._w); } set yxw(value: Float3) { this._y = value.x; this._x = value.y; this._w = value.z; }
	get yyx() { return new Float3(this._y, this._y, this._x); } set yyx(value: Float3) { this._y = value.y; this._x = value.z; }
	get yyy() { return new Float3(this._y, this._y, this._y); } set yyy(value: Float3) { this._y = value.z; }
	get yyz() { return new Float3(this._y, this._y, this._z); } set yyz(value: Float3) { this._y = value.y; this._z = value.z; }
	get yyw() { return new Float3(this._y, this._y, this._w); } set yyw(value: Float3) { this._y = value.y; this._w = value.z; }
	get yzx() { return new Float3(this._y, this._z, this._x); } set yzx(value: Float3) { this._y = value.x; this._z = value.y; this._x = value.z; }
	get yzy() { return new Float3(this._y, this._z, this._y); } set yzy(value: Float3) { this._z = value.y; this._y = value.z; }
	get yzz() { return new Float3(this._y, this._z, this._z); } set yzz(value: Float3) { this._y = value.x; this._z = value.z; }
	get yzw() { return new Float3(this._y, this._z, this._w); } set yzw(value: Float3) { this._y = value.x; this._z = value.y; this._w = value.z; }
	get ywx() { return new Float3(this._y, this._w, this._x); } set ywx(value: Float3) { this._y = value.x; this._w = value.y; this._x = value.z; }
	get ywy() { return new Float3(this._y, this._w, this._y); } set ywy(value: Float3) { this._w = value.y; this._y = value.z; }
	get ywz() { return new Float3(this._y, this._w, this._z); } set ywz(value: Float3) { this._y = value.x; this._w = value.y; this._z = value.z; }
	get yww() { return new Float3(this._y, this._w, this._w); } set yww(value: Float3) { this._y = value.x; this._w = value.z; }
	get zxx() { return new Float3(this._z, this._x, this._x); } set zxx(value: Float3) { this._z = value.x; this._x = value.z; }
	get zxy() { return new Float3(this._z, this._x, this._y); } set zxy(value: Float3) { this._z = value.x; this._x = value.y; this._y = value.z; }
	get zxz() { return new Float3(this._z, this._x, this._z); } set zxz(value: Float3) { this._x = value.y; this._z = value.z; }
	get zxw() { return new Float3(this._z, this._x, this._w); } set zxw(value: Float3) { this._z = value.x; this._x = value.y; this._w = value.z; }
	get zyx() { return new Float3(this._z, this._y, this._x); } set zyx(value: Float3) { this._z = value.x; this._y = value.y; this._x = value.z; }
	get zyy() { return new Float3(this._z, this._y, this._y); } set zyy(value: Float3) { this._z = value.x; this._y = value.z; }
	get zyz() { return new Float3(this._z, this._y, this._z); } set zyz(value: Float3) { this._y = value.y; this._z = value.z; }
	get zyw() { return new Float3(this._z, this._y, this._w); } set zyw(value: Float3) { this._z = value.x; this._y = value.y; this._w = value.z; }
	get zzx() { return new Float3(this._z, this._z, this._x); } set zzx(value: Float3) { this._z = value.y; this._x = value.z; }
	get zzy() { return new Float3(this._z, this._z, this._y); } set zzy(value: Float3) { this._z = value.y; this._y = value.z; }
	get zzz() { return new Float3(this._z, this._z, this._z); } set zzz(value: Float3) { this._z = value.z; }
	get zzw() { return new Float3(this._z, this._z, this._w); } set zzw(value: Float3) { this._z = value.y; this._w = value.z; }
	get zwx() { return new Float3(this._z, this._w, this._x); } set zwx(value: Float3) { this._z = value.x; this._w = value.y; this._x = value.z; }
	get zwy() { return new Float3(this._z, this._w, this._y); } set zwy(value: Float3) { this._z = value.x; this._w = value.y; this._y = value.z; }
	get zwz() { return new Float3(this._z, this._w, this._z); } set zwz(value: Float3) { this._w = value.y; this._z = value.z; }
	get zww() { return new Float3(this._z, this._w, this._w); } set zww(value: Float3) { this._z = value.x; this._w = value.z; }
	get wxx() { return new Float3(this._w, this._x, this._x); } set wxx(value: Float3) { this._w = value.x; this._x = value.z; }
	get wxy() { return new Float3(this._w, this._x, this._y); } set wxy(value: Float3) { this._w = value.x; this._x = value.y; this._y = value.z; }
	get wxz() { return new Float3(this._w, this._x, this._z); } set wxz(value: Float3) { this._w = value.x; this._x = value.y; this._z = value.z; }
	get wxw() { return new Float3(this._w, this._x, this._w); } set wxw(value: Float3) { this._x = value.y; this._w = value.z; }
	get wyx() { return new Float3(this._w, this._y, this._x); } set wyx(value: Float3) { this._w = value.x; this._y = value.y; this._x = value.z; }
	get wyy() { return new Float3(this._w, this._y, this._y); } set wyy(value: Float3) { this._w = value.x; this._y = value.z; }
	get wyz() { return new Float3(this._w, this._y, this._z); } set wyz(value: Float3) { this._w = value.x; this._y = value.y; this._z = value.z; }
	get wyw() { return new Float3(this._w, this._y, this._w); } set wyw(value: Float3) { this._y = value.y; this._w = value.z; }
	get wzx() { return new Float3(this._w, this._z, this._x); } set wzx(value: Float3) { this._w = value.x; this._z = value.y; this._x = value.z; }
	get wzy() { return new Float3(this._w, this._z, this._y); } set wzy(value: Float3) { this._w = value.x; this._z = value.y; this._y = value.z; }
	get wzz() { return new Float3(this._w, this._z, this._z); } set wzz(value: Float3) { this._w = value.x; this._z = value.z; }
	get wzw() { return new Float3(this._w, this._z, this._w); } set wzw(value: Float3) { this._z = value.y; this._w = value.z; }
	get wwx() { return new Float3(this._w, this._w, this._x); } set wwx(value: Float3) { this._w = value.y; this._x = value.z; }
	get wwy() { return new Float3(this._w, this._w, this._y); } set wwy(value: Float3) { this._w = value.y; this._y = value.z; }
	get wwz() { return new Float3(this._w, this._w, this._z); } set wwz(value: Float3) { this._w = value.y; this._z = value.z; }
	get www() { return new Float3(this._w, this._w, this._w); } set www(value: Float3) { this._w = value.z; }

	get xxxx() { return new Float4(this._x, this._x, this._x, this._x); } set xxxx(value: Float4) { this._x = value._w; }
	get xxxy() { return new Float4(this._x, this._x, this._x, this._y); } set xxxy(value: Float4) { this._x = value._z; this._y = value._w; }
	get xxxz() { return new Float4(this._x, this._x, this._x, this._z); } set xxxz(value: Float4) { this._x = value._z; this._z = value._w; }
	get xxxw() { return new Float4(this._x, this._x, this._x, this._w); } set xxxw(value: Float4) { this._x = value._z; this._w = value._w; }
	get xxyx() { return new Float4(this._x, this._x, this._y, this._x); } set xxyx(value: Float4) { this._y = value._z; this._x = value._w; }
	get xxyy() { return new Float4(this._x, this._x, this._y, this._y); } set xxyy(value: Float4) { this._x = value._y; this._y = value._w; }
	get xxyz() { return new Float4(this._x, this._x, this._y, this._z); } set xxyz(value: Float4) { this._x = value._y; this._y = value._z; this._z = value._w; }
	get xxyw() { return new Float4(this._x, this._x, this._y, this._w); } set xxyw(value: Float4) { this._x = value._y; this._y = value._z; this._w = value._w; }
	get xxzx() { return new Float4(this._x, this._x, this._z, this._x); } set xxzx(value: Float4) { this._z = value._z; this._x = value._w; }
	get xxzy() { return new Float4(this._x, this._x, this._z, this._y); } set xxzy(value: Float4) { this._x = value._y; this._z = value._z; this._y = value._w; }
	get xxzz() { return new Float4(this._x, this._x, this._z, this._z); } set xxzz(value: Float4) { this._x = value._y; this._z = value._w; }
	get xxzw() { return new Float4(this._x, this._x, this._z, this._w); } set xxzw(value: Float4) { this._x = value._y; this._z = value._z; this._w = value._w; }
	get xxwx() { return new Float4(this._x, this._x, this._w, this._x); } set xxwx(value: Float4) { this._w = value._z; this._x = value._w; }
	get xxwy() { return new Float4(this._x, this._x, this._w, this._y); } set xxwy(value: Float4) { this._x = value._y; this._w = value._z; this._y = value._w; }
	get xxwz() { return new Float4(this._x, this._x, this._w, this._z); } set xxwz(value: Float4) { this._x = value._y; this._w = value._z; this._z = value._w; }
	get xxww() { return new Float4(this._x, this._x, this._w, this._w); } set xxww(value: Float4) { this._x = value._y; this._w = value._w; }
	get xyxx() { return new Float4(this._x, this._y, this._x, this._x); } set xyxx(value: Float4) { this._y = value._y; this._x = value._w; }
	get xyxy() { return new Float4(this._x, this._y, this._x, this._y); } set xyxy(value: Float4) { this._x = value._z; this._y = value._w; }
	get xyxz() { return new Float4(this._x, this._y, this._x, this._z); } set xyxz(value: Float4) { this._y = value._y; this._x = value._z; this._z = value._w; }
	get xyxw() { return new Float4(this._x, this._y, this._x, this._w); } set xyxw(value: Float4) { this._y = value._y; this._x = value._z; this._w = value._w; }
	get xyyx() { return new Float4(this._x, this._y, this._y, this._x); } set xyyx(value: Float4) { this._y = value._z; this._x = value._w; }
	get xyyy() { return new Float4(this._x, this._y, this._y, this._y); } set xyyy(value: Float4) { this._x = value._x; this._y = value._w; }
	get xyyz() { return new Float4(this._x, this._y, this._y, this._z); } set xyyz(value: Float4) { this._x = value._x; this._y = value._z; this._z = value._w; }
	get xyyw() { return new Float4(this._x, this._y, this._y, this._w); } set xyyw(value: Float4) { this._x = value._x; this._y = value._z; this._w = value._w; }
	get xyzx() { return new Float4(this._x, this._y, this._z, this._x); } set xyzx(value: Float4) { this._y = value._y; this._z = value._z; this._x = value._w; }
	get xyzy() { return new Float4(this._x, this._y, this._z, this._y); } set xyzy(value: Float4) { this._x = value._x; this._z = value._z; this._y = value._w; }
	get xyzz() { return new Float4(this._x, this._y, this._z, this._z); } set xyzz(value: Float4) { this._x = value._x; this._y = value._y; this._z = value._w; }
	get xyzw() { return new Float4(this._x, this._y, this._z, this._w); } set xyzw(value: Float4) { this._x = value._x; this._y = value._y; this._z = value._z; this._w = value._w; }
	get xywx() { return new Float4(this._x, this._y, this._w, this._x); } set xywx(value: Float4) { this._y = value._y; this._w = value._z; this._x = value._w; }
	get xywy() { return new Float4(this._x, this._y, this._w, this._y); } set xywy(value: Float4) { this._x = value._x; this._w = value._z; this._y = value._w; }
	get xywz() { return new Float4(this._x, this._y, this._w, this._z); } set xywz(value: Float4) { this._x = value._x; this._y = value._y; this._w = value._z; this._z = value._w; }
	get xyww() { return new Float4(this._x, this._y, this._w, this._w); } set xyww(value: Float4) { this._x = value._x; this._y = value._y; this._w = value._w; }
	get xzxx() { return new Float4(this._x, this._z, this._x, this._x); } set xzxx(value: Float4) { this._z = value._y; this._x = value._w; }
	get xzxy() { return new Float4(this._x, this._z, this._x, this._y); } set xzxy(value: Float4) { this._z = value._y; this._x = value._z; this._y = value._w; }
	get xzxz() { return new Float4(this._x, this._z, this._x, this._z); } set xzxz(value: Float4) { this._x = value._z; this._z = value._w; }
	get xzxw() { return new Float4(this._x, this._z, this._x, this._w); } set xzxw(value: Float4) { this._z = value._y; this._x = value._z; this._w = value._w; }
	get xzyx() { return new Float4(this._x, this._z, this._y, this._x); } set xzyx(value: Float4) { this._z = value._y; this._y = value._z; this._x = value._w; }
	get xzyy() { return new Float4(this._x, this._z, this._y, this._y); } set xzyy(value: Float4) { this._x = value._x; this._z = value._y; this._y = value._w; }
	get xzyz() { return new Float4(this._x, this._z, this._y, this._z); } set xzyz(value: Float4) { this._x = value._x; this._y = value._z; this._z = value._w; }
	get xzyw() { return new Float4(this._x, this._z, this._y, this._w); } set xzyw(value: Float4) { this._x = value._x; this._z = value._y; this._y = value._z; this._w = value._w; }
	get xzzx() { return new Float4(this._x, this._z, this._z, this._x); } set xzzx(value: Float4) { this._z = value._z; this._x = value._w; }
	get xzzy() { return new Float4(this._x, this._z, this._z, this._y); } set xzzy(value: Float4) { this._x = value._x; this._z = value._z; this._y = value._w; }
	get xzzz() { return new Float4(this._x, this._z, this._z, this._z); } set xzzz(value: Float4) { this._x = value._x; this._z = value._w; }
	get xzzw() { return new Float4(this._x, this._z, this._z, this._w); } set xzzw(value: Float4) { this._x = value._x; this._z = value._z; this._w = value._w; }
	get xzwx() { return new Float4(this._x, this._z, this._w, this._x); } set xzwx(value: Float4) { this._z = value._y; this._w = value._z; this._x = value._w; }
	get xzwy() { return new Float4(this._x, this._z, this._w, this._y); } set xzwy(value: Float4) { this._x = value._x; this._z = value._y; this._w = value._z; this._y = value._w; }
	get xzwz() { return new Float4(this._x, this._z, this._w, this._z); } set xzwz(value: Float4) { this._x = value._x; this._w = value._z; this._z = value._w; }
	get xzww() { return new Float4(this._x, this._z, this._w, this._w); } set xzww(value: Float4) { this._x = value._x; this._z = value._y; this._w = value._w; }
	get xwxx() { return new Float4(this._x, this._w, this._x, this._x); } set xwxx(value: Float4) { this._w = value._y; this._x = value._w; }
	get xwxy() { return new Float4(this._x, this._w, this._x, this._y); } set xwxy(value: Float4) { this._w = value._y; this._x = value._z; this._y = value._w; }
	get xwxz() { return new Float4(this._x, this._w, this._x, this._z); } set xwxz(value: Float4) { this._w = value._y; this._x = value._z; this._z = value._w; }
	get xwxw() { return new Float4(this._x, this._w, this._x, this._w); } set xwxw(value: Float4) { this._x = value._z; this._w = value._w; }
	get xwyx() { return new Float4(this._x, this._w, this._y, this._x); } set xwyx(value: Float4) { this._w = value._y; this._y = value._z; this._x = value._w; }
	get xwyy() { return new Float4(this._x, this._w, this._y, this._y); } set xwyy(value: Float4) { this._x = value._x; this._w = value._y; this._y = value._w; }
	get xwyz() { return new Float4(this._x, this._w, this._y, this._z); } set xwyz(value: Float4) { this._x = value._x; this._w = value._y; this._y = value._z; this._z = value._w; }
	get xwyw() { return new Float4(this._x, this._w, this._y, this._w); } set xwyw(value: Float4) { this._x = value._x; this._y = value._z; this._w = value._w; }
	get xwzx() { return new Float4(this._x, this._w, this._z, this._x); } set xwzx(value: Float4) { this._w = value._y; this._z = value._z; this._x = value._w; }
	get xwzy() { return new Float4(this._x, this._w, this._z, this._y); } set xwzy(value: Float4) { this._x = value._x; this._w = value._y; this._z = value._z; this._y = value._w; }
	get xwzz() { return new Float4(this._x, this._w, this._z, this._z); } set xwzz(value: Float4) { this._x = value._x; this._w = value._y; this._z = value._w; }
	get xwzw() { return new Float4(this._x, this._w, this._z, this._w); } set xwzw(value: Float4) { this._x = value._x; this._z = value._z; this._w = value._w; }
	get xwwx() { return new Float4(this._x, this._w, this._w, this._x); } set xwwx(value: Float4) { this._w = value._z; this._x = value._w; }
	get xwwy() { return new Float4(this._x, this._w, this._w, this._y); } set xwwy(value: Float4) { this._x = value._x; this._w = value._z; this._y = value._w; }
	get xwwz() { return new Float4(this._x, this._w, this._w, this._z); } set xwwz(value: Float4) { this._x = value._x; this._w = value._z; this._z = value._w; }
	get xwww() { return new Float4(this._x, this._w, this._w, this._w); } set xwww(value: Float4) { this._x = value._x; this._w = value._w; }
	get yxxx() { return new Float4(this._y, this._x, this._x, this._x); } set yxxx(value: Float4) { this._y = value._x; this._x = value._w; }
	get yxxy() { return new Float4(this._y, this._x, this._x, this._y); } set yxxy(value: Float4) { this._x = value._z; this._y = value._w; }
	get yxxz() { return new Float4(this._y, this._x, this._x, this._z); } set yxxz(value: Float4) { this._y = value._x; this._x = value._z; this._z = value._w; }
	get yxxw() { return new Float4(this._y, this._x, this._x, this._w); } set yxxw(value: Float4) { this._y = value._x; this._x = value._z; this._w = value._w; }
	get yxyx() { return new Float4(this._y, this._x, this._y, this._x); } set yxyx(value: Float4) { this._y = value._z; this._x = value._w; }
	get yxyy() { return new Float4(this._y, this._x, this._y, this._y); } set yxyy(value: Float4) { this._x = value._y; this._y = value._w; }
	get yxyz() { return new Float4(this._y, this._x, this._y, this._z); } set yxyz(value: Float4) { this._x = value._y; this._y = value._z; this._z = value._w; }
	get yxyw() { return new Float4(this._y, this._x, this._y, this._w); } set yxyw(value: Float4) { this._x = value._y; this._y = value._z; this._w = value._w; }
	get yxzx() { return new Float4(this._y, this._x, this._z, this._x); } set yxzx(value: Float4) { this._y = value._x; this._z = value._z; this._x = value._w; }
	get yxzy() { return new Float4(this._y, this._x, this._z, this._y); } set yxzy(value: Float4) { this._x = value._y; this._z = value._z; this._y = value._w; }
	get yxzz() { return new Float4(this._y, this._x, this._z, this._z); } set yxzz(value: Float4) { this._y = value._x; this._x = value._y; this._z = value._w; }
	get yxzw() { return new Float4(this._y, this._x, this._z, this._w); } set yxzw(value: Float4) { this._y = value._x; this._x = value._y; this._z = value._z; this._w = value._w; }
	get yxwx() { return new Float4(this._y, this._x, this._w, this._x); } set yxwx(value: Float4) { this._y = value._x; this._w = value._z; this._x = value._w; }
	get yxwy() { return new Float4(this._y, this._x, this._w, this._y); } set yxwy(value: Float4) { this._x = value._y; this._w = value._z; this._y = value._w; }
	get yxwz() { return new Float4(this._y, this._x, this._w, this._z); } set yxwz(value: Float4) { this._y = value._x; this._x = value._y; this._w = value._z; this._z = value._w; }
	get yxww() { return new Float4(this._y, this._x, this._w, this._w); } set yxww(value: Float4) { this._y = value._x; this._x = value._y; this._w = value._w; }
	get yyxx() { return new Float4(this._y, this._y, this._x, this._x); } set yyxx(value: Float4) { this._y = value._y; this._x = value._w; }
	get yyxy() { return new Float4(this._y, this._y, this._x, this._y); } set yyxy(value: Float4) { this._x = value._z; this._y = value._w; }
	get yyxz() { return new Float4(this._y, this._y, this._x, this._z); } set yyxz(value: Float4) { this._y = value._y; this._x = value._z; this._z = value._w; }
	get yyxw() { return new Float4(this._y, this._y, this._x, this._w); } set yyxw(value: Float4) { this._y = value._y; this._x = value._z; this._w = value._w; }
	get yyyx() { return new Float4(this._y, this._y, this._y, this._x); } set yyyx(value: Float4) { this._y = value._z; this._x = value._w; }
	get yyyy() { return new Float4(this._y, this._y, this._y, this._y); } set yyyy(value: Float4) { this._y = value._w; }
	get yyyz() { return new Float4(this._y, this._y, this._y, this._z); } set yyyz(value: Float4) { this._y = value._z; this._z = value._w; }
	get yyyw() { return new Float4(this._y, this._y, this._y, this._w); } set yyyw(value: Float4) { this._y = value._z; this._w = value._w; }
	get yyzx() { return new Float4(this._y, this._y, this._z, this._x); } set yyzx(value: Float4) { this._y = value._y; this._z = value._z; this._x = value._w; }
	get yyzy() { return new Float4(this._y, this._y, this._z, this._y); } set yyzy(value: Float4) { this._z = value._z; this._y = value._w; }
	get yyzz() { return new Float4(this._y, this._y, this._z, this._z); } set yyzz(value: Float4) { this._y = value._y; this._z = value._w; }
	get yyzw() { return new Float4(this._y, this._y, this._z, this._w); } set yyzw(value: Float4) { this._y = value._y; this._z = value._z; this._w = value._w; }
	get yywx() { return new Float4(this._y, this._y, this._w, this._x); } set yywx(value: Float4) { this._y = value._y; this._w = value._z; this._x = value._w; }
	get yywy() { return new Float4(this._y, this._y, this._w, this._y); } set yywy(value: Float4) { this._w = value._z; this._y = value._w; }
	get yywz() { return new Float4(this._y, this._y, this._w, this._z); } set yywz(value: Float4) { this._y = value._y; this._w = value._z; this._z = value._w; }
	get yyww() { return new Float4(this._y, this._y, this._w, this._w); } set yyww(value: Float4) { this._y = value._y; this._w = value._w; }
	get yzxx() { return new Float4(this._y, this._z, this._x, this._x); } set yzxx(value: Float4) { this._y = value._x; this._z = value._y; this._x = value._w; }
	get yzxy() { return new Float4(this._y, this._z, this._x, this._y); } set yzxy(value: Float4) { this._z = value._y; this._x = value._z; this._y = value._w; }
	get yzxz() { return new Float4(this._y, this._z, this._x, this._z); } set yzxz(value: Float4) { this._y = value._x; this._x = value._z; this._z = value._w; }
	get yzxw() { return new Float4(this._y, this._z, this._x, this._w); } set yzxw(value: Float4) { this._y = value._x; this._z = value._y; this._x = value._z; this._w = value._w; }
	get yzyx() { return new Float4(this._y, this._z, this._y, this._x); } set yzyx(value: Float4) { this._z = value._y; this._y = value._z; this._x = value._w; }
	get yzyy() { return new Float4(this._y, this._z, this._y, this._y); } set yzyy(value: Float4) { this._z = value._y; this._y = value._w; }
	get yzyz() { return new Float4(this._y, this._z, this._y, this._z); } set yzyz(value: Float4) { this._y = value._z; this._z = value._w; }
	get yzyw() { return new Float4(this._y, this._z, this._y, this._w); } set yzyw(value: Float4) { this._z = value._y; this._y = value._z; this._w = value._w; }
	get yzzx() { return new Float4(this._y, this._z, this._z, this._x); } set yzzx(value: Float4) { this._y = value._x; this._z = value._z; this._x = value._w; }
	get yzzy() { return new Float4(this._y, this._z, this._z, this._y); } set yzzy(value: Float4) { this._z = value._z; this._y = value._w; }
	get yzzz() { return new Float4(this._y, this._z, this._z, this._z); } set yzzz(value: Float4) { this._y = value._x; this._z = value._w; }
	get yzzw() { return new Float4(this._y, this._z, this._z, this._w); } set yzzw(value: Float4) { this._y = value._x; this._z = value._z; this._w = value._w; }
	get yzwx() { return new Float4(this._y, this._z, this._w, this._x); } set yzwx(value: Float4) { this._y = value._x; this._z = value._y; this._w = value._z; this._x = value._w; }
	get yzwy() { return new Float4(this._y, this._z, this._w, this._y); } set yzwy(value: Float4) { this._z = value._y; this._w = value._z; this._y = value._w; }
	get yzwz() { return new Float4(this._y, this._z, this._w, this._z); } set yzwz(value: Float4) { this._y = value._x; this._w = value._z; this._z = value._w; }
	get yzww() { return new Float4(this._y, this._z, this._w, this._w); } set yzww(value: Float4) { this._y = value._x; this._z = value._y; this._w = value._w; }
	get ywxx() { return new Float4(this._y, this._w, this._x, this._x); } set ywxx(value: Float4) { this._y = value._x; this._w = value._y; this._x = value._w; }
	get ywxy() { return new Float4(this._y, this._w, this._x, this._y); } set ywxy(value: Float4) { this._w = value._y; this._x = value._z; this._y = value._w; }
	get ywxz() { return new Float4(this._y, this._w, this._x, this._z); } set ywxz(value: Float4) { this._y = value._x; this._w = value._y; this._x = value._z; this._z = value._w; }
	get ywxw() { return new Float4(this._y, this._w, this._x, this._w); } set ywxw(value: Float4) { this._y = value._x; this._x = value._z; this._w = value._w; }
	get ywyx() { return new Float4(this._y, this._w, this._y, this._x); } set ywyx(value: Float4) { this._w = value._y; this._y = value._z; this._x = value._w; }
	get ywyy() { return new Float4(this._y, this._w, this._y, this._y); } set ywyy(value: Float4) { this._w = value._y; this._y = value._w; }
	get ywyz() { return new Float4(this._y, this._w, this._y, this._z); } set ywyz(value: Float4) { this._w = value._y; this._y = value._z; this._z = value._w; }
	get ywyw() { return new Float4(this._y, this._w, this._y, this._w); } set ywyw(value: Float4) { this._y = value._z; this._w = value._w; }
	get ywzx() { return new Float4(this._y, this._w, this._z, this._x); } set ywzx(value: Float4) { this._y = value._x; this._w = value._y; this._z = value._z; this._x = value._w; }
	get ywzy() { return new Float4(this._y, this._w, this._z, this._y); } set ywzy(value: Float4) { this._w = value._y; this._z = value._z; this._y = value._w; }
	get ywzz() { return new Float4(this._y, this._w, this._z, this._z); } set ywzz(value: Float4) { this._y = value._x; this._w = value._y; this._z = value._w; }
	get ywzw() { return new Float4(this._y, this._w, this._z, this._w); } set ywzw(value: Float4) { this._y = value._x; this._z = value._z; this._w = value._w; }
	get ywwx() { return new Float4(this._y, this._w, this._w, this._x); } set ywwx(value: Float4) { this._y = value._x; this._w = value._z; this._x = value._w; }
	get ywwy() { return new Float4(this._y, this._w, this._w, this._y); } set ywwy(value: Float4) { this._w = value._z; this._y = value._w; }
	get ywwz() { return new Float4(this._y, this._w, this._w, this._z); } set ywwz(value: Float4) { this._y = value._x; this._w = value._z; this._z = value._w; }
	get ywww() { return new Float4(this._y, this._w, this._w, this._w); } set ywww(value: Float4) { this._y = value._x; this._w = value._w; }
	get zxxx() { return new Float4(this._z, this._x, this._x, this._x); } set zxxx(value: Float4) { this._z = value._x; this._x = value._w; }
	get zxxy() { return new Float4(this._z, this._x, this._x, this._y); } set zxxy(value: Float4) { this._z = value._x; this._x = value._z; this._y = value._w; }
	get zxxz() { return new Float4(this._z, this._x, this._x, this._z); } set zxxz(value: Float4) { this._x = value._z; this._z = value._w; }
	get zxxw() { return new Float4(this._z, this._x, this._x, this._w); } set zxxw(value: Float4) { this._z = value._x; this._x = value._z; this._w = value._w; }
	get zxyx() { return new Float4(this._z, this._x, this._y, this._x); } set zxyx(value: Float4) { this._z = value._x; this._y = value._z; this._x = value._w; }
	get zxyy() { return new Float4(this._z, this._x, this._y, this._y); } set zxyy(value: Float4) { this._z = value._x; this._x = value._y; this._y = value._w; }
	get zxyz() { return new Float4(this._z, this._x, this._y, this._z); } set zxyz(value: Float4) { this._x = value._y; this._y = value._z; this._z = value._w; }
	get zxyw() { return new Float4(this._z, this._x, this._y, this._w); } set zxyw(value: Float4) { this._z = value._x; this._x = value._y; this._y = value._z; this._w = value._w; }
	get zxzx() { return new Float4(this._z, this._x, this._z, this._x); } set zxzx(value: Float4) { this._z = value._z; this._x = value._w; }
	get zxzy() { return new Float4(this._z, this._x, this._z, this._y); } set zxzy(value: Float4) { this._x = value._y; this._z = value._z; this._y = value._w; }
	get zxzz() { return new Float4(this._z, this._x, this._z, this._z); } set zxzz(value: Float4) { this._x = value._y; this._z = value._w; }
	get zxzw() { return new Float4(this._z, this._x, this._z, this._w); } set zxzw(value: Float4) { this._x = value._y; this._z = value._z; this._w = value._w; }
	get zxwx() { return new Float4(this._z, this._x, this._w, this._x); } set zxwx(value: Float4) { this._z = value._x; this._w = value._z; this._x = value._w; }
	get zxwy() { return new Float4(this._z, this._x, this._w, this._y); } set zxwy(value: Float4) { this._z = value._x; this._x = value._y; this._w = value._z; this._y = value._w; }
	get zxwz() { return new Float4(this._z, this._x, this._w, this._z); } set zxwz(value: Float4) { this._x = value._y; this._w = value._z; this._z = value._w; }
	get zxww() { return new Float4(this._z, this._x, this._w, this._w); } set zxww(value: Float4) { this._z = value._x; this._x = value._y; this._w = value._w; }
	get zyxx() { return new Float4(this._z, this._y, this._x, this._x); } set zyxx(value: Float4) { this._z = value._x; this._y = value._y; this._x = value._w; }
	get zyxy() { return new Float4(this._z, this._y, this._x, this._y); } set zyxy(value: Float4) { this._z = value._x; this._x = value._z; this._y = value._w; }
	get zyxz() { return new Float4(this._z, this._y, this._x, this._z); } set zyxz(value: Float4) { this._y = value._y; this._x = value._z; this._z = value._w; }
	get zyxw() { return new Float4(this._z, this._y, this._x, this._w); } set zyxw(value: Float4) { this._z = value._x; this._y = value._y; this._x = value._z; this._w = value._w; }
	get zyyx() { return new Float4(this._z, this._y, this._y, this._x); } set zyyx(value: Float4) { this._z = value._x; this._y = value._z; this._x = value._w; }
	get zyyy() { return new Float4(this._z, this._y, this._y, this._y); } set zyyy(value: Float4) { this._z = value._x; this._y = value._w; }
	get zyyz() { return new Float4(this._z, this._y, this._y, this._z); } set zyyz(value: Float4) { this._y = value._z; this._z = value._w; }
	get zyyw() { return new Float4(this._z, this._y, this._y, this._w); } set zyyw(value: Float4) { this._z = value._x; this._y = value._z; this._w = value._w; }
	get zyzx() { return new Float4(this._z, this._y, this._z, this._x); } set zyzx(value: Float4) { this._y = value._y; this._z = value._z; this._x = value._w; }
	get zyzy() { return new Float4(this._z, this._y, this._z, this._y); } set zyzy(value: Float4) { this._z = value._z; this._y = value._w; }
	get zyzz() { return new Float4(this._z, this._y, this._z, this._z); } set zyzz(value: Float4) { this._y = value._y; this._z = value._w; }
	get zyzw() { return new Float4(this._z, this._y, this._z, this._w); } set zyzw(value: Float4) { this._y = value._y; this._z = value._z; this._w = value._w; }
	get zywx() { return new Float4(this._z, this._y, this._w, this._x); } set zywx(value: Float4) { this._z = value._x; this._y = value._y; this._w = value._z; this._x = value._w; }
	get zywy() { return new Float4(this._z, this._y, this._w, this._y); } set zywy(value: Float4) { this._z = value._x; this._w = value._z; this._y = value._w; }
	get zywz() { return new Float4(this._z, this._y, this._w, this._z); } set zywz(value: Float4) { this._y = value._y; this._w = value._z; this._z = value._w; }
	get zyww() { return new Float4(this._z, this._y, this._w, this._w); } set zyww(value: Float4) { this._z = value._x; this._y = value._y; this._w = value._w; }
	get zzxx() { return new Float4(this._z, this._z, this._x, this._x); } set zzxx(value: Float4) { this._z = value._y; this._x = value._w; }
	get zzxy() { return new Float4(this._z, this._z, this._x, this._y); } set zzxy(value: Float4) { this._z = value._y; this._x = value._z; this._y = value._w; }
	get zzxz() { return new Float4(this._z, this._z, this._x, this._z); } set zzxz(value: Float4) { this._x = value._z; this._z = value._w; }
	get zzxw() { return new Float4(this._z, this._z, this._x, this._w); } set zzxw(value: Float4) { this._z = value._y; this._x = value._z; this._w = value._w; }
	get zzyx() { return new Float4(this._z, this._z, this._y, this._x); } set zzyx(value: Float4) { this._z = value._y; this._y = value._z; this._x = value._w; }
	get zzyy() { return new Float4(this._z, this._z, this._y, this._y); } set zzyy(value: Float4) { this._z = value._y; this._y = value._w; }
	get zzyz() { return new Float4(this._z, this._z, this._y, this._z); } set zzyz(value: Float4) { this._y = value._z; this._z = value._w; }
	get zzyw() { return new Float4(this._z, this._z, this._y, this._w); } set zzyw(value: Float4) { this._z = value._y; this._y = value._z; this._w = value._w; }
	get zzzx() { return new Float4(this._z, this._z, this._z, this._x); } set zzzx(value: Float4) { this._z = value._z; this._x = value._w; }
	get zzzy() { return new Float4(this._z, this._z, this._z, this._y); } set zzzy(value: Float4) { this._z = value._z; this._y = value._w; }
	get zzzz() { return new Float4(this._z, this._z, this._z, this._z); } set zzzz(value: Float4) { this._z = value._w; }
	get zzzw() { return new Float4(this._z, this._z, this._z, this._w); } set zzzw(value: Float4) { this._z = value._z; this._w = value._w; }
	get zzwx() { return new Float4(this._z, this._z, this._w, this._x); } set zzwx(value: Float4) { this._z = value._y; this._w = value._z; this._x = value._w; }
	get zzwy() { return new Float4(this._z, this._z, this._w, this._y); } set zzwy(value: Float4) { this._z = value._y; this._w = value._z; this._y = value._w; }
	get zzwz() { return new Float4(this._z, this._z, this._w, this._z); } set zzwz(value: Float4) { this._w = value._z; this._z = value._w; }
	get zzww() { return new Float4(this._z, this._z, this._w, this._w); } set zzww(value: Float4) { this._z = value._y; this._w = value._w; }
	get zwxx() { return new Float4(this._z, this._w, this._x, this._x); } set zwxx(value: Float4) { this._z = value._x; this._w = value._y; this._x = value._w; }
	get zwxy() { return new Float4(this._z, this._w, this._x, this._y); } set zwxy(value: Float4) { this._z = value._x; this._w = value._y; this._x = value._z; this._y = value._w; }
	get zwxz() { return new Float4(this._z, this._w, this._x, this._z); } set zwxz(value: Float4) { this._w = value._y; this._x = value._z; this._z = value._w; }
	get zwxw() { return new Float4(this._z, this._w, this._x, this._w); } set zwxw(value: Float4) { this._z = value._x; this._x = value._z; this._w = value._w; }
	get zwyx() { return new Float4(this._z, this._w, this._y, this._x); } set zwyx(value: Float4) { this._z = value._x; this._w = value._y; this._y = value._z; this._x = value._w; }
	get zwyy() { return new Float4(this._z, this._w, this._y, this._y); } set zwyy(value: Float4) { this._z = value._x; this._w = value._y; this._y = value._w; }
	get zwyz() { return new Float4(this._z, this._w, this._y, this._z); } set zwyz(value: Float4) { this._w = value._y; this._y = value._z; this._z = value._w; }
	get zwyw() { return new Float4(this._z, this._w, this._y, this._w); } set zwyw(value: Float4) { this._z = value._x; this._y = value._z; this._w = value._w; }
	get zwzx() { return new Float4(this._z, this._w, this._z, this._x); } set zwzx(value: Float4) { this._w = value._y; this._z = value._z; this._x = value._w; }
	get zwzy() { return new Float4(this._z, this._w, this._z, this._y); } set zwzy(value: Float4) { this._w = value._y; this._z = value._z; this._y = value._w; }
	get zwzz() { return new Float4(this._z, this._w, this._z, this._z); } set zwzz(value: Float4) { this._w = value._y; this._z = value._w; }
	get zwzw() { return new Float4(this._z, this._w, this._z, this._w); } set zwzw(value: Float4) { this._z = value._z; this._w = value._w; }
	get zwwx() { return new Float4(this._z, this._w, this._w, this._x); } set zwwx(value: Float4) { this._z = value._x; this._w = value._z; this._x = value._w; }
	get zwwy() { return new Float4(this._z, this._w, this._w, this._y); } set zwwy(value: Float4) { this._z = value._x; this._w = value._z; this._y = value._w; }
	get zwwz() { return new Float4(this._z, this._w, this._w, this._z); } set zwwz(value: Float4) { this._w = value._z; this._z = value._w; }
	get zwww() { return new Float4(this._z, this._w, this._w, this._w); } set zwww(value: Float4) { this._z = value._x; this._w = value._w; }
	get wxxx() { return new Float4(this._w, this._x, this._x, this._x); } set wxxx(value: Float4) { this._w = value._x; this._x = value._w; }
	get wxxy() { return new Float4(this._w, this._x, this._x, this._y); } set wxxy(value: Float4) { this._w = value._x; this._x = value._z; this._y = value._w; }
	get wxxz() { return new Float4(this._w, this._x, this._x, this._z); } set wxxz(value: Float4) { this._w = value._x; this._x = value._z; this._z = value._w; }
	get wxxw() { return new Float4(this._w, this._x, this._x, this._w); } set wxxw(value: Float4) { this._x = value._z; this._w = value._w; }
	get wxyx() { return new Float4(this._w, this._x, this._y, this._x); } set wxyx(value: Float4) { this._w = value._x; this._y = value._z; this._x = value._w; }
	get wxyy() { return new Float4(this._w, this._x, this._y, this._y); } set wxyy(value: Float4) { this._w = value._x; this._x = value._y; this._y = value._w; }
	get wxyz() { return new Float4(this._w, this._x, this._y, this._z); } set wxyz(value: Float4) { this._w = value._x; this._x = value._y; this._y = value._z; this._z = value._w; }
	get wxyw() { return new Float4(this._w, this._x, this._y, this._w); } set wxyw(value: Float4) { this._x = value._y; this._y = value._z; this._w = value._w; }
	get wxzx() { return new Float4(this._w, this._x, this._z, this._x); } set wxzx(value: Float4) { this._w = value._x; this._z = value._z; this._x = value._w; }
	get wxzy() { return new Float4(this._w, this._x, this._z, this._y); } set wxzy(value: Float4) { this._w = value._x; this._x = value._y; this._z = value._z; this._y = value._w; }
	get wxzz() { return new Float4(this._w, this._x, this._z, this._z); } set wxzz(value: Float4) { this._w = value._x; this._x = value._y; this._z = value._w; }
	get wxzw() { return new Float4(this._w, this._x, this._z, this._w); } set wxzw(value: Float4) { this._x = value._y; this._z = value._z; this._w = value._w; }
	get wxwx() { return new Float4(this._w, this._x, this._w, this._x); } set wxwx(value: Float4) { this._w = value._z; this._x = value._w; }
	get wxwy() { return new Float4(this._w, this._x, this._w, this._y); } set wxwy(value: Float4) { this._x = value._y; this._w = value._z; this._y = value._w; }
	get wxwz() { return new Float4(this._w, this._x, this._w, this._z); } set wxwz(value: Float4) { this._x = value._y; this._w = value._z; this._z = value._w; }
	get wxww() { return new Float4(this._w, this._x, this._w, this._w); } set wxww(value: Float4) { this._x = value._y; this._w = value._w; }
	get wyxx() { return new Float4(this._w, this._y, this._x, this._x); } set wyxx(value: Float4) { this._w = value._x; this._y = value._y; this._x = value._w; }
	get wyxy() { return new Float4(this._w, this._y, this._x, this._y); } set wyxy(value: Float4) { this._w = value._x; this._x = value._z; this._y = value._w; }
	get wyxz() { return new Float4(this._w, this._y, this._x, this._z); } set wyxz(value: Float4) { this._w = value._x; this._y = value._y; this._x = value._z; this._z = value._w; }
	get wyxw() { return new Float4(this._w, this._y, this._x, this._w); } set wyxw(value: Float4) { this._y = value._y; this._x = value._z; this._w = value._w; }
	get wyyx() { return new Float4(this._w, this._y, this._y, this._x); } set wyyx(value: Float4) { this._w = value._x; this._y = value._z; this._x = value._w; }
	get wyyy() { return new Float4(this._w, this._y, this._y, this._y); } set wyyy(value: Float4) { this._w = value._x; this._y = value._w; }
	get wyyz() { return new Float4(this._w, this._y, this._y, this._z); } set wyyz(value: Float4) { this._w = value._x; this._y = value._z; this._z = value._w; }
	get wyyw() { return new Float4(this._w, this._y, this._y, this._w); } set wyyw(value: Float4) { this._y = value._z; this._w = value._w; }
	get wyzx() { return new Float4(this._w, this._y, this._z, this._x); } set wyzx(value: Float4) { this._w = value._x; this._y = value._y; this._z = value._z; this._x = value._w; }
	get wyzy() { return new Float4(this._w, this._y, this._z, this._y); } set wyzy(value: Float4) { this._w = value._x; this._z = value._z; this._y = value._w; }
	get wyzz() { return new Float4(this._w, this._y, this._z, this._z); } set wyzz(value: Float4) { this._w = value._x; this._y = value._y; this._z = value._w; }
	get wyzw() { return new Float4(this._w, this._y, this._z, this._w); } set wyzw(value: Float4) { this._y = value._y; this._z = value._z; this._w = value._w; }
	get wywx() { return new Float4(this._w, this._y, this._w, this._x); } set wywx(value: Float4) { this._y = value._y; this._w = value._z; this._x = value._w; }
	get wywy() { return new Float4(this._w, this._y, this._w, this._y); } set wywy(value: Float4) { this._w = value._z; this._y = value._w; }
	get wywz() { return new Float4(this._w, this._y, this._w, this._z); } set wywz(value: Float4) { this._y = value._y; this._w = value._z; this._z = value._w; }
	get wyww() { return new Float4(this._w, this._y, this._w, this._w); } set wyww(value: Float4) { this._y = value._y; this._w = value._w; }
	get wzxx() { return new Float4(this._w, this._z, this._x, this._x); } set wzxx(value: Float4) { this._w = value._x; this._z = value._y; this._x = value._w; }
	get wzxy() { return new Float4(this._w, this._z, this._x, this._y); } set wzxy(value: Float4) { this._w = value._x; this._z = value._y; this._x = value._z; this._y = value._w; }
	get wzxz() { return new Float4(this._w, this._z, this._x, this._z); } set wzxz(value: Float4) { this._w = value._x; this._x = value._z; this._z = value._w; }
	get wzxw() { return new Float4(this._w, this._z, this._x, this._w); } set wzxw(value: Float4) { this._z = value._y; this._x = value._z; this._w = value._w; }
	get wzyx() { return new Float4(this._w, this._z, this._y, this._x); } set wzyx(value: Float4) { this._w = value._x; this._z = value._y; this._y = value._z; this._x = value._w; }
	get wzyy() { return new Float4(this._w, this._z, this._y, this._y); } set wzyy(value: Float4) { this._w = value._x; this._z = value._y; this._y = value._w; }
	get wzyz() { return new Float4(this._w, this._z, this._y, this._z); } set wzyz(value: Float4) { this._w = value._x; this._y = value._z; this._z = value._w; }
	get wzyw() { return new Float4(this._w, this._z, this._y, this._w); } set wzyw(value: Float4) { this._z = value._y; this._y = value._z; this._w = value._w; }
	get wzzx() { return new Float4(this._w, this._z, this._z, this._x); } set wzzx(value: Float4) { this._w = value._x; this._z = value._z; this._x = value._w; }
	get wzzy() { return new Float4(this._w, this._z, this._z, this._y); } set wzzy(value: Float4) { this._w = value._x; this._z = value._z; this._y = value._w; }
	get wzzz() { return new Float4(this._w, this._z, this._z, this._z); } set wzzz(value: Float4) { this._w = value._x; this._z = value._w; }
	get wzzw() { return new Float4(this._w, this._z, this._z, this._w); } set wzzw(value: Float4) { this._z = value._z; this._w = value._w; }
	get wzwx() { return new Float4(this._w, this._z, this._w, this._x); } set wzwx(value: Float4) { this._z = value._y; this._w = value._z; this._x = value._w; }
	get wzwy() { return new Float4(this._w, this._z, this._w, this._y); } set wzwy(value: Float4) { this._z = value._y; this._w = value._z; this._y = value._w; }
	get wzwz() { return new Float4(this._w, this._z, this._w, this._z); } set wzwz(value: Float4) { this._w = value._z; this._z = value._w; }
	get wzww() { return new Float4(this._w, this._z, this._w, this._w); } set wzww(value: Float4) { this._z = value._y; this._w = value._w; }
	get wwxx() { return new Float4(this._w, this._w, this._x, this._x); } set wwxx(value: Float4) { this._w = value._y; this._x = value._w; }
	get wwxy() { return new Float4(this._w, this._w, this._x, this._y); } set wwxy(value: Float4) { this._w = value._y; this._x = value._z; this._y = value._w; }
	get wwxz() { return new Float4(this._w, this._w, this._x, this._z); } set wwxz(value: Float4) { this._w = value._y; this._x = value._z; this._z = value._w; }
	get wwxw() { return new Float4(this._w, this._w, this._x, this._w); } set wwxw(value: Float4) { this._x = value._z; this._w = value._w; }
	get wwyx() { return new Float4(this._w, this._w, this._y, this._x); } set wwyx(value: Float4) { this._w = value._y; this._y = value._z; this._x = value._w; }
	get wwyy() { return new Float4(this._w, this._w, this._y, this._y); } set wwyy(value: Float4) { this._w = value._y; this._y = value._w; }
	get wwyz() { return new Float4(this._w, this._w, this._y, this._z); } set wwyz(value: Float4) { this._w = value._y; this._y = value._z; this._z = value._w; }
	get wwyw() { return new Float4(this._w, this._w, this._y, this._w); } set wwyw(value: Float4) { this._y = value._z; this._w = value._w; }
	get wwzx() { return new Float4(this._w, this._w, this._z, this._x); } set wwzx(value: Float4) { this._w = value._y; this._z = value._z; this._x = value._w; }
	get wwzy() { return new Float4(this._w, this._w, this._z, this._y); } set wwzy(value: Float4) { this._w = value._y; this._z = value._z; this._y = value._w; }
	get wwzz() { return new Float4(this._w, this._w, this._z, this._z); } set wwzz(value: Float4) { this._w = value._y; this._z = value._w; }
	get wwzw() { return new Float4(this._w, this._w, this._z, this._w); } set wwzw(value: Float4) { this._z = value._z; this._w = value._w; }
	get wwwx() { return new Float4(this._w, this._w, this._w, this._x); } set wwwx(value: Float4) { this._w = value._z; this._x = value._w; }
	get wwwy() { return new Float4(this._w, this._w, this._w, this._y); } set wwwy(value: Float4) { this._w = value._z; this._y = value._w; }
	get wwwz() { return new Float4(this._w, this._w, this._w, this._z); } set wwwz(value: Float4) { this._w = value._z; this._z = value._w; }
	get wwww() { return new Float4(this._w, this._w, this._w, this._w); } set wwww(value: Float4) { this._w = value._w; }

	get length() { return Float4.magnitude(this); }
	get normalized() { return Float4.normalize(this); }

	static get zero() { return new Float4(); }
	static get one() { return new Float4(1); }
	//#endregion

	//#region ctor
	constructor();
	constructor(other: Float2);
	constructor(other: Float3);
	constructor(other: Float4);
	constructor(x: number);
	constructor(x: number, y: number, z: number, w: number);
	constructor(x?: number | Float2 | Float3 | Float4, y?: number, z?: number, w?: number) {
		if (x === undefined) {
			this._x = this._y = this._z = this._w = 0;
		} else if (x instanceof Float2) {
			this._x = x.x;
			this._y = x.y;
			this._z = this._w = 0;
		} else if (x instanceof Float3) {
			this._x = x.x;
			this._y = x.y;
			this._z = x.z;
			this._w = 0;
		} else if (x instanceof Float4) {
			this._x = x._x;
			this._y = x._y;
			this._z = x._z;
			this._w = x._w;
		} else if (y === undefined) {
			this._x = this._y = this._z = this._w = x;
		} else if (z !== undefined && w !== undefined) {
			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;
		} else {
			throw new Error("Invalid ctor overload.");
		}
	}
	//#endregion

	//#region Operators
	static add(left: Float4, right: number): Float4;
	static add(left: Float4, right: Float4): Float4;
	static add(left: Float4, right: number | Float4) {
		if (right instanceof Float4) {
			return new Float4(left._x + right._x, left._y + right._y, left._z + right._z, left._w + right._w);
		}
		return new Float4(left._x + right, left._y + right, left._z + right, left._w + right);
	}

	static sub(left: Float4, right: number): Float4;
	static sub(left: Float4, right: Float4): Float4;
	static sub(left: Float4, right: number | Float4) {
		if (right instanceof Float4) {
			return new Float4(left._x - right._x, left._y - right._y, left._z - right._z, left._w - right._w);
		}
		return new Float4(left._x - right, left._y - right, left._z - right, left._w - right);
	}

	static mul(left: Float4, right: number): Float4;
	static mul(left: Float4, right: Float4): Float4;
	static mul(left: Float4, right: number | Float4) {
		if (right instanceof Float4) {
			return new Float4(left._x * right._x, left._y * right._y, left._z * right._z, left._w * right._w);
		}
		return new Float4(left._x * right, left._y * right, left._z * right, left._w * right);
	}
	static div(left: Float4, right: number): Float4;
	static div(left: Float4, right: Float4): Float4;
	static div(left: Float4, right: number | Float4) {
		if (right instanceof Float4) {
			return new Float4(left._x / right._x, left._y / right._y, left._z / right._z, left._w / right._w);
		}
		return new Float4(left._x / right, left._y / right, left._z / right, left._w / right);
	}

	static mod(left: Float4, right: number): Float4;
	static mod(left: Float4, right: Float4): Float4;
	static mod(left: Float4, right: number | Float4) {
		if (right instanceof Float4) {
			const x = left._x % right._x, y = left._y % right._y, z = left._z % right._z, w = left._w % right._w;
			return new Float4(x < 0 ? x + right._x : x, y < 0 ? y + right._y : y, z < 0 ? z + right._z : z, w < 0 ? w + right._w : w);
		}
		const x = left._x % right, y = left._y % right, z = left._z % right, w = left._w % right;
		return new Float4(x < 0 ? x + right : x, y < 0 ? y + right : y, z < 0 ? z + right : z, w < 0 ? w + right : w);
	}
	//#endregion

	//#region Instance Methods
	equals(other: Float4) {
		return (this === other)
			|| (Math.abs(this._x - other._x) <= PRECISION && Math.abs(this._y - other._y) <= PRECISION && Math.abs(this._z - other._z) <= PRECISION && Math.abs(this._w - other._w) <= PRECISION);
	}

	toString() {
		return `Float4(${format(this._x, 8, 3)}  ${format(this._y, 8, 3)}  ${format(this._z, 8, 3)}  ${format(this._w, 8, 3)})`;
	}
	//#endregion

	//#region Static Methods
	static abs(v: Float4) {
		return new Float4(Math.abs(v._x), Math.abs(v._y), Math.abs(v._z), Math.abs(v._w));
	}

	static distance(a: Float4, b: Float4) {
		return Float4.magnitude(Float4.sub(a, b));
	}

	static dot(a: Float4, b: Float4) {
		return a._x * b._x + a._y * b._y + a._z * b._z + a.w * b._w;
	}

	static floor(v: Float4) {
		return new Float4(Math.floor(v._x), Math.floor(v._y), Math.floor(v._z), Math.floor(v._w));
	}

	static frac(v: Float4) {
		const x = v._x % 1, y = v._y % 1, z = v._z % 1, w = v._w % 1;
		return new Float4(x < 0 ? x + 1 : x, y < 0 ? y + 1 : y, z < 0 ? z + 1 : z, w < 0 ? w + 1 : w);
	}

	static lerp(a: Float4, b: Float4, t: number) {
		return new Float4(a._x + (b._x - a._x) * t, a._y + (b._y - a._y) * t, a._z + (b._z - a._z) * t, a._w + (b._w - a._w) * t);
	}

	static magnitude(v: Float4) {
		return Math.hypot(v._x, v._y, v._z, v._w);
	}

	static max(...v: Float4[]) {
		return new Float4(Math.max(...v.map(v => v._x)), Math.max(...v.map(v => v._y)), Math.max(...v.map(v => v._z)), Math.max(...v.map(v => v._w)));
	}

	static min(...v: Float4[]) {
		return new Float4(Math.min(...v.map(v => v._x)), Math.min(...v.map(v => v._y)), Math.min(...v.map(v => v._z)), Math.min(...v.map(v => v._w)));
	}

	static normalize(v: Float4) {
		const num = Float4.magnitude(v);
		if (num > 9.99999974737875E-06) {
			return Float4.div(v, num);
		}
		return Float4.zero;
	}

	static perspectiveDivide(v: Float4) {
		return new Float4(v._x / v._w, v._y / v._w, v._z / v._w, v._w);
	}

	static sqrMagnitude(v: Float4) {
		return Float4.dot(v, v);
	}
	//#endregion
}

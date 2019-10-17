import { Float2 } from "./float2";
import { Float3 } from "./float3";
import { Float4 } from "./float4";

export function clamp(t: number): number;
export function clamp(t: number, max: number): number;
export function clamp(t: number, min: number, max: number): number;
export function clamp(t: Float2): Float2;
export function clamp(t: Float2, max: number): Float2;
export function clamp(t: Float2, min: number, max: number): Float2;
export function clamp(t: Float3): Float3;
export function clamp(t: Float3, max: number): Float3;
export function clamp(t: Float3, min: number, max: number): Float3;
export function clamp(t: Float4): Float4;
export function clamp(t: Float4, max: number): Float4;
export function clamp(t: Float4, min: number, max: number): Float4;
export function clamp(t: number | Float2 | Float3 | Float4, min?: number, max?: number) {
	if (min === undefined) {
		min = 0;
		max = 1;
	} else if (max === undefined) {
		max = min;
		min = 0;
	}
	if (min > max) {
		const tmp = min;
		min = max;
		max = tmp;
	}
	if (t instanceof Float2) {
		return new Float2(
			Math.max(min, Math.min(max, t.x)),
			Math.max(min, Math.min(max, t.y))
		);
	} else if (t instanceof Float3) {
		return new Float3(
			Math.max(min, Math.min(max, t.x)),
			Math.max(min, Math.min(max, t.y)),
			Math.max(min, Math.min(max, t.z))
		);
	} else if (t instanceof Float4) {
		return new Float4(
			Math.max(min, Math.min(max, t.x)),
			Math.max(min, Math.min(max, t.y)),
			Math.max(min, Math.min(max, t.z)),
			Math.max(min, Math.min(max, t.w))
		);
	}
	return Math.max(min, Math.min(max, t));
};

export function format(n: number, length: number, fractions: 0 | 1 | 2 | 3 | 4 | 5 = 2) {
	length = Math.max(0, Math.min(20, length)) | 0;

	if (Number.isNaN(n)) {
		const s = "NaN";
		if (s.length < length) {
			return " ".repeat(length - s.length) + s;
		}
		return s;
	}

	if (!Number.isFinite(n)) {
		const s = ("+" + n.toString()).substr(-9, 4);
		if (s.length < length) {
			return " ".repeat(length - s.length) + s;
		}
		return s;
	}

	const f = n.toFixed(fractions);
	if (f.length < length) {
		return " ".repeat(length - f.length) + f;
	}
	return f;
}

export function lerp(a: number, b: number, t: number): number;
export function lerp(a: Float2, b: Float2, t: number): Float2;
export function lerp(a: Float3, b: Float3, t: number): Float3;
export function lerp(a: Float4, b: Float4, t: number): Float4;
export function lerp(a: number | Float2 | Float3 | Float4, b: number | Float2 | Float3 | Float4, t: number) {
	if (a instanceof Float2 && b instanceof Float2) {
		return Float2.lerp(a, b, t);
	} else if (a instanceof Float3 && b instanceof Float3) {
		return Float3.lerp(a, b, t);
	} else if (a instanceof Float4 && b instanceof Float4) {
		return Float4.lerp(a, b, t);
	} else if (typeof a !== "number" || typeof b !== "number") {
		throw new Error("Invalid parameter overload.");
	}
	return a + (b - a) * t;
};

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier: number = 1) {
	const width = canvas.clientWidth * multiplier | 0;
	const height = canvas.clientHeight * multiplier | 0;
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
}

export const PRECISION = 1e-6;
export const DEG2RAD = 0.017453292519943295;
export const RAD2DEG = 57.29577951308232;
export const COS_ONE_OVER_TWO = 0.877582561890372716;
export const PI_OVER_TWO = 1.5707963267948966;

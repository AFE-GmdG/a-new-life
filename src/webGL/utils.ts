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

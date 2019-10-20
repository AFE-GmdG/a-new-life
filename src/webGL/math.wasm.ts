import { Matrix4x4 } from ".";

export const wasmObj: {
	m44m44mul: (r: Matrix4x4, l: Matrix4x4, out: Matrix4x4) => Matrix4x4;
} = Object.create(null);

export function bootstrapper() {
	// @ts-ignore
	return import("file-loader!./m.wm")
		.then((wasmResult: { default: string }) => fetch(wasmResult.default))
		.then(response => response.arrayBuffer())
		.then(bytes => WebAssembly.compile(bytes))
		.then(module => WebAssembly.instantiate(module))
		.then(instance => {
			const buffer = new Float32Array(instance.exports.mem.buffer);

			wasmObj.m44m44mul = (r: Matrix4x4, l: Matrix4x4, out: Matrix4x4) => {
				buffer.set(r._, 0);
				buffer.set(l._, 16);
				instance.exports.m44m44mul(0, 64, 128);
				out._.set(buffer.subarray(32, 48), 0);
				return out;
			};

			return wasmObj;
		});
}

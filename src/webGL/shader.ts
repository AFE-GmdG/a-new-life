import { orThrow } from "../common";

export async function createProgram(context: WebGL2RenderingContext, source: string) {
	const [vsSource, fsSource] = await Promise.all([
		import("../shader/" + source + ".vs"),
		import("../shader/" + source + ".fs")
	]).then(([vs, fs]) => ([vs.default, fs.default]))
	const vs = context.createShader(context.VERTEX_SHADER) || orThrow("Could not create shader.");
	context.shaderSource(vs, vsSource);
	context.compileShader(vs);
	context.getShaderParameter(vs, context.COMPILE_STATUS) || orThrow("Could not compile shader.");
	const fs = context.createShader(context.FRAGMENT_SHADER) || orThrow("Could not create shader.");
	context.shaderSource(fs, fsSource);
	context.compileShader(fs);
	context.getShaderParameter(fs, context.COMPILE_STATUS) || orThrow("Could not compile shader.");
	const program = context.createProgram() || orThrow("Could not create program.");
	context.attachShader(program, vs);
	context.attachShader(program, fs);
	context.linkProgram(program);
	context.getProgramParameter(program, context.LINK_STATUS) || orThrow("Could not link program.");

	const positionAttributeLocation = context.getAttribLocation(program, "a_position");
	const positionBuffer = context.createBuffer();
	context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
	const positions = [
		0.0, 0.0,
		0.0, 0.5,
		0.7, 0.0,
	];
	context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);
	return {
		context,
		vs,
		fs,
		program,
		positionAttributeLocation,
		positionBuffer
	};
}

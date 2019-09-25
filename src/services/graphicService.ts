import { orThrow } from "../common";

export interface IGraphicService {
	readonly gl: WebGL2RenderingContext;

	cleanup(): void;
}

type ShaderProgramCache = {
	readonly currentProgramName: string;
	readonly currentProgram: WebGLProgram;
	readonly currentBufferName: string | undefined;
	readonly currentBuffer: WebGLBuffer | undefined;
};

type ShaderProgramCacheInfo = {
	readonly vertexShader: WebGLShader;
	readonly fragmentShader: WebGLShader;
	readonly program: WebGLProgram;
	readonly buffer: Map<string, BufferInfo>;
};

type BufferInfo = {
	readonly buffer: WebGLBuffer;
	readonly location: number;
	readonly target: number;
};

export function createGraphicServices(canvas: HTMLCanvasElement, skyboxNames: string[], textureNames: string[], shaderNames: string[], meshNames: string[], initializationUpdateCallback: (percent: number) => void) {
	const sum = skyboxNames.length + textureNames.length + shaderNames.length + meshNames.length;
	let loaded = 0;
	let currentProgramName: string;
	let currentProgram: WebGLProgram;
	let currentBufferName: string | undefined = undefined;
	let currentBuffer: WebGLBuffer | undefined = undefined;

	const contextAttributes: WebGLContextAttributes = {
		alpha: true,
		antialias: true,
		depth: true,
		failIfMajorPerformanceCaveat: false,
		premultipliedAlpha: false,
		preserveDrawingBuffer: false,
		stencil: true
	};

	return new Promise<IGraphicService>(async (resolve, reject) => {
		try {
			const gl = updateInitializationUpdateCallback((canvas.getContext("webgl2", contextAttributes) as WebGL2RenderingContext) || orThrow());

			canvas.addEventListener("webglcontextlost", onContextLost);
			canvas.addEventListener("webglcontextrestored", onContextRestored);

			gl.clearColor(0.7, 0, 0.7, 1.0);
			gl.clearDepth(1.0);
			gl.clearStencil(0.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);

			const shaderProgramCacheInfoMap = new Map<string, ShaderProgramCacheInfo>();

			const shaderProgramCache: ShaderProgramCache = Object.create(null, {
				currentProgramName: { enumerable: true, configurable: false, get: () => currentProgramName },
				currentProgram: { enumerable: true, configurable: false, get: () => currentProgram },
				currentBufferName: { enumerable: true, configurable: false, get: () => currentBufferName },
				currentBuffer: { enumerable: true, configurable: false, get: () => currentBuffer }

				// useProgram: { enumerable: true, configurable: false, value: useProgram },
				// useBuffer: { enumerable: true, configurable: false, value: useBuffer },
				// updateBuffer: { enumerable: true, configurable: false, value: updateBuffer },
				// cleanup: { enumerable: true, configurable: false, value: cleanupShaderProgramCache }
			});

			initShaderProgramCache(gl, shaderNames)

		} catch (reason) {
			reject(reason)
		}
	});

	function initShaderProgramCache(gl: WebGL2RenderingContext, shaderNames: string[]) {
		shaderNames.forEach(async shaderName => {
			const [vsSource, fsSource] = await Promise.all([
				import("../shader/" + shaderName + ".vs"),
				import("../shader/" + shaderName + ".fs")
			]).then<string[]>(([vs, fs]) => ([vs.default, fs.default]));

			const vs = gl.createShader(gl.VERTEX_SHADER) || orThrow(`Could not create vertex shader ${shaderName}.`);
			gl.shaderSource(vs, vsSource);
			gl.compileShader(vs);
			gl.getShaderParameter(vs, gl.COMPILE_STATUS) || orThrow(`Could not compile vertex shader ${shaderName}.`);

			const fs = gl.createShader(gl.FRAGMENT_SHADER) || orThrow(`Could not create fragment shader ${shaderName}.`);
			gl.shaderSource(fs, fsSource);
			gl.compileShader(fs);
			gl.getShaderParameter(fs, gl.COMPILE_STATUS) || orThrow(`Could not compile fragment shader ${shaderName}.`);

			updateInitializationUpdateCallback(vs);
		});
	}

	function onContextLost(event: Event) {
		orThrow("NotImplemented: onContextLost");
	}

	function onContextRestored(event: Event) {
		orThrow("NotImplemented: onContextRestored");
	}

	function updateInitializationUpdateCallback<T>(item: T) {
		initializationUpdateCallback((++loaded) * 100 / sum);
		return item;
	}

}


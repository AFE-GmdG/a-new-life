import { orThrow } from "../common";

export interface IGraphicService {
	readonly gl: WebGL2RenderingContext;

	cleanup(): void;
}

type ShaderCache = {
	readonly currentProgramName: string;
	readonly currentProgram: WebGLProgram;
	readonly currentBufferName: string | undefined;
	readonly currentBuffer: WebGLBuffer | undefined;
};

type ShaderInfo = {
	readonly vertexShader: WebGLShader;
	readonly fragmentShader: WebGLShader;
	readonly program: WebGLProgram;
	readonly bufferMap: Map<string, BufferInfo>;
};

type BufferInfo = {
	readonly buffer: WebGLBuffer;
	readonly location: number;
	readonly target: number;
};

type TextureInfo = {
	readonly texture: WebGLTexture;
	readonly width: number;
	readonly height: number;
	readonly unload: () => void;
};

export function createGraphicServices(canvas: HTMLCanvasElement, skyboxNames: string[], textureNames: string[], shaderNames: string[], meshNames: string[], initializationUpdateCallback: (percent: number) => void) {
	const sum = 1 + skyboxNames.length + textureNames.length + shaderNames.length + meshNames.length;
	let loaded = 0;
	let currentProgramName: string;
	let currentProgram: WebGLProgram;
	let currentBufferName: string | undefined = undefined;
	let currentBuffer: WebGLBuffer | undefined = undefined;

	const textureInfoMap = new Map<string, TextureInfo>();
	const shaderInfoMap = new Map<string, ShaderInfo>();

	// const shaderCache: ShaderCache = Object.create(null, {
	// 	currentProgramName: { enumerable: true, configurable: false, get: () => currentProgramName },
	// 	currentProgram: { enumerable: true, configurable: false, get: () => currentProgram },
	// 	currentBufferName: { enumerable: true, configurable: false, get: () => currentBufferName },
	// 	currentBuffer: { enumerable: true, configurable: false, get: () => currentBuffer }

	// 	// useProgram: { enumerable: true, configurable: false, value: useProgram },
	// 	// useBuffer: { enumerable: true, configurable: false, value: useBuffer },
	// 	// updateBuffer: { enumerable: true, configurable: false, value: updateBuffer },
	// 	// cleanup: { enumerable: true, configurable: false, value: cleanupShaderProgramCache }
	// });

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

			await initTextureCache(gl, textureNames);
			await initShaderCache(gl, shaderNames);

		} catch (reason) {
			reject(reason)
		}
	});

	function initTextureCache(gl: WebGL2RenderingContext, textureNames: string[]) {
		return Promise.all(textureNames.map(textureName => import(`../textures/${textureName}.png`).then(url => ({
			name: textureName,
			url: url.default as string
		})))).then(urls => Promise.all(urls.map(url => new Promise<string>((resolve, reject) => {
			const image = new Image();
			image.onerror = reason => {
				reject(reason);
			};
			image.onload = _ => {
				try {
					let texture: WebGLTexture | undefined = undefined;

					const textureInfo: TextureInfo = Object.create(null, {
						texture: {
							enumerable: true,
							configurable: false,
							get: () => {
								if (!texture) {
									texture = gl.createTexture() || orThrow(`Could not create texture ${url.name}`);
									gl.bindTexture(gl.TEXTURE_2D, texture);
									gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
									gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
									gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, image.width, image.height, 0, gl.RGBA, gl.FLOAT, image);
									// Automatic MipMap for all Pow2 Textures
									let { width, height } = image;
									if (isPow2(width) && isPow2(height)) {
										let level = 0;
										const canvas = document.createElement("canvas");
										const ctx = canvas.getContext("2d", { alpha: true }) || orThrow(`Could not create MipMap ${width}x${height} for ${url.name}.`);
										while (width > 1 || height > 1) {
											width = width > 1 ? width >> 1 : 1;
											height = height > 1 ? height >> 1 : 1;
											++level;
											canvas.width = width;
											canvas.height = height;
											ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
											gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA16F, width, height, 0, gl.RGBA, gl.FLOAT, canvas);
										}
									}
								}
								return texture;
							}
						},
						unload: {
							enumerable: true,
							configurable: false,
							value: () => {
								if (texture) {
									gl.deleteTexture(texture);
									texture = undefined;
								}
							},
							writable: false
						},
						width: { enumerable: true, configurable: false, value: image.width, writable: false },
						height: { enumerable: true, configurable: false, value: image.height, writable: false }
					});
					textureInfoMap.set(url.name, textureInfo);
					resolve(updateInitializationUpdateCallback(url.name));
				} catch (reason) {
					reject(reason);
				}
			};
			image.src = url.url;
		}))));
	}

	function initShaderCache(gl: WebGL2RenderingContext, shaderNames: string[]) {
		return Promise.all(shaderNames.map(async shaderName => {
			const [vsSource, fsSource] = await Promise.all([
				import("../shader/" + shaderName + ".vs"),
				import("../shader/" + shaderName + ".fs")
			]).then<string[]>(([vs, fs]) => ([vs.default, fs.default]));

			const vertexShader = gl.createShader(gl.VERTEX_SHADER) || orThrow(`Could not create vertex shader ${shaderName}.`);
			gl.shaderSource(vertexShader, vsSource);
			gl.compileShader(vertexShader);
			gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) || orThrow(`Could not compile vertex shader ${shaderName}.`);

			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) || orThrow(`Could not create fragment shader ${shaderName}.`);
			gl.shaderSource(fragmentShader, fsSource);
			gl.compileShader(fragmentShader);
			gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) || orThrow(`Could not compile fragment shader ${shaderName}.`);

			const program = gl.createProgram() || orThrow(`Could not create program ${shaderName}.`);
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			gl.getProgramParameter(program, gl.LINK_STATUS) || orThrow(`Could not link program ${shaderName}.`);

			const shaderInfo: ShaderInfo = Object.create(null, {
				vertexShader: { enumerable: true, configurable: false, value: vertexShader, writable: false },
				fragmentShader: { enumerable: true, configurable: false, value: fragmentShader, writable: false },
				program: { enumerable: true, configurable: false, value: program, writable: false },
				bufferMap: { enumerable: true, configurable: false, value: new Map<string, BufferInfo>(), writable: false }
			});

			shaderInfoMap.set(shaderName, shaderInfo);
			return updateInitializationUpdateCallback(shaderName);
		}));
	}

	function isPow2(value: number) {
		return (value & (value - 1)) === 0
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

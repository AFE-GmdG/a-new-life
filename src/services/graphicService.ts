import { parse } from "jsonc-parser";

import { Mesh, orThrow } from "../common";

export interface IGraphicService {
	readonly gl: WebGL2RenderingContext;
	readonly skyboxCache: SkyboxCache;
	readonly textureCache: TextureCache;
	readonly shaderCache: ShaderCache;
	readonly meshCache: MeshCache;

	cleanup(): void;
}

//#region Types
type SkyboxCache = {
	readonly get: (skyboxName: string) => WebGLTexture;
	readonly cleanup: () => void;
};

type SkyboxInfo = {
	readonly texture: WebGLTexture;
	readonly size: number;
	readonly unload: () => void;
};

type TextureCache = {
	readonly get: (textureName: string) => WebGLTexture;
	readonly isPow2: (textureName: string) => boolean;
	readonly cleanup: () => void;
};

type TextureInfo = {
	readonly texture: WebGLTexture;
	readonly width: number;
	readonly height: number;
	readonly unload: () => void;
};

type ShaderCache = {
	readonly currentProgramName: string;
	readonly currentProgram: WebGLProgram;
	readonly currentBufferName: string | undefined;
	readonly currentBuffer: WebGLBuffer | undefined;

	readonly useProgram: (programName: string) => WebGLProgram;
	// readonly useBuffer: (bufferName: string, type: number, usage: number, size: 1 | 2 | 3 | 4, normalized?: boolean, stride?: number, offset?: number, forceUse?: boolean) => number;
	// readonly updateBuffer: (bufferName: string, target: number, type: number, usage: number, data: ArrayBuffer | ArrayBufferView, size: 1 | 2 | 3 | 4, normalized?: boolean, stride?: number, offset?: number) => number;
	readonly cleanup: () => void;
};

type ShaderInfo = {
	readonly vertexShader: WebGLShader;
	readonly fragmentShader: WebGLShader;
	readonly program: WebGLProgram;
	// readonly bufferMap: Map<string, BufferInfo>;
};

type MeshCache = {
	readonly get: (meshName: string) => Mesh;
	readonly cleanup: () => void;
};

type MeshInfo = {
	readonly mesh: Mesh;
	readonly unload: () => void;
};

type BufferInfo = {
	readonly buffer: WebGLBuffer;
	readonly location: number;
	readonly target: number;
};
//#endregion

//#region Graphic Service
export function createGraphicService(canvas: HTMLCanvasElement, skyboxNames: string[], textureNames: string[], shaderNames: string[], meshNames: string[], initializationUpdateCallback: (percent: number) => void) {
	//#region createGraphicService
	const sum = 1 + skyboxNames.length + textureNames.length + shaderNames.length + meshNames.length;
	let loaded = 0;
	let currentProgramName: string;
	let currentProgram: WebGLProgram;
	// let currentBufferName: string | undefined = undefined;
	// let currentBuffer: WebGLBuffer | undefined = undefined;

	const skyboxInfoMap = new Map<string, SkyboxInfo>();
	const textureInfoMap = new Map<string, TextureInfo>();
	const shaderInfoMap = new Map<string, ShaderInfo>();
	const meshInfoMap = new Map<string, MeshInfo>();

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
			const gl = updateInitializationUpdateCallback((canvas.getContext("webgl2", contextAttributes) as WebGL2RenderingContext) || orThrow(`Could not get WebGL2 context.`));

			canvas.addEventListener("webglcontextlost", onContextLost);
			canvas.addEventListener("webglcontextrestored", onContextRestored);

			gl.clearColor(0.7, 0.0, 0.7, 1.0);
			gl.clearDepth(1.0);
			gl.clearStencil(0.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);

			const skyboxCache: SkyboxCache = Object.create(null, {
				get: { enumerable: true, configurable: false, writable: false, value: getSkybox },
				cleanup: { enumerable: true, configurable: false, writable: false, value: cleanupSkyboxCache }
			});

			const textureCache: TextureCache = Object.create(null, {
				get: { enumerable: true, configurable: false, writable: false, value: getTexture },
				isPow2: { enumerable: true, configurable: false, writable: false, value: isTextureIsPow2 },
				cleanup: { enumerable: true, configurable: false, writable: false, value: cleanupTextureCache }
			});

			const shaderCache: ShaderCache = Object.create(null, {
				currentProgramName: { enumerable: true, configurable: false, get: () => currentProgramName },
				currentProgram: { enumerable: true, configurable: false, get: () => currentProgram },
				// currentBufferName: { enumerable: true, configurable: false, get: () => currentBufferName },
				// currentBuffer: { enumerable: true, configurable: false, get: () => currentBuffer },

				useProgram: { enumerable: true, configurable: false, writable: false, value: (programName: string) => useProgram(gl, programName) },
				// useBuffer: { enumerable: true, configurable: false, writable: false, value: (bufferName: string, type: number, usage: number, size: 1 | 2 | 3 | 4, normalized: boolean = false, stride: number = 0, offset: number = 0, forceUse: boolean = false) => useBuffer(gl, bufferName, type, usage, size, normalized, stride, offset, forceUse) },
				// updateBuffer: { enumerable: true, configurable: false, writable: false, value: (bufferName: string, target: number, type: number, usage: number, data: ArrayBuffer | ArrayBufferView, size: 1 | 2 | 3 | 4, normalized: boolean = false, stride: number = 0, offset: number = 0) => updateBuffer(gl, bufferName, target, type, usage, data, size, normalized, stride, offset) },
				cleanup: { enumerable: true, configurable: false, writable: false, value: () => cleanupShaderCache(gl) }
			});

			const meshCache: MeshCache = Object.create(null, {
				get: { enumerable: true, configurable: false, writable: false, value: getMesh },
				cleanup: { enumerable: true, configurable: false, writable: false, value: cleanupMeshCache }
			});

			const graphicService: IGraphicService = Object.create(null, {
				gl: { enumerable: true, configurable: false, writable: false, value: gl },
				skyboxCache: { enumerable: true, configurable: false, writable: false, value: skyboxCache },
				textureCache: { enumerable: true, configurable: false, writable: false, value: textureCache },
				shaderCache: { enumerable: true, configurable: false, writable: false, value: shaderCache },
				meshCache: { enumerable: true, configurable: false, writable: false, value: meshCache },

				cleanup: { enumerable: true, configurable: false, writable: false, value: () => cleanup(gl) }
			});

			await initSkyboxCache(gl, skyboxNames);
			await initTextureCache(gl, textureNames);
			await initShaderCache(gl, shaderNames);
			await initMeshCache(graphicService, meshNames);

			resolve(graphicService);
		} catch (reason) {
			reject(reason)
		}
	});
	//#endregion

	//#region Skybox Cache
	function initSkyboxCache(gl: WebGL2RenderingContext, skyboxNames: string[]) {
		return Promise.all(skyboxNames.map(skyboxName => import(`../textures/${skyboxName}`).then(url => ({
			name: skyboxName,
			url: url.default as string
		})))).then(urls => Promise.all(urls.map(url => new Promise<string>((resolve, reject) => {
			const image = new Image();
			image.onerror = reason => {
				reject(reason);
			};
			image.onload = _ => {
				try {
					isPow2(image.height) || orThrow("Invalid skybox texture.");
					const size = image.height >> 1;
					(size * 3 === image.width) || orThrow("Invalid skybox texture.");
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d", { alpha: true }) || orThrow("Could not create canvas.");
					canvas.width = size;
					canvas.height = size;

					let texture: WebGLTexture | undefined = undefined;

					const skyboxInfo: SkyboxInfo = Object.create(null, {
						texture: {
							enumerable: true,
							configurable: false,
							get: () => {
								if (!texture) {
									texture = gl.createTexture() || orThrow(`Could not create skybox texture: ${url.name}`);
									gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
									gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
									gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
									ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
									gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, canvas);
								}
								return texture;
							}
						},
						unload: {
							enumerable: true,
							configurable: false,
							writable: false,
							value: () => {
								if (texture) {
									gl.deleteTexture(texture);
									texture = undefined;
								}
							}
						},
						size: { enumerable: true, configurable: false, writable: false, value: size }
					});
					skyboxInfoMap.set(url.name, skyboxInfo);
					resolve(updateInitializationUpdateCallback(url.name));
				} catch (reason) {
					reject(reason);
				}
			};
			image.src = url.url;
		}))));
	}

	function getSkybox(skyboxName: string) {
		const skyboxInfo = skyboxInfoMap.get(skyboxName) || orThrow(`Skybox not found: ${skyboxName}`);
		return skyboxInfo.texture;
	}

	function cleanupSkyboxCache() {
		skyboxInfoMap.forEach(skyboxInfo => skyboxInfo.unload());
	}
	//#endregion

	//#region Texture Cache
	function initTextureCache(gl: WebGL2RenderingContext, textureNames: string[]) {
		return Promise.all(textureNames.map(textureName => import(`../textures/${textureName}`).then(url => ({
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
							writable: false,
							value: () => {
								if (texture) {
									gl.deleteTexture(texture);
									texture = undefined;
								}
							}
						},
						width: { enumerable: true, configurable: false, writable: false, value: image.width },
						height: { enumerable: true, configurable: false, writable: false, value: image.height }
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

	function getTexture(textureName: string) {
		const textureInfo = textureInfoMap.get(textureName) || orThrow(`Texture not found: ${textureName}`);
		return textureInfo.texture;
	}

	function isPow2(value: number) {
		return (value & (value - 1)) === 0
	}

	function isTextureIsPow2(textureName: string) {
		const textureInfo = textureInfoMap.get(textureName) || orThrow(`Texture not found: ${textureName}`);
		return isPow2(textureInfo.width) && isPow2(textureInfo.height);
	}

	function cleanupTextureCache() {
		textureInfoMap.forEach(textureInfo => textureInfo.unload());
	}
	//#endregion

	//#region Shader Cache
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
				vertexShader: { enumerable: true, configurable: false, writable: false, value: vertexShader },
				fragmentShader: { enumerable: true, configurable: false, writable: false, value: fragmentShader },
				program: { enumerable: true, configurable: false, writable: false, value: program },
				bufferMap: { enumerable: true, configurable: false, writable: false, value: new Map<string, BufferInfo>() }
			});

			shaderInfoMap.set(shaderName, shaderInfo);
			return updateInitializationUpdateCallback(shaderName);
		}));
	}

	function useProgram(gl: WebGL2RenderingContext, programName: string) {
		const shaderInfo = shaderInfoMap.get(programName) || orThrow(`ShaderProgram not found: ${programName}`);
		const program = shaderInfo.program;
		if (currentProgram !== program) {
			gl.useProgram(program);
			currentProgramName = programName;
			currentProgram = program;
			// currentBufferName = undefined;
			// currentBuffer = undefined;
		}
		return program;
	}

	// function useBuffer(gl: WebGL2RenderingContext, bufferName: string, type: number, usage: number, size: 1 | 2 | 3 | 4, normalized: boolean, stride: number, offset: number, forceUse: boolean) {
	// 	const shaderInfo = shaderInfoMap.get(currentProgramName) || orThrow(`ShaderProgram not found: ${currentProgramName}`);
	// 	const bufferInfo = shaderInfo.bufferMap.get(bufferName) || orThrow(`Buffer not found: ${bufferName}`);
	// 	if (!forceUse && bufferInfo.buffer === currentBuffer) {
	// 		return bufferInfo.location;
	// 	}
	// 	type === gl.BYTE
	// 		|| type === gl.SHORT
	// 		|| type === gl.UNSIGNED_BYTE
	// 		|| type === gl.UNSIGNED_SHORT
	// 		|| type === gl.HALF_FLOAT
	// 		|| type === gl.FLOAT
	// 		|| orThrow(`Invalid buffer type. (${type})`);
	// 	usage === gl.STATIC_DRAW
	// 		|| usage === gl.DYNAMIC_DRAW
	// 		|| usage === gl.STREAM_DRAW
	// 		|| orThrow(`Invalid usage type. (${usage})`);
	// 	gl.bindBuffer(bufferInfo.target, bufferInfo.buffer);
	// 	gl.enableVertexAttribArray(bufferInfo.location);
	// 	gl.vertexAttribPointer(bufferInfo.location, size, type, normalized, stride, offset);
	// 	currentBufferName = bufferName;
	// 	currentBuffer = bufferInfo.buffer;
	// 	return bufferInfo.location;
	// }

	// function updateBuffer(gl: WebGL2RenderingContext, bufferName: string, target: number, type: number, usage: number, data: ArrayBuffer | ArrayBufferView, size: 1 | 2 | 3 | 4, normalized: boolean, stride: number, offset: number) {
	// 	const shaderInfo = shaderInfoMap.get(currentProgramName) || orThrow(`ShaderProgram not found: ${currentProgramName}`);
	// 	let bufferInfo = shaderInfo.bufferMap.get(bufferName);
	// 	if (!bufferInfo) {
	// 		target === gl.ARRAY_BUFFER
	// 			|| target === gl.ELEMENT_ARRAY_BUFFER
	// 			|| target === gl.COPY_READ_BUFFER
	// 			|| target === gl.COPY_WRITE_BUFFER
	// 			|| target === gl.TRANSFORM_FEEDBACK_BUFFER
	// 			|| target === gl.PIXEL_PACK_BUFFER
	// 			|| target === gl.PIXEL_UNPACK_BUFFER
	// 			|| orThrow(`Invalid buffer target. (${target})`);

	// 		const location = gl.getAttribLocation(shaderInfo.program, bufferName);
	// 		location >= 0 || orThrow(`Unknown buffer (${bufferName}) in program. (${currentProgramName})`);
	// 		bufferInfo = Object.create(null, {
	// 			buffer: { enumerable: true, configurable: false, writable: false, value: gl.createBuffer() || orThrow(`Could not create buffer. (${currentProgramName} - ${bufferName})`) },
	// 			location: { enumerable: true, configurable: false, writable: false, value: location },
	// 			target: { enumerable: true, configurable: false, writable: false, value: target }
	// 		}) as BufferInfo;
	// 		shaderInfo.bufferMap.set(bufferName, bufferInfo);
	// 	}
	// 	type === gl.BYTE
	// 		|| type === gl.SHORT
	// 		|| type === gl.UNSIGNED_BYTE
	// 		|| type === gl.UNSIGNED_SHORT
	// 		|| type === gl.HALF_FLOAT
	// 		|| type === gl.FLOAT
	// 		|| orThrow(`Invalid buffer type. (${type})`);
	// 	usage === gl.STATIC_DRAW
	// 		|| usage === gl.DYNAMIC_DRAW
	// 		|| usage === gl.STREAM_DRAW
	// 		|| orThrow(`Invalid usage type. (${usage})`);
	// 	gl.bindBuffer(bufferInfo.target, bufferInfo.buffer);
	// 	gl.bufferData(bufferInfo.target, data, usage);
	// 	gl.enableVertexAttribArray(bufferInfo.location);
	// 	gl.vertexAttribPointer(bufferInfo.location, size, type, normalized, stride, offset);
	// 	currentBufferName = bufferName;
	// 	currentBuffer = bufferInfo.buffer;
	// 	return bufferInfo.location;
	// }

	function cleanupShaderCache(gl: WebGL2RenderingContext) {
		shaderInfoMap.forEach(shaderInfo => {
			// shaderInfo.bufferMap.forEach(bufferInfo => {
			// 	gl.deleteBuffer(bufferInfo.buffer);
			// });
			gl.deleteProgram(shaderInfo.program);
			gl.deleteShader(shaderInfo.fragmentShader);
			gl.deleteShader(shaderInfo.vertexShader);
		});
		shaderInfoMap.clear();
	}
	//#endregion

	//#region Mesh Cache
	function initMeshCache(graphicService: IGraphicService, meshNames: string[]) {
		return Promise.all(meshNames.map(meshName => {
			return new Promise((resolve, reject) => {
				import(`../meshes/${meshName}.jsonc`)
					.then<string>(m => m.default)
					.then(jsonString => {
						const mesh = new Mesh(graphicService, parse(jsonString));
						const meshInfo: MeshInfo = Object.create(null, {
							mesh: { enumerable: true, configurable: false, writable: false, value: mesh },
							unload: { enumerable: true, configurable: false, writable: false, value: () => mesh.unload() }
						});
						meshInfoMap.set(meshName, meshInfo);
						resolve(updateInitializationUpdateCallback(meshName));
					})
					.catch(reason => {
						reject(updateInitializationUpdateCallback(reason));
					});
			});
		}));
	}

	function getMesh(meshName: string) {
		const meshInfo = meshInfoMap.get(meshName) || orThrow(`Mesh not found: ${meshName}`);
		return meshInfo.mesh;
	}

	function cleanupMeshCache() {
		meshInfoMap.forEach(meshInfo => meshInfo.unload());
		meshInfoMap.clear();
	}
	//#endregion

	//#region Common
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

	function cleanup(gl: WebGL2RenderingContext) {
		cleanupSkyboxCache();
		cleanupTextureCache();
		cleanupShaderCache(gl);
	}
	//#endregion
}
//#endregion

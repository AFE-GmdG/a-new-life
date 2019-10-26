import { orThrow } from "../common/assert";
import { IGraphicService } from "../services/graphicService";
import { Matrix4x4 } from "../webGL/matrix4x4";

//#region Types
type Vertex = number[];

type Normal = [number, number, number];

type UV = [number, number];

type Tri = [number, number, number];

type Quad = [number, number, number, number];

type JsonAttributeInfo = {
	name: string;
	components: string;
}

type JsonUniformTypeInfo = {
	name: string;
	type: "1f" | "2f" | "3f" | "4f" | "1i" | "2i" | "3i" | "4i" | "Matrix2f" | "Matrix3f" | "Matrix4f";
};

type JsonUniformArrayInfo = {
	name: string;
	type: "1fv" | "2fv" | "3fv" | "4fv" | "1iv" | "2iv" | "3iv" | "4iv" | "Matrix2fv" | "Matrix3fv" | "Matrix4fv";
	length: number;
};

type JsonUniformInfo = JsonUniformTypeInfo | JsonUniformArrayInfo;

type JsonSubMesh = {
	/** material name */
	m: string;
	/** texture names */
	t?: string[];
	/** skybox name */
	s?: string;
	/** attributes */
	a: JsonAttributeInfo[];
	/** uniforms */
	u: JsonUniformInfo[];
	/** face vertex indices */
	iv: (Tri | Quad)[];
	/** face normal indices */
	in?: (Tri | Quad)[];
	/** face uv indices */
	iuv?: (Tri | Quad)[];
};

type JsonMesh = {
	/** mesh name */
	name: string;
	/** vertex group names */
	vg?: string[];
	/** vertices (incl. vertex group data) */
	v: Vertex[];
	/** normals */
	n?: Normal[];
	/** uvs */
	uv?: UV[];
	/** sub meshes */
	sub: JsonSubMesh[];
};

type SubMesh = {
	readonly programName: string;
	readonly program: WebGLProgram;
	readonly attributeMap: ReadonlyMap<string, AttributeInfo>;
	readonly attributeBufferMap: ReadonlyMap<string, AttributeBuffer>;
	readonly uniformMap: ReadonlyMap<string, UniformInfo>;
	readonly uniformBufferMap: ReadonlyMap<string, UniformBuffer>;
	readonly indexBuffer: WebGLBuffer;
	readonly elementCount: number;
};

type AttributeInfo = {
	readonly subMeshIndex: number;
	readonly programName: string;
	readonly attributeName: string;
	readonly bufferSize: number;
	readonly elementCount: number;
	readonly rawBufferData: readonly number[];
};

type AttributeBuffer = {
	readonly bufferData: Float32Array;
	readonly buffer: WebGLBuffer;
};

export type UpdateAttributeBufferCallback = (attributeInfo: AttributeInfo, buffer: Float32Array) => boolean;

type UniformInfo = {
	readonly subMeshIndex: number;
	readonly programName: string;
	readonly uniformName: string;
};

type UniformBuffer = {
	readonly buffer: ArrayBufferView;
	readonly writeBuffer: (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: ArrayBufferView) => void;
};

export type UpdateUniformBufferCallback = (meshInstance: MeshInstance, uniformInfo: UniformInfo, buffer: ArrayBufferView) => void;

export type MeshInstance = {
	readonly instanceId: number;
	ignoreOnBatchRender: boolean;
	readonly transformMatrix: Matrix4x4;

	updateTransformMatrix(transformMatrix: Matrix4x4): void;
	updateUniforms(updateUniformBufferCallback: UpdateUniformBufferCallback): void;
	render(worldViewMatrix: Matrix4x4): void;
	remove(): void;
};
//#endregion

//#region Mesh
export class Mesh {
	private graphicService: IGraphicService;
	private maxInstanceId: number;
	private instances: MeshInstance[];
	private readonly subMeshes: readonly SubMesh[];

	constructor(graphicService: IGraphicService, jsonMesh: JsonMesh) {
		this.graphicService = graphicService;
		this.maxInstanceId = 0;
		this.instances = [];
		const { gl } = graphicService;

		// gehe über alle Faces und erzeuge dabei die Vertex- und Index Buffer.
		this.subMeshes = jsonMesh.sub.reduce<SubMesh[]>((subMeshes, jsonSubMesh, subMeshIndex) => {

			const potentialsMap = new Map<number, { n?: number, uv?: number, i: number }[]>();
			const vertices: Vertex[] = [];
			const indices: number[] = [];

			jsonSubMesh.iv.forEach((face, faceIndex) => {
				if (face.length === 3) {
					// Tri
					indices.push(...addTri(
						face[0], face[1], face[2],
						jsonMesh.n && jsonSubMesh.in![faceIndex][0],
						jsonMesh.n && jsonSubMesh.in![faceIndex][1],
						jsonMesh.n && jsonSubMesh.in![faceIndex][2],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][0],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][1],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][2]
					));
				} else {
					// Quad - split in two tris:
					indices.push(...addTri(
						face[0], face[1], face[2],
						jsonMesh.n && jsonSubMesh.in![faceIndex][0],
						jsonMesh.n && jsonSubMesh.in![faceIndex][1],
						jsonMesh.n && jsonSubMesh.in![faceIndex][2],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][0],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][1],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][2]
					));
					indices.push(...addTri(
						face[0], face[2], face[3],
						jsonMesh.n && jsonSubMesh.in![faceIndex][0],
						jsonMesh.n && jsonSubMesh.in![faceIndex][2],
						jsonMesh.n && jsonSubMesh.in![faceIndex][3],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][0],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][2],
						jsonMesh.uv && jsonSubMesh.iuv![faceIndex][3]
					));
				}
			});

			const map = new Map<string, number>([
				["x", 0],
				["y", 1],
				["z", 2],
				["nx", 3],
				["ny", 4],
				["nz", 5],
				["u", jsonMesh.n ? 6 : 3],
				["v", jsonMesh.n ? 7 : 4]
			]);

			const attributeMap = new Map<string, AttributeInfo>();
			const attributeBufferMap = new Map<string, AttributeBuffer>();
			const uniformMap = new Map<string, UniformInfo>();
			const uniformBufferMap = new Map<string, UniformBuffer>();

			jsonSubMesh.a.forEach(({ name, components }) => {
				const fns = components.split(/\s*,\s*/g).map(component => {
					if (component.charAt(0) === "g") {
						!map.has(component) && map.set(component, jsonMesh.n
							? jsonMesh.uv
								? 8 + Number.parseInt(component.substr(1))
								: 6 + Number.parseInt(component.substr(1))
							: jsonMesh.uv
								? 5 + Number.parseInt(component.substr(1))
								: 3 + Number.parseInt(component.substr(1)));
					} else if (/\-?\d+(?:\.\d+)/.test(component)) {
						const f = Number.parseFloat(component);
						return () => f;
					}
					return (vertex: Vertex) => vertex[map.get(component)!];
				});

				const bufferSize = fns.length * 4 * vertices.length;
				const elementCount = fns.length;
				const rawBufferData = vertices.reduce<number[]>((acc, vertex) => {
					acc.push(...fns.reduce<number[]>((v, fn) => {
						v.push(fn(vertex));
						return v;
					}, []));
					return acc;
				}, []);

				attributeMap.set(name, {
					subMeshIndex,
					programName: jsonSubMesh.m,
					attributeName: name,
					bufferSize,
					elementCount,
					rawBufferData,
				});

				attributeBufferMap.set(name, {
					bufferData: new Float32Array(fns.length * vertices.length),
					buffer: gl.createBuffer() || orThrow(`Could not create VertexBuffer ${name} for Mesh ${jsonMesh.name}`)
				});
			});

			jsonSubMesh.u.forEach(uniformInfo => {
				const { name } = uniformInfo;

				let arrayBufferView: ArrayBufferView;
				let writeBuffer: (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: ArrayBufferView) => void;

				switch (uniformInfo.type) {
					case "1f":
						arrayBufferView = new Float32Array(1);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform1fv(location, buffer)
						break;
					case "1fv":
						arrayBufferView = new Float32Array(1 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform1fv(location, buffer)
						break;
					case "2f":
						arrayBufferView = new Float32Array(2);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform2fv(location, buffer)
						break;
					case "2fv":
						arrayBufferView = new Float32Array(2 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform2fv(location, buffer)
						break;
					case "3f":
						arrayBufferView = new Float32Array(3);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform3fv(location, buffer)
						break;
					case "3fv":
						arrayBufferView = new Float32Array(3 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform3fv(location, buffer)
						break;
					case "4f":
						arrayBufferView = new Float32Array(4);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform4fv(location, buffer)
						break;
					case "4fv":
						arrayBufferView = new Float32Array(4 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniform4fv(location, buffer)
						break;
					case "1i":
						arrayBufferView = new Int32Array(1);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform1iv(location, buffer)
						break;
					case "1iv":
						arrayBufferView = new Int32Array(1 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform1iv(location, buffer)
						break;
					case "2i":
						arrayBufferView = new Int32Array(2);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform2iv(location, buffer)
						break;
					case "2iv":
						arrayBufferView = new Int32Array(2 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform2iv(location, buffer)
						break;
					case "3i":
						arrayBufferView = new Int32Array(3);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform3iv(location, buffer)
						break;
					case "3iv":
						arrayBufferView = new Int32Array(3 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform3iv(location, buffer)
						break;
					case "4i":
						arrayBufferView = new Int32Array(4);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform4iv(location, buffer)
						break;
					case "4iv":
						arrayBufferView = new Int32Array(4 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Int32Array) => gl.uniform4iv(location, buffer)
						break;
					case "Matrix2f":
						arrayBufferView = new Float32Array(4);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix2fv(location, false, buffer)
						break;
					case "Matrix2fv":
						arrayBufferView = new Float32Array(4 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix2fv(location, false, buffer)
						break;
					case "Matrix3f":
						arrayBufferView = new Float32Array(9);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix3fv(location, false, buffer)
						break;
					case "Matrix3fv":
						arrayBufferView = new Float32Array(9 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix3fv(location, false, buffer)
						break;
					case "Matrix4f":
						arrayBufferView = new Float32Array(16);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix4fv(location, false, buffer)
						break;
					case "Matrix4fv":
						arrayBufferView = new Float32Array(16 * uniformInfo.length);
						writeBuffer = (gl: WebGL2RenderingContext, location: WebGLUniformLocation, buffer: Float32Array) => gl.uniformMatrix4fv(location, false, buffer)
						break;
					default:
						throw new Error(`Unknown uniform type: ${uniformInfo!.type}`);
				}

				uniformMap.set(name, {
					subMeshIndex,
					programName: jsonSubMesh.m,
					uniformName: name
				});

				uniformBufferMap.set(name, {
					buffer: arrayBufferView,
					writeBuffer
				});
			});

			const indexBuffer = gl.createBuffer() || orThrow(`Could not create IndexBuffer for Mesh ${jsonMesh.name}`);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indices), gl.STATIC_DRAW);

			const subMesh: SubMesh = Object.create(null, {
				programName: { enumerable: true, configurable: false, writable: false, value: jsonSubMesh.m },
				program: { enumerable: true, configurable: false, get: getProgram.bind(this) },
				attributeMap: { enumerable: true, configurable: false, writable: false, value: attributeMap },
				attributeBufferMap: { enumerable: true, configurable: false, writable: false, value: attributeBufferMap },
				uniformMap: { enumerable: true, configurable: false, writable: false, value: uniformMap },
				uniformBufferMap: { enumerable: true, configurable: false, writable: false, value: uniformBufferMap },
				indexBuffer: { enumerable: true, configurable: false, writable: false, value: indexBuffer },
				elementCount: { enumerable: true, configurable: false, writable: false, value: indices.length / 3 }
			});

			subMeshes.push(subMesh);
			return subMeshes;

			function addTri(v0: number, v1: number, v2: number, n0?: number, n1?: number, n2?: number, uv0?: number, uv1?: number, uv2?: number) {
				return [
					getOrAddVertex(v0, n0, uv0),
					getOrAddVertex(v1, n1, uv1),
					getOrAddVertex(v2, n2, uv2)
				];
			}

			function getOrAddVertex(v: number, n?: number, uv?: number) {
				if (!potentialsMap.has(v)) {
					potentialsMap.set(v, [{ n, uv, i: vertices.length }]);
					const vertex = jsonMesh.v[v].slice();
					uv !== undefined && vertex.splice(3, 0, ...jsonMesh.uv![uv]);
					n !== undefined && vertex.splice(3, 0, ...jsonMesh.n![n]);
					vertices.push(vertex);
				}
				const potentials = potentialsMap.get(v)!;
				const index = potentials.findIndex(p => p.n === n && p.uv === uv);
				if (index >= 0) {
					return potentials[index].i;
				}
				const potential = { n, uv, i: vertices.length };
				potentials.push(potential);
				const vertex = jsonMesh.v[v].slice();
				uv !== undefined && vertex.splice(3, 0, ...jsonMesh.uv![uv]);
				n !== undefined && vertex.splice(3, 0, ...jsonMesh.n![n]);
				vertices.push(vertex);
				return potential.i;
			}

			function getProgram(this: Mesh) {
				return this.graphicService.shaderCache.useProgram(jsonSubMesh.m);
			}
		}, []);
	}

	unload = () => {
		this.instances = [];
		// ToDo: kill all buffers.
	}

	createInstance = (transformMatrix: Matrix4x4 = Matrix4x4.identity, ignoreOnBatchRender: boolean = false): MeshInstance => {
		const updateUniforms = (updateUniformBufferCallback: UpdateUniformBufferCallback) => {
			this.subMeshes.forEach(({ uniformMap, uniformBufferMap }) => {
				uniformMap.forEach((uniformInfo, uniformName) => {
					const { buffer } = uniformBufferMap.get(uniformName)!;
					updateUniformBufferCallback(instance, uniformInfo, buffer);
				});
			});
		};

		const render = (worldViewMatrix: Matrix4x4) => {
			const { gl } = this.graphicService;
			this.subMeshes.forEach(({ programName, program, attributeMap, attributeBufferMap, uniformMap, uniformBufferMap, indexBuffer, elementCount }) => {
				gl.useProgram(program);

				attributeMap.forEach(({ attributeName, elementCount }) => {
					const { buffer } = attributeBufferMap.get(attributeName)!;
					const location = gl.getAttribLocation(program, attributeName);
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.enableVertexAttribArray(location);
					gl.vertexAttribPointer(location, elementCount, gl.FLOAT, false, 0, 0);
				});

				uniformMap.forEach(({ uniformName }) => {
					const { buffer, writeBuffer } = uniformBufferMap.get(uniformName)!;
					const location = gl.getUniformLocation(program, uniformName) || orThrow(`Could not get uniform location ${uniformName} in shader ${programName}`);
					writeBuffer(gl, location, buffer);
				});

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

				gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);
			});
		};

		const remove = () => {
			// this.instances
		};

		const instance: MeshInstance = Object.create(null, {
			instanceId: { enumerable: true, configurable: false, writable: false, value: ++this.maxInstanceId },
			ignoreOnBatchRender: { enumerable: true, configurable: false, writable: true, value: ignoreOnBatchRender },
			transformMatrix: { enumerable: true, configurable: false, get: () => transformMatrix },

			updateTransformMatrix: { enumerable: true, configurable: false, writable: false, value: (newTransformMatrix: Matrix4x4) => { transformMatrix = newTransformMatrix; } },
			updateUniforms: { enumerable: true, configurable: false, writable: false, value: updateUniforms },
			render: { enumerable: true, configurable: false, writable: false, value: render },
			remove: { enumerable: true, configurable: false, writable: false, value: remove }
		});

		this.instances.push(instance);
		return instance;
	}

	updateBuffer = (updateAttributeBufferCallback?: UpdateAttributeBufferCallback) => {
		const { gl } = this.graphicService;
		if (!updateAttributeBufferCallback) {
			this.subMeshes.forEach(({ attributeMap, attributeBufferMap }) => {
				attributeMap.forEach(({ attributeName, rawBufferData }) => {
					// VertexBuffer are always Float32Arrays - Subject to change in future
					const { bufferData, buffer } = attributeBufferMap.get(attributeName)!;
					bufferData.set(rawBufferData);
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
				});
			});
			return;
		}
		this.subMeshes.forEach(({ attributeMap, attributeBufferMap }) => {
			attributeMap.forEach(attributeInfo => {
				const { attributeName, rawBufferData } = attributeInfo;
				// VertexBuffer are always Float32Arrays - Subject to change in future
				const { bufferData, buffer } = attributeBufferMap.get(attributeName)!;
				if (!updateAttributeBufferCallback(attributeInfo, bufferData)) {
					return;
				}
				bufferData.set(rawBufferData);
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
			});
		});
	}

	renderBatch = (worldViewMatrix: Matrix4x4) => {
		throw new Error("Not Implemented.");
	}
}
//#endregion

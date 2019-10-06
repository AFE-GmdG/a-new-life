import { orThrow } from "../common";
import { Matrix4x4 } from "../webGL/matrix4x4";

//#region Types
type Vertex = number[];
type Normal = [number, number, number];
type UV = [number, number];
type Tri = [number, number, number];
type Quad = [number, number, number, number];
type AttributeInfo = {
	name: string;
	components: string;
}
type JsonBufferInfo = {
	name: string;
	size: number;
}

type JsonSubMesh = {
	/** material name */
	m: string;
	/** texture names */
	t?: string[];
	/** skybox name */
	s?: string;
	/** attributes */
	a: AttributeInfo[];
	/** uniforms */
	u: JsonBufferInfo[];
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

type SubMeshParameter = {
	mesh: Mesh;
	gl: WebGL2RenderingContext;
	vertices: Vertex[];
	indices: number[];
	attributes: AttributeInfo[];
	uniforms: JsonBufferInfo[];
	programName: string;
	textureNames?: string[];
	skyboxName?: string;
};

export type MeshInstance = {
	readonly instanceId: number;
	ignoreOnBatchRender: boolean;

	updateTransformMatrix(transformMatrix: Matrix4x4): void;
	render(worldViewMatrix: Matrix4x4): void;
	remove(): void;
};
//#endregion

//#region Mesh
export class Mesh {
	private maxInstanceId: number;
	private instances: MeshInstance[];
	private subMeshes: SubMesh[];
	constructor(gl: WebGL2RenderingContext, jsonMesh: JsonMesh) {
		this.maxInstanceId = 0;
		this.instances = [];

		// gehe über alle Faces und erzeuge dabei die Vertex- und Index Buffer.
		this.subMeshes = jsonMesh.sub.reduce<SubMesh[]>((subMeshes, jsonSubMesh) => {

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

			const attributeMap = jsonSubMesh.a.reduce<Map<string, {
				bufferSize: number;
				elementCount: number;
				vertexBufferData: number[];
			}>>((getVertex, attributeInfo) => {
				const fns = attributeInfo.components.split(/\s*,\s*/g).map(component => {
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
				const vertexBufferData = vertices.reduce<number[]>((acc, vertex) => {
					acc.push(...fns.reduce<number[]>((v, fn) => {
						v.push(fn(vertex));
						return v;
					}, []));
					return acc;
				}, []);

				return getVertex.set(attributeInfo.name, {
					bufferSize,
					elementCount,
					vertexBufferData
				});
			}, new Map());


			// subMeshes.push(new SubMesh({
			// 	mesh: this,
			// 	gl,
			// 	vertices,
			// 	indices,
			// 	attributes: jsonSubMesh.a,
			// 	uniforms: jsonSubMesh.u,
			// 	programName: jsonSubMesh.m,
			// 	textureNames: jsonSubMesh.t,
			// 	skyboxName: jsonSubMesh.s
			// }));
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
		}, []);
	}

	unload = () => {
		this.instances = [];
		// ToDo: kill all buffers.
	}

	createInstance = (transformMatrix: Matrix4x4 = Matrix4x4.identity, ignoreOnBatchRender: boolean = false): MeshInstance => {
		const render = (worldViewMatrix: Matrix4x4) => {
		};

		const remove = () => {
			// this.instances
		};

		const instance: MeshInstance = Object.create(null, {
			instanceId: { enumerable: true, configurable: false, writable: false, value: ++this.maxInstanceId },
			ignoreOnBatchRender: { enumerable: true, configurable: false, writable: true, value: ignoreOnBatchRender },

			updateTransformMatrix: { enumerable: true, configurable: false, writable: false, value: (newTransformMatrix: Matrix4x4) => { transformMatrix = newTransformMatrix; } },
			render: { enumerable: true, configurable: false, writable: false, value: render },
			remove: { enumerable: true, configurable: false, writable: false, value: remove }
		});

		this.instances.push(instance);
		return instance;
	}

	renderBatch = (worldViewMatrix: Matrix4x4) => {
		throw new Error("Not Implemented.");
	}
}

class SubMesh {
	private vertices: Vertex[];
	private vertexBuffer: WebGLBuffer;
	private indices: number[];
	private programName: string;
	private texturNames?: string[];
	private skyboxName?: string;

	constructor({
		mesh,
		gl,
		vertices,
		indices,
		attributes,
		uniforms,
		programName,
		textureNames,
		skyboxName
	}: SubMeshParameter) {

		debugger;

		attributes.forEach(attribute => {
			const components = attribute.components.split(/\s*,\s*/g);

		});

		this.indices = indices;
		this.programName = programName;
		this.texturNames = textureNames;
	}

	public draw() {
	}
}
//#endregion

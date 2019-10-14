import { IGraphicService } from "../services/graphicService";
import { Float3 } from "../webGL/float3";
import { Matrix4x4 } from "../webGL/matrix4x4";

//#region Types
//#endregion

//#region Camera
export class Camera {
	private graphicService: IGraphicService;
	private _eye: Float3;
	private _at: Float3;
	private _up: Float3;

	public get eye() {
		return this._eye;
	}

	public get at() {
		return this._at;
	}

	public get up() {
		return this._up;
	}

	public get matrix() {
		return Matrix4x4.createLookAtMatrix(this._eye, this._at, this._up);
	}

	constructor(graphicService: IGraphicService);
	constructor(graphicService: IGraphicService, eye: Float3, at: Float3, up: Float3);
	constructor(graphicService: IGraphicService, matrix: Matrix4x4);
	constructor(graphicService: IGraphicService, eye?: Float3 | Matrix4x4, at?: Float3, up?: Float3) {
		this.graphicService = graphicService;
		if (!eye) {
			this._eye = new Float3(0, 0, 0);
			this._at = new Float3(0, 0, -1);
			this._up = new Float3(0, 1, 0);
		} else if (eye instanceof Matrix4x4) {
			// todo: decompose Matrix
			throw new Error("ToDo: Decompose Matrix.");
		} else {
			this._eye = eye;
			this._at = at!;
			this._up = up!;
		}
	}

}
//#endregion

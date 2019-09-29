import { orThrow } from "../common";
import { IGameService, View } from "../services/gameService";
import { Float3 } from "../webGL/float3";
import { Matrix4x4 } from "../webGL/matrix4x4";

export function createMainMenu(gameService: IGameService) {
	const { graphicService, inputService } = gameService;
	const { gl, shaderCache } = graphicService

	const tetraeder = new Float32Array([
		0.0, -0.25, -0.5,
		0.0, 0.25, 0.0,
		0.5, -0.25, 0.25,
		-0.5, -0.25, 0.25
	]);
	const indices = new Uint8Array([
		2, 1, 3,
		3, 1, 0,
		0, 1, 2,
		0, 2, 3
	]);
	/*const flatProgram = */shaderCache.useProgram("flat");
	shaderCache.updateBuffer("a_Vertex", gl.ARRAY_BUFFER, gl.FLOAT, gl.STATIC_DRAW, tetraeder, 3, false, 12, 0);
	const indexBuffer = gl.createBuffer() || orThrow();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	const world = Matrix4x4.identity;
	const projection = Matrix4x4.createOrthographic(-2, 2, -2, 2, -1, 1);
	let rotateY: Matrix4x4;
	let transform: Matrix4x4;

	inputService.keyboardState.addMapping("Escape");

	const mainMenu: View = Object.create(null, {
		onUpdateLogic: { enumerable: true, configurable: false, writable: false, value: onUpdateLogic },
		onUpdateGraphic: { enumerable: true, configurable: false, writable: false, value: onUpdateGraphic },
		onResize: { enumerable: true, configurable: false, writable: false, value: onResize },

		requestPause: { enumerable: true, configurable: false, writable: false, value: requestPause }
	});

	return mainMenu;

	function onUpdateLogic(totalTime: number, deltaTime: number, isFrontView: boolean) {
		if (!isFrontView) {
			return true;
		}

		rotateY = Matrix4x4.createRotationMatrix(new Float3(0.5, -0.4, 0.7).normalized, totalTime * 0.001);
		transform = Matrix4x4.mul(world, projection);
		transform = Matrix4x4.mul(transform, rotateY);

		if (inputService.keyboardState.isPressed("Escape")) {
			return false;
		}

		return true;
	}

	function onUpdateGraphic(isFrontView: boolean) {
		if (!isFrontView) {
			return;
		}

		const { gl, shaderCache } = graphicService;

		const flatProgram = shaderCache.useProgram("flat");
		shaderCache.useBuffer("a_Vertex", gl.FLOAT, gl.STATIC_DRAW, 3, false, 12, 0);

		const data1Location = gl.getUniformLocation(flatProgram, "u_Transform") || orThrow();
		gl.uniformMatrix4fv(data1Location, false, transform.elements);
		const data2Location = gl.getUniformLocation(flatProgram, "u_Color") || orThrow();
		gl.uniform4fv(data2Location, [1, 0, 0, 1]);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);

		gl.uniform4fv(data2Location, [0, 0, 0, 1]);
		gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_BYTE, 0);
		gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_BYTE, 3);
		gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_BYTE, 6);
		gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_BYTE, 9);
	}

	function onResize(newWidth: number, newHeight: number) {
	}

	function requestPause() {
		return false;
	}
}

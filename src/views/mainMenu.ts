import { orThrow } from "../common";
import { IGameService, View } from "../services/gameService";
import { Float3 } from "../webGL/float3";

export function createMainMenu(gameService: IGameService) {
	const { graphicService, inputService } = gameService;
	const { gl, shaderCache } = graphicService

	const reverseLightDirectionArray = new Float32Array([0, 0, 1]);
	let eye: Float3;
	let at: Float3;
	let up: Float3;

	const floor = new Float32Array([
		// x, y, z, tu, tv, nx, ny, nz
		5.0, -7.0, 0.0, 7.0, 0.0, 0.0, 0.0, 1.0,
		5.0, 7.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		-5.0, 7.0, 0.0, 0.0, 5.0, 0.0, 0.0, 1.0,
		-5.0, -7.0, 0.0, 7.0, 5.0, 0.0, 0.0, 1.0
	]);
	const floorProgram = shaderCache.useProgram("floor");
	shaderCache.updateBuffer("a_vertexTeil1", gl.ARRAY_BUFFER, gl.FLOAT, gl.STATIC_DRAW, floor, 4, false, 32, 0);
	shaderCache.updateBuffer("a_vertexTeil2", gl.ARRAY_BUFFER, gl.FLOAT, gl.STATIC_DRAW, floor, 4, false, 32, 16);

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

		if (inputService.keyboardState.isPressed("Escape")) {
			return false;
		}

		eye = new Float3(-4.95, 1.00 + Math.sin(totalTime / 3000), 1.75);
		at = new Float3(5.00, 1.91, 0.46);
		up = new Float3(0.00, 0.00, 1.00);

		return true;
	}

	function onUpdateGraphic(isFrontView: boolean) {
		if (!isFrontView) {
			return;
		}

		const { gl, shaderCache, textureCache, skyboxCache } = graphicService;

		shaderCache.useProgram("floor");
		shaderCache.useBuffer("a_vertexTeil1", gl.FLOAT, gl.STATIC_DRAW, 4, false, 32, 0);
		shaderCache.useBuffer("a_vertexTeil2", gl.FLOAT, gl.STATIC_DRAW, 4, false, 32, 16);

		const data1Location = gl.getUniformLocation(floorProgram, "u_data1") || orThrow();
		gl.uniformMatrix4fv(data1Location, false, [60, 1000, at.x, up.y, 846, eye.x, at.y, up.z, 412, eye.y, at.z, 0.0, 0.1, eye.z, up.x, 0.0]);
		const data2Location = gl.getUniformLocation(floorProgram, "u_data2") || orThrow();
		gl.uniform4f(data2Location, 0.0, 0.0, 0.0, 0.0);

		const reverseLightDirectionLocation = gl.getUniformLocation(floorProgram, "u_reverseLightDirection") || orThrow();
		gl.uniform3fv(reverseLightDirectionLocation, reverseLightDirectionArray);
		const colorTextureUniformLocation = gl.getUniformLocation(floorProgram, "u_color") || orThrow();
		gl.uniform1i(colorTextureUniformLocation, 0);
		const cubeMapUniformLocation = gl.getUniformLocation(floorProgram, "u_cube") || orThrow();
		gl.uniform1i(cubeMapUniformLocation, 1);

		gl.activeTexture(gl.TEXTURE0);
		const textureName = "app.png";
		gl.bindTexture(gl.TEXTURE_2D, textureCache.get(textureName));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, textureCache.isPow2(textureName) ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxCache.get("Skybox-Grass-512.jpg"));
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	function onResize(newWidth: number, newHeight: number) {
	}

	function requestPause() {
		return false;
	}
}

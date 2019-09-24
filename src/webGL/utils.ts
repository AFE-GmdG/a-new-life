export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier: number = 1) {
	const width = canvas.clientWidth * multiplier | 0;
	const height = canvas.clientHeight * multiplier | 0;
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
}

export async function loadTextures(context: WebGL2RenderingContext, ...names: string[]) {
	const urls = await Promise.all(names.map(name => import("../textures/" + name + ".png"))).then(urls => urls.map(url => url.default as string));
	console.log(urls);
}

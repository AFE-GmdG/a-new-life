export function delay(timeout: number) {
	return new Promise<void>(resolve => {
		window.setTimeout(resolve, timeout);
	});
}

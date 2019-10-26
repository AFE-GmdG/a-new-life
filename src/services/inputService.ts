import { orThrow } from "../common/assert";

export interface IInputService {
	readonly keyboardState: KeyboardState;
	readonly mouseState: MouseState;
	cleanup(): void;
}

export type KeyboardState = {
	addMapping(code: string, reportOnlyOnRelease?: boolean, callback?: (isPressed: boolean) => void): void;
	removeMapping(code: string): void;
	isPressed(code: string): boolean;
};

type KeyInfo = {
	isPressed: boolean;
	reportOnlyOnRelease: boolean;
	oldKeyInfo: KeyInfo | undefined;

	onPressed?(isPressed: boolean): void;
	removeMapping(code: string): void;
};

export type MouseState = {
	readonly absolutePos: { readonly x: number | undefined, readonly y: number | undefined };
	readonly relativePos: { readonly x: number | undefined, readonly y: number | undefined };
	readonly pressedButtons: PressedMouseButtons;

	// addMapping(button: MouseButton, reportOnlyOnRelease?: boolean, callback?: (isPressed: boolean) => void): void;
};

enum MouseButton {
	Left = 0,
	Center = 1,
	Right = 2
}

enum PressedMouseButtons {
	None = 0,
	Left = 1,
	Right = 2,
	LeftRight = 3,
	Center = 4,
	LeftCenter = 5,
	RightCenter = 6,
	LeftRightCenter = 7
}

class InputService implements IInputService {
	private canvas: HTMLCanvasElement;
	private keyInfoMap: Map<string, KeyInfo>;
	readonly keyboardState: KeyboardState;

	private absoluteMousePos: { readonly x: number | undefined, readonly y: number | undefined };
	private relativeMousePos: { readonly x: number | undefined, readonly y: number | undefined };
	private pressedMouseButtons: PressedMouseButtons;
	readonly mouseState: MouseState;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.keyInfoMap = new Map<string, KeyInfo>();
		this.keyboardState = Object.create(null, {
			addMapping: { enumerable: true, configurable: false, value: this.addKeyboardMapping.bind(this) },
			removeMapping: { enumerable: true, configurable: false, value: this.removeKeyboardMapping.bind(this) },
			isPressed: { enumerable: true, configurable: false, value: this.isKeyboardPressed.bind(this) }
		});

		this.absoluteMousePos = { x: undefined, y: undefined };
		this.relativeMousePos = { x: undefined, y: undefined };
		this.pressedMouseButtons = PressedMouseButtons.None;
		this.mouseState = Object.create(null, {
			absolutePos: { enumerable: true, configurable: false, get: () => this.absoluteMousePos },
			relativePos: { enumerable: true, configurable: false, get: () => this.relativeMousePos },
			pressedButtons: { enumerable: true, configurable: false, get: () => this.pressedMouseButtons },
		});

		["keydown", "keyup"].forEach(type => window.addEventListener(type, this.handleKeyboardEvents));
		["mousedown", "mouseup"].forEach(type => canvas.addEventListener(type, this.handleMouseClickEvents));
		canvas.addEventListener("mousemove", this.handleMouseMove);
		canvas.addEventListener("mouseleave", this.handleMouseLeave);
		canvas.addEventListener("contextmenu", this.handleContextMenu);
	}

	/* event handler */
	private handleKeyboardEvents = (event: KeyboardEvent) => {
		const { code } = event;
		const keyInfo = this.keyInfoMap.get(code);
		if (!keyInfo) {
			return;
		}

		event.preventDefault();

		const isPressed = (event.type === "keydown");
		if (keyInfo.isPressed === isPressed) {
			// No change; return
			return;
		}

		keyInfo.isPressed = isPressed;
		if (keyInfo.onPressed) {
			if (!isPressed && keyInfo.reportOnlyOnRelease) {
				keyInfo.onPressed.call(this.keyboardState, true);
			} else if (!keyInfo.reportOnlyOnRelease) {
				keyInfo.onPressed.call(this.keyboardState, isPressed);
			}
		}
	};

	private handleMouseClickEvents = (event: MouseEvent) => {
		const { type, button, buttons } = event;
		console.log("handleMouseClickEvents", type, button, buttons);
	};

	private handleMouseMove = (event: MouseEvent) => {
		const { offsetX, offsetY, buttons, currentTarget } = event;
		const { clientWidth, clientHeight } = (currentTarget as HTMLCanvasElement);
		this.absoluteMousePos = { x: offsetX, y: offsetY };
		this.relativeMousePos = { x: ((offsetX / clientWidth) - 0.5) * (clientWidth / clientHeight), y: 0.5 - (offsetY / clientHeight) };
		this.pressedMouseButtons = buttons;
	};

	/*
		clientSize: 16x10
		mousePos: 10x3

	*/

	private handleMouseLeave = (event: MouseEvent) => {
		this.absoluteMousePos = { x: undefined, y: undefined };
		this.relativeMousePos = { x: undefined, y: undefined };
		this.pressedMouseButtons = PressedMouseButtons.None;
	};

	private handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
	};

	/* public methods */
	cleanup() {
		this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
		["mousedown", "mouseup"].forEach(type => this.canvas.removeEventListener(type, this.handleMouseClickEvents));
		["keydown", "keyup"].forEach(type => window.removeEventListener(type, this.handleKeyboardEvents));
	}

	/* private methods */
	private addKeyboardMapping(code: string, reportOnlyOnRelease: boolean = false, callback?: (isPressed: boolean) => void) {
		this.keyInfoMap.set(code, Object.create(null, {
			isPressed: { enumerable: true, configurable: false, writable: true, value: false },
			reportOnlyOnRelease: { enumerable: true, configurable: false, writable: false, value: reportOnlyOnRelease },
			oldKeyInfo: { enumerable: true, configurable: false, writable: false, value: this.keyInfoMap.get(code) },

			onPressed: { enumerable: true, configurable: false, writable: false, value: callback },
			removeMapping: {
				enumerable: true,
				configurable: false,
				writable: false,
				value: (code: string) => {
					const keyInfo = this.keyInfoMap.get(code) || orThrow();
					if (keyInfo.oldKeyInfo) {
						this.keyInfoMap.set(code, keyInfo.oldKeyInfo);
					} else {
						this.keyInfoMap.delete(code);
					}
				}
			}
		}));
	}

	private removeKeyboardMapping(code: string) {
		const keyInfo = this.keyInfoMap.get(code);
		keyInfo && keyInfo.removeMapping(code);
	}

	private isKeyboardPressed(code: string) {
		const keyInfo = this.keyInfoMap.get(code);
		return keyInfo && keyInfo.isPressed || false;
	}
};

export function createInputService(canvas: HTMLCanvasElement): IInputService {
	return new InputService(canvas);
}

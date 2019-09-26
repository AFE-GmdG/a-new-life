import { orThrow, FourBitFlag, FourBitSelect } from "../common";

export interface IInputService {
	readonly keyboardState: KeyboardState;
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

class InputService implements IInputService {
	private keyInfoMap: Map<string, KeyInfo>;
	readonly keyboardState: KeyboardState;

	constructor(canvas: HTMLCanvasElement) {
		this.keyInfoMap = new Map<string, KeyInfo>();
		this.keyboardState = Object.create(null, {
			addMapping: { enumerable: true, configurable: false, value: this.addKeyboardMapping.bind(this) },
			removeMapping: { enumerable: true, configurable: false, value: this.removeKeyboardMapping.bind(this) },
			isPressed: { enumerable: true, configurable: false, value: this.isKeyboardPressed.bind(this) }
		});

		["keydown", "keyup"].forEach(type => window.addEventListener(type, this.handleKeyboardEvents));
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
	}

	/* public methods */
	cleanup() {
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

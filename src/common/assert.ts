export function orThrow(message: string = "Unexpected falsy"): never {
	throw new Error(message);
}

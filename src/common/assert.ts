export function assertNever(obj: never): never {
	throw new Error("Unexpected object: " + obj);
}

export function orThrow(message: string = "Unexpected falsy"): never {
	throw new Error(message);
}

import { Quaternion } from "webGL/quaternion";

describe("Quaternion Tests", () => {

	it("multiplies two quaternions", () => {
		const q1 = new Quaternion(0, 0, 0, 1);
		const q2 = new Quaternion(0, 0, 0, 1);
		const result = Quaternion.mul(q1, q2);
		const expected = new Quaternion(0, 0, 0, 1);
		expect(result.equals(expected)).toBe(true);
	});

});

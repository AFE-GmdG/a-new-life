import { Store } from "@easm/core";
import { createHook } from "@easm/react";
import { GameObject } from "../common/gameObject";
import { Float3 } from "../webGL/float3";
import { Quaternion } from "../webGL/quaternion";

type ApplicationStoreState = {
	scene: {
		activeCamera: {
			location: {
				x: number;
				y: number;
				z: number;
			}
		};
		targetGameObject: GameObject;
	}
};

const applicationStore = new Store<ApplicationStoreState>({
});

export const useSceneStore = createHook(applicationStore.state.scene);

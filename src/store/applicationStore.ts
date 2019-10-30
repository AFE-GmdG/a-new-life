import { Store } from "@easm/core";
import { createHook } from "@easm/react";
import { Camera } from "../common/camera";
import { GameObject } from "../common/gameObject";
import { Float3 } from "../webGL/float3";
import { Quaternion } from "../webGL/quaternion";

type ApplicationStoreState = {
	scene: {
		activeCamera: Camera;
		targetGameObject: GameObject;
	}
};

const applicationStore = new Store<ApplicationStoreState>({
});

export const useSceneStore = createHook(applicationStore.state.scene);

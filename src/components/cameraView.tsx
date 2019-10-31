import React from "react";
import { get } from "@easm/core";

import { useSceneStore } from "../store/applicationStore";
import { Float3 } from "../webGL/float3";

const tableStyle: React.CSSProperties = {
	position: "absolute",
	top: "2rem",
	right: "2rem",
	width: "16rem",
	border: "1px solid #000",
	padding: "0 0.5rem",
	backgroundColor: "#4f4f4f"
};

const thStyle: React.CSSProperties = {
	textAlign: "left"
};

const numericTdStyle: React.CSSProperties = {
	textAlign: "right"
};

const rangeInputStyle: React.CSSProperties = {
	width: "100%"
};

export const CameraView: React.FC = props => {
	const { activeCamera } = useSceneStore(store => ({
		activeCamera: get(store.state.activeCamera)
	}));
	const [pos, setCamperaPos] = React.useState<Float3>(new Float3(activeCamera.transform.localPosition));
	const setPos = (newPos: Float3) => {
		activeCamera.transform.localPosition.update(newPos)
		setCamperaPos(newPos);
	};
	const changePosX = (event: React.ChangeEvent<HTMLInputElement>) => setPos(new Float3(event.currentTarget.valueAsNumber, pos.y, pos.z));
	const changePosY = (event: React.ChangeEvent<HTMLInputElement>) => setPos(new Float3(pos.x, event.currentTarget.valueAsNumber, pos.z));
	const changePosZ = (event: React.ChangeEvent<HTMLInputElement>) => setPos(new Float3(pos.x, pos.y, event.currentTarget.valueAsNumber));

	return (
		<table style={ tableStyle }>
			<colgroup>
				<col width={ 10 } />
				<col width={ 30 } />
				<col width={ 50 } />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th style={ thStyle } colSpan={ 4 }>Active Camera</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colSpan={ 4 }>Pos</td>
				</tr>
				<tr>
					<td></td>
					<td>X</td>
					<td style={ numericTdStyle }>{ pos.x.toFixed(2) }</td>
					<td><input style={ rangeInputStyle } type="range" min={ -8 } max={ 8 } step={ 0.01 } value={ pos.x } onChange={ changePosX } /></td>
				</tr>
				<tr>
					<td></td>
					<td>Y</td>
					<td style={ numericTdStyle }>{ pos.y.toFixed(2) }</td>
					<td><input style={ rangeInputStyle } type="range" min={ -8 } max={ 8 } step={ 0.01 } value={ pos.y } onChange={ changePosY } /></td>
				</tr>
				<tr>
					<td></td>
					<td>Z</td>
					<td style={ numericTdStyle }>{ pos.z.toFixed(2) }</td>
					<td><input style={ rangeInputStyle } type="range" min={ -8 } max={ 8 } step={ 0.01 } value={ pos.z } onChange={ changePosZ } /></td>
				</tr>
			</tbody>
		</table>
	);
};

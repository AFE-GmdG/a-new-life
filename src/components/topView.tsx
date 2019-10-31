import React from "react";
import { get } from "@easm/core";

import { useSceneStore } from "../store/applicationStore";
import { Float3 } from "../webGL/float3";

const svgElementStyle: React.CSSProperties = {
	margin: "2rem",
	border: "1px solid #000",
	width: 800,
	height: 800,
	backgroundColor: '#4f4f4f'
};

type Line = {
	x1: string | number;
	y1: string | number;
	x2: string | number;
	y2: string | number;
	stroke?: string;
	strokeWidth?: string | number;
	strokeLinecap?: "inherit" | "round" | "butt" | "square";
	strokeDasharray?: string;
}

function mapRange(v: number, i1: number, i2: number, o1: number, o2: number) {
	return o1 + ((o2 - o1) / (i2 - i1)) * (v - i1);
};

export const TopView: React.FC = props => {
	const { activeCamera } = useSceneStore(store => ({
		activeCamera: get(store.state.activeCamera)
	}));

	const x_lines = Array.from({ length: 21 }, (v, k): Line => {
		const x1 = mapRange(-10, -11, 11, 0, 799).toFixed(1);
		const x2 = mapRange(10, -11, 11, 0, 799).toFixed(1);
		const y = mapRange(k - 10, -11, 11, 0, 799).toFixed(1);

		return {
			x1,
			x2,
			y1: y,
			y2: y,
			stroke: (k - 10) === 0 ? "#ff0000ff" : "#cccccc77",
			strokeWidth: 1.5,
			strokeLinecap: "round",
			strokeDasharray: (k - 10) === 0 ? undefined : "2, 2"
		}
	});

	const y_lines = Array.from({ length: 21 }, (v, k): Line => {
		const x = mapRange(k - 10, -11, 11, 0, 799).toFixed(1);
		const y1 = mapRange(-10, -11, 11, 0, 799).toFixed(1);
		const y2 = mapRange(10, -11, 11, 0, 799).toFixed(1);

		return {
			x1: x,
			x2: x,
			y1,
			y2,
			stroke: (k - 10) === 0 ? "#00ff00ff" : "#cccccc77",
			strokeWidth: 1.5,
			strokeLinecap: "round",
			strokeDasharray: (k - 10) === 0 ? undefined : "2, 2"
		}
	});



	return (
		<svg style={ svgElementStyle } viewBox="0 0 800 800">
			{
				[...x_lines, ...y_lines].map((line, index) => (
					<line key={ index } { ...line } />
				))
			}
		</svg>
	);
};

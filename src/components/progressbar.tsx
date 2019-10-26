import React from "react";

export type ProgressBarProps = {
	percent: number | null;
}

export const ProgressBar: React.FC<ProgressBarProps> = props => {
	const { percent } = props;

	if (percent === null) {
		return null;
	}

	return <div className="progress-bar" style={ { backgroundSize: percent.toFixed(1) + "%" } }>{ percent.toFixed(0) + "%" }</div>;
};

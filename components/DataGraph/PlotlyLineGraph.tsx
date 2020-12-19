import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import Plotly from "react-native-plotly";

type Props = {
	dimensions: {};
	modal: boolean;
};

const PlotlyLineGraph: FC<Props> = (props) => {
	const { dimensions, modal } = props;
	const [thisHeight, setHeight] = useState(null);
	const [thisWidth, setWidth] = useState(null);
	const [isModal, setIsModal] = useState(false);

	const data = [
		{
			x: [1, 2, 3, 4, 5],
			y: [1, 2, 3, 4, 8],
			mode: "lines",
		},
		{
			x: [4, 2, 4, 4, 5],
			y: [2, 3, 4, 5, 6],
			mode: "markers",
		},
	];

	useEffect(() => {
		setIsModal(modal);
		if (isModal === true) {
			setHeight(dimensions.height - 100);
			setWidth(dimensions.width - 50);
		} else {
			setHeight(dimensions.height);
			setWidth(dimensions.width);
		}
	});

	const layout = {
		title: "SkillStar",
		height: thisHeight,
		width: thisWidth,
	};

	return (
		<Plotly
			update={() => {}}
			data={data}
			layout={layout}
			enableFullPlotly={true}
			style={styles.graph}
		/>
	);
};

export default PlotlyLineGraph;

const styles = StyleSheet.create({
	graph: {},
});

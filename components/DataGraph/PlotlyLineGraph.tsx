import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import Plotly from "react-native-plotly";

type Props = {
	dimensions: {};
};

const PlotlyLineGraph: FC<Props> = (props) => {
	const { dimensions } = props;
	console.log(dimensions);
	const [thisHeight, setHeight] = useState();
	const [thisWidth, setWidth] = useState();

	useEffect(() => {
		setHeight(dimensions.height - 100);
		setWidth(dimensions.width - 100);
	}, [dimensions]);

	const data = [
		{
			x: [1, 2, 3, 4, 5],
			y: [1, 2, 3, 4, 8],
			type: "lines",
		},
		{
			x: [4, 7, 9, 9, 5],
			y: [1, 2, 4, 4, 1],
			type: "lines+markers",
		},
	];
	const layout = {
		title: "SkillStar",
		height: thisHeight,
		width: thisWidth,
	};

	return (
		<View
			style={{
				height: thisHeight,
				width: thisWidth,
				alignSelf: "center",
				paddingTop: 44,
			}}
		>
			<Plotly data={data} layout={layout} style={styles.graph} />
		</View>
	);
};

export default PlotlyLineGraph;

const styles = StyleSheet.create({
	graph: {},
});

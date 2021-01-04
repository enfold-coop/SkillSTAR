import React, { FC, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Plotly from "react-native-plotly";
import CustomColors from "../../styles/Colors";
import { store } from "../../context/ChainProvider";
import { FilterSessionsByType } from "../../_util/FilterSessionType";

type Props = {
	dimensions: {};
	modal: boolean;
};

/**
 * - get data from Context,
 * - sort session data by type,
 * - (PROBE) X: Session Number, Y: %mastery
 * - (training) X: Session Number, Y: %mastery,
 * - (challenging behavior) X: SessionNumber, Y: %chal.behav
 */

const PlotlyLineGraph: FC<Props> = (props) => {
	const { state } = useContext(store);
	const { userData } = state;
	const { dimensions, modal } = props;
	const [thisHeight, setHeight] = useState();
	const [thisWidth, setWidth] = useState();
	const [isModal, setIsModal] = useState(false);
	const [probeSessions, setProbeSessions] = useState([]);
	const [trainingSessions, setTrainingSessions] = useState([]);

	useEffect(() => {
		let { probeArr, trainingArr } = FilterSessionsByType(userData.sessions);
		setTrainingSessions(trainingArr);
		setProbeSessions(probeArr);
	}, []);

	const data = [
		{
			x: [1, 2, 33, 4, 5],
			y: [1, 2, 3, 44, 8],
			mode: "markers",
			name: "Probe Session",
			marker: {
				color: "rgb(164, 194, 244)",
				size: 12,
				line: {
					color: "white",
					width: 0.5,
				},
			},
		},
		{
			x: [4, 2, 44, 4, 5],
			y: [2, 3, 4, 5, 6],
			mode: "lines",
			name: "Training Session",
		},
		{
			x: [4, 2, 4, 4, 5],
			y: [1, 2, 3, 4, 5],
			mode: "lines",
			name: "Challenging Behavior",
		},
	];

	const layout = {
		title: "SkillStar",
		height: thisHeight,
		width: thisWidth,
		plot_bgcolor: CustomColors.uva.sky,
	};

	const setDimensions = () => {
		setHeight(dimensions.height - 100);
		setWidth(dimensions.width - 40);
	};

	useEffect(() => {
		setIsModal(modal);
		setDimensions();
	});

	return (
		<View style={[styles.container]}>
			<Plotly
				update={() => {}}
				data={data}
				layout={layout}
				enableFullPlotly={true}
			/>
		</View>
	);
};

export default PlotlyLineGraph;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "96%",
		justifyContent: "center",
		alignContent: "center",
	},
});

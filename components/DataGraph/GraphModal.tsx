import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Button } from "react-native-paper";
import LineGraph from "./LineGraph";
import CustomColors from "../../styles/Colors";
import { PlotlyLineGraph } from ".";

type Props = {
	visible: boolean;
	handleVis: Function;
};

const GraphModal: FC<Props> = (props) => {
	const { visible, handleVis } = props;
	const [graphDimens, setGraphDimens] = useState({});
	const [vis, setVisible] = useState(false);

	const handleIsVis = () => {
		setVisible(!vis);
		return handleVis();
	};

	useEffect(() => {
		setVisible(visible);
	}, [visible]);

	useEffect(() => {
		console.log("????");
	});

	return (
		<Modal
			visible={vis}
			animationType="slide"
			presentationStyle="fullScreen"
			// transparent={true}
		>
			<View
				style={styles.graphContainer}
				onLayout={(e) => {
					setGraphDimens(e.nativeEvent.layout);
				}}
			>
				{graphDimens.height && (
					<PlotlyLineGraph modal={true} dimensions={graphDimens} />
				)}
				<Button
					style={styles.closeBtn}
					labelStyle={{ fontSize: 16 }}
					color={CustomColors.uva.graySoft}
					mode="outlined"
					onPress={() => {
						setVisible(!vis);
						handleIsVis();
					}}
				>
					Close
				</Button>
			</View>
		</Modal>
	);
};

export default GraphModal;

const styles = StyleSheet.create({
	graphContainer: {
		flex: 1,
		padding: 20,
		justifyContent: "flex-start",
		alignContent: "center",
		backgroundColor: "rgba(0,0,0,0.9)",
	},
	closeBtn: {
		width: 200,
		alignSelf: "center",
	},
});

import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Button } from "react-native-paper";
import LineGraph from "./LineGraph";
import CustomColors from "../../styles/Colors";

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

	return (
		<Modal
			visible={vis}
			style={styles.container}
			animationType="slide"
			presentationStyle="overFullScreen"
			transparent={true}
		>
			<View></View>
			<View
				style={styles.graphContainer}
				onLayout={(e) => {
					setGraphDimens(e.nativeEvent.layout);
				}}
			>
				<LineGraph dimensions={graphDimens} />
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
	container: {},
	graphContainer: {
		flex: 1,
		padding: 100,
		paddingTop: 200,
		justifyContent: "center",
		alignContent: "center",
		backgroundColor: "rgba(0,0,0,0.9)",
	},
	closeBtn: {
		width: 200,
		alignSelf: "center",
	},
});

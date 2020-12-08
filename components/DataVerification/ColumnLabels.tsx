import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomColors from "../../styles/Colors";

const ColumnLabels = () => {
	return (
		<View style={styles.container}>
			<Text style={[styles.mastery, styles.text]}>Mastery</Text>
			<Text style={[styles.step, styles.text]}>Step</Text>
			<Text style={[styles.promptLevel, styles.text]}>Prompt</Text>
			<Text style={[styles.completed, styles.text]}>Task Completed?</Text>
			<Text style={[styles.challBehav, styles.text]}>
				Challenging Behavior?
			</Text>
		</View>
	);
};

export default ColumnLabels;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-between",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		margin: 5,
		marginLeft: 30,
		marginRight: 30,
		borderColor: CustomColors.uva.sky,
		backgroundColor: CustomColors.uva.sky,
	},
	text: {
		fontSize: 16,
		// transform: [{ rotate: "-33deg" }],
	},
	mastery: {
		width: "10%",
		flexDirection: "column",
	},
	step: {
		width: "25%",
	},
	promptLevel: {
		width: "10%",
	},
	completed: {
		width: "20%",
	},
	challBehav: {
		width: "20%",
	},
});

import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ToggleButtons from "../GlobalComponents/ToggleButtons";
import CustomColors from "../../styles/Colors";
import ListItemSwitch from "./ListItemSwitch";
import DataItemCheckBox from "./DataItemCheckBox";

type Props = {
	instruction: string;
	stepAttempt: {};
};

export const DataVerificationListItem: FC<Props> = (props) => {
	const { instruction, stepAttempt } = props;

	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>Step: "{instruction}"</Text>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Was the task Completed?</Text>
				<ListItemSwitch instruction={instruction} />
			</View>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Challenging Behavior?</Text>
				<ListItemSwitch instruction={instruction} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 5,
		borderColor: CustomColors.uva.sky,
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		margin: 5,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: "rgba(255,255,255,0.5)",
	},
	questionContainer: {
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-around",
		margin: 10,
		marginBottom: 20,
	},
	question: {
		fontSize: 30,
		fontWeight: "400",
		textAlign: "center",
		alignSelf: "center",
	},
	stepTitle: {
		fontSize: 24,
		fontWeight: "600",
		paddingBottom: 10,
	},
	btnContainer: {
		justifyContent: "center",
		flexDirection: "row",
	},
	yesNoBtn: {
		width: 144,
		margin: 5,
		marginLeft: 20,
		marginRight: 20,
	},
});

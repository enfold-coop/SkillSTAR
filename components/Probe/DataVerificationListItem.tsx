import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ToggleButtons from "../GlobalComponents/ToggleButtons";
import CustomColors from "../../styles/Colors";
import ListItemSwitch from "./ListItemSwitch";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";

type Props = {
	stepAttempt: StepAttempt;
};

export const DataVerificationListItem: FC<Props> = (props) => {
	const QUESTION_TYPES = {
		completion: 0,
		challBehav: 1,
	};
	/**
	 * use context api, here:
	 */
	const stepId = props.stepAttempt.chain_step_id;
	const instruction = props.stepAttempt.chain_step ? props.stepAttempt.chain_step.instruction : 'LOADING';

	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>
				Step #{stepId}: "{instruction}"
			</Text>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Was the task Completed?</Text>
				<ListItemSwitch
					instruction={instruction}
					type={QUESTION_TYPES.completion}
					defaultValue={true}
					id={stepId}
				/>
			</View>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Challenging Behavior?</Text>
				<ListItemSwitch
					instruction={instruction}
					type={QUESTION_TYPES.challBehav}
					defaultValue={false}
					id={stepId}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 300,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: CustomColors.uva.sky,
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 10,
		paddingLeft: 20,
		margin: 5,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: CustomColors.uva.sky,
	},
	questionContainer: {
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-between",
		margin: 10,
		marginBottom: 10,
	},
	question: {
		fontSize: 24,
		fontWeight: "400",
		width: 300,
		alignSelf: "center",
		color: "#000",
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

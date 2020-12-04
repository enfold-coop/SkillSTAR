import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomColors from "../../styles/Colors";
import { DataVerifSwitch, DataVerifAccordion } from ".";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import { Accordion } from "react-native-paper/lib/typescript/src/components/List/List";

type Props = {
	stepAttempt: StepAttempt;
};

const DataVerifItem: FC<Props> = ({ stepAttempt }) => {
	const QUESTION_TYPES = {
		completion: 0,
		challBehav: 1,
	};

	/**
	 * use context api, here:
	 */
	const { stepId, instruction } = stepAttempt;

	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>
				Step #{stepId}: "{instruction}"
			</Text>
			<View style={styles.questionContainer}>
				<View style={styles.questionSubContainer}>
					<Text style={styles.question}>Was the task Completed?</Text>
					<DataVerifSwitch
						instruction={instruction}
						type={QUESTION_TYPES.completion}
						id={stepId}
					/>
				</View>
			</View>
			<View style={styles.questionContainer}>
				<View style={styles.questionSubContainer}>
					<Text style={styles.question}>Challenging Behavior?</Text>
					<DataVerifSwitch
						instruction={instruction}
						type={QUESTION_TYPES.challBehav}
						id={stepId}
					/>
				</View>
			</View>
		</View>
	);
};

export default DataVerifItem;

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: CustomColors.uva.sky,
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		margin: 5,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: CustomColors.uva.sky,
	},
	questionContainer: {
		flexDirection: "column",
		margin: 10,
		marginBottom: 10,
	},
	questionSubContainer: {
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-around",
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
	accordion: {
		backgroundColor: "#f0f",
		width: 200,
		height: 200,
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

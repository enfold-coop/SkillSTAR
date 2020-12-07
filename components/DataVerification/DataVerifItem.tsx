import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomColors from "../../styles/Colors";
import { DataVerifSwitch } from ".";
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
			<View style={styles.defaultFormContainer}>
				<Text style={styles.masteryIcon}>{"M L Here"}</Text>
				<Text style={styles.stepTitle}>"{instruction}"</Text>
				<Text style={styles.promptLevel}>{"PromptLvevevevevl"}</Text>
				<View style={styles.questionContainer}>
					<DataVerifSwitch
						instruction={instruction}
						type={QUESTION_TYPES.completion}
						id={stepId}
					/>
				</View>
				<View style={styles.questionContainer}>
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
		padding: 10,
		margin: 5,
		marginLeft: 30,
		marginRight: 30,
		borderColor: CustomColors.uva.sky,
		backgroundColor: CustomColors.uva.sky,
	},
	defaultFormContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
	},
	masteryIcon: {
		width: "10%",
		alignSelf: "center",
	},
	promptLevel: {
		width: "10%",
		alignSelf: "center",
	},
	stepTitle: {
		width: "25%",
		alignSelf: "center",
		fontSize: 20,
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

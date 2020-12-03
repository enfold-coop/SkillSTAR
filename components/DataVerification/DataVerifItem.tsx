import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomColors from "../../styles/Colors";
import { DataVerifSwitch, DataVerifAccordion } from ".";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import { Accordion } from "react-native-paper/lib/typescript/src/components/List/List";

const MOCK_PROMPT_OPTS = [
	"No Prompt (Independent)",
	"Shadow Prompt (approximately one inch)",
	"Partial Physical Prompt (thumb and index finger)",
	"Full Physical Prompt (hand-over-hand)",
];

const MOCK_BEHAV_OPTS = [
	"Mild (did not interfere with task)",
	"Moderate (interfered with task, but we were able to work through it)",
	"Severe (we were not able to complete the task due to the severity of the behavior)",
];

const MOCK_PROMP_Q = "What prompt did you use to complete the step?";
const MOCK_BEHAV_Q = "How severe was the challenging behavior?";

type Props = {
	stepAttempt: StepAttempt;
};

const DataVerifItem: FC<Props> = ({ stepAttempt }) => {
	const QUESTION_TYPES = {
		completion: 0,
		challBehav: 1,
	};

	const [behavSelected, setBehaveSelected] = useState(false);
	const [completed, setCompleted] = useState(false);

	const handleSwitchVal = (v: boolean) => {
		return v;
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
						defaultValue={true}
						id={stepId}
						handleSwitchVal={handleSwitchVal}
					/>
				</View>
				{completed && (
					<DataVerifAccordion
						question={MOCK_PROMP_Q}
						answerOptions={MOCK_PROMPT_OPTS}
					/>
				)}
			</View>
			<View style={styles.questionContainer}>
				<View style={styles.questionSubContainer}>
					<Text style={styles.question}>Challenging Behavior?</Text>
					<DataVerifSwitch
						instruction={instruction}
						type={QUESTION_TYPES.challBehav}
						defaultValue={false}
						id={stepId}
						handleSwitchVal={handleSwitchVal}
					/>
				</View>
				{behavSelected && (
					<DataVerifAccordion
						question={MOCK_BEHAV_Q}
						answerOptions={MOCK_BEHAV_OPTS}
					/>
				)}
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

import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import CustomColors from "../../styles/Colors";
import {
	BehavDataVerifSwitch,
	PromptDataVerifSwitch,
	BehavAccordion,
	PromptAccordion,
} from ".";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
// import { MasteryIcons } from "../../styles/MasteryIcons";

const MasteryIcons = (level: string) => {
	const icons = {
		mastered: require("../../assets/icons/ribbon-icon.png"),
		focus: require("../../assets/icons/in-process-icon.png"),
		notStarted: require("../../assets/icons/waving-icon.png"),
	};
	return icons[`${level}`];
};

type Props = {
	stepAttempt: StepAttempt;
};

const DataVerifItem: FC<Props> = ({ stepAttempt }) => {
	/**
	 * use context api, here:
	 */
	const { stepId, instruction } = stepAttempt;
	const [promptSwitch, setPromptSwitch] = useState(false);
	const [behavSwitch, setBehavSwitch] = useState(false);
	const [icon, setIcon] = useState(MasteryIcons("mastered"));

	const handlePromptSwitch = (v: boolean) => {
		setPromptSwitch(!promptSwitch);
	};
	const handleBehavSwitch = (v: boolean) => {
		setBehavSwitch(!behavSwitch);
	};

	return (
		<View style={styles.container}>
			<View style={styles.defaultFormContainer}>
				<Image
					style={styles.masteryIcon}
					source={icon}
					resizeMode="contain"
				/>

				<Text style={styles.stepTitle}>"{instruction}"</Text>
				<Text style={styles.promptLevel}>{"[...]"}</Text>
				<View style={styles.questionContainer}>
					<PromptDataVerifSwitch
						instruction={instruction}
						id={stepId}
						handleSwitch={handlePromptSwitch}
					/>
				</View>
				<View style={styles.questionContainer}>
					<BehavDataVerifSwitch
						instruction={instruction}
						id={stepId}
						handleSwitch={handleBehavSwitch}
					/>
				</View>
			</View>
			<View style={styles.accordionContainer}>
				<PromptAccordion
					switched={promptSwitch}
					stepAttempt={stepAttempt}
				/>
				<BehavAccordion
					switched={behavSwitch}
					stepAttempt={stepAttempt}
				/>
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
		justifyContent: "space-evenly",
		alignContent: "center",
	},
	accordionContainer: {},
	masteryIcon: {
		width: 50,
		height: 50,
		alignSelf: "center",
		borderRadius: 14,
		borderWidth: 0,
	},
	promptLevel: {
		width: "5%",
		alignSelf: "center",
	},
	stepTitle: {
		width: "40%",
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

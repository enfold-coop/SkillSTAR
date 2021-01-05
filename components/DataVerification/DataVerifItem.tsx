import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-paper";
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

const PromptIcons = (level: string) => {
	const icons = {
		ip: require("../../assets/icons/ip_prompt_icon.png"),
		sp: require("../../assets/icons/sp_prompt_icon.png"),
		pp: require("../../assets/icons/pp_prompt_icon.png"),
		fp: require("../../assets/icons/fp_prompt_icon.png"),
	};

	// return icons[`${level}`];
	// return
};

type Props = {
	stepAttempt: StepAttempt;
};

const DataVerifItem: FC<Props> = ({ stepAttempt }) => {
	/**
	 * use context api, here:
	 */

	const { stepId, instruction, promptLevel } = stepAttempt;

	const [promptSwitch, setPromptSwitch] = useState(false);
	const [behavSwitch, setBehavSwitch] = useState(false);
	const [icon, setIcon] = useState();
	const [promptIcon, setPromptIcon] = useState();

	const handlePromptSwitch = (v: boolean) => {
		setPromptSwitch(!promptSwitch);
	};
	const handleBehavSwitch = (v: boolean) => {
		setBehavSwitch(!behavSwitch);
	};

	const focusStepIcon = () => {
		if (stepId == 3) {
			setIcon(MasteryIcons("focus"));
		} else if (stepId < 3) {
			setIcon(MasteryIcons("mastered"));
		} else {
			setIcon(MasteryIcons("notStarted"));
		}
	};
	const promptLevelIcon = () => {
		if (promptLevel === 4) {
			setPromptIcon(PromptIcons("sp"));
		} else if (promptLevel === 3) {
			setPromptIcon(PromptIcons("sp"));
		} else if (promptLevel === 2) {
			setPromptIcon(PromptIcons("pp"));
		} else {
			setPromptIcon(PromptIcons("fp"));
		}
	};

	useEffect(() => {
		focusStepIcon();
	}, [stepId]);
	useEffect(() => {
		promptLevelIcon();
	}, [promptLevel]);

	return (
		<View style={styles.container}>
			<View style={styles.defaultFormContainer}>
				<Image
					style={styles.masteryIcon}
					source={icon}
					resizeMode="contain"
				/>

				<Text style={styles.stepTitle}>"{instruction}"</Text>
				<Text style={styles.promptLevelIcon}>{"FP"}</Text>
				{/* <Image
					style={styles.promptLevelIcon}
					source={promptIcon}
					resizeMode="contain"
				/> */}
				<View style={styles.switchContainer}>
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
		justifyContent: "space-between",
		alignContent: "center",
	},
	accordionContainer: {},
	masteryIcon: {
		width: 40,
		height: 40,
		alignSelf: "center",
		borderRadius: 14,
		borderWidth: 0,
	},
	promptLevelIcon: {
		// width: 30,
		// height: 30,
		fontSize: 20,
		fontWeight: "800",
		borderRadius: 5,
		borderWidth: 2,
		borderColor: CustomColors.uva.gray,
		color: CustomColors.uva.gray,
		padding: 5,
		textAlign: "center",
		alignSelf: "center",
	},
	stepTitle: {
		width: "30%",
		alignSelf: "center",
		fontSize: 20,
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
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
	nextBtnContainer: {},
});

import React from "react";
import { StyleSheet, View } from "react-native";
import CustomColor from "../styles/Colors";
import { MasteryStatus } from "../types/CHAIN/MasteryLevel";
import {ChainStepStatus} from '../types/CHAIN/StepAttempt';
import { SkillStarIcons } from "./Icons";

export function MasteryIcons(mastery: ChainStepStatus = ChainStepStatus.not_complete) {
	const index = mastery.valueOf();
	const icons: { [key: string]: MasteryStatus } = {
		not_complete: {
			stepStatus: ChainStepStatus.not_complete,
			label: "Not Started",
			icon: "not_started",
			color: CustomColor.uva.gray,
		},
		focus: {
			stepStatus: ChainStepStatus.focus,
			label: "Focus Step",
			icon: "not_mastered",
			color: CustomColor.uva.mountain,
		},
		mastered: {
			stepStatus: ChainStepStatus.mastered,
			label: "Mastered",
			icon: "mastered",
			color: CustomColor.uva.mountain,
		},
	};

	return (
		<View style={styles.icon}>
			<SkillStarIcons
				name={icons[index].icon}
				size={30}
				style={styles.icon}
				color={icons[index].color}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	icon: {
		paddingLeft: 5,
	},
});

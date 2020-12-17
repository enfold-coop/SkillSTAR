// import {MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomColor from "../styles/Colors";
import { MasteryLevel, MasteryStatus } from "../types/CHAIN/MasteryLevel";
import { SkillStarIcons, Icons } from "./Icons";

export function MasteryIcons(mastery: MasteryLevel = MasteryLevel.NotStarted) {
	const index = mastery.valueOf();
	const icons: { [key: number]: MasteryStatus } = {
		0: {
			level: MasteryLevel.NotStarted,
			label: "Not Started",
			icon: "not_started",
			color: CustomColor.uva.gray,
		},
		1: {
			level: MasteryLevel.NotMastered,
			label: "Not Mastered",
			icon: "not_mastered",
			color: CustomColor.uva.mountain,
		},
		2: {
			level: MasteryLevel.Mastered,
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

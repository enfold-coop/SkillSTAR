import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import CustomColor from "../styles/Colors";

export function MasteryIcons(mastery: number) {
	let iconName, color;
	if (mastery === 0) {
		iconName = "star";
		color = CustomColor.uva.mountain;
	} else if (mastery === 1) {
		iconName = "grin-stars";
		color = CustomColor.uva.mountain;
	} else if (mastery === 2) {
		iconName = "star-half-alt";
		color = CustomColor.uva.mountain;
	} else {
		iconName = "star-half-alt";
	}
	return (
		<View style={styles.icon}>
			<FontAwesome5
				name={iconName}
				size={30}
				style={styles.icon}
				color={color}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	icon: {
		paddingLeft: 5,
	},
});

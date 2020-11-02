import React from "react";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

export function MasteryIcons(mastery: number) {
	let iconName;
	if (mastery === 0) {
		iconName = "star-half-alt";
	} else if (mastery === 1) {
		iconName = "grin-stars";
	} else if (mastery === 2) {
		iconName = "star";
	} else {
		iconName = "star";
	}
	return <FontAwesome5 name={iconName} size={24} color="black" />;
}

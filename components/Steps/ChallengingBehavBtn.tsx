import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomColors from "../../styles/Colors";
import { SvgUri } from "react-native-svg";

// import

type Props = {};

const ChallengingBehavBtn: FC<Props> = (props) => {
	const flagIcon = require("../../assets/icons/CB_flag_icon_v3.png");
	return (
		<View style={styles.container}>
			<TouchableOpacity>
				{/* <SvgUri width="100%" height="100%" uri={flagIcon} /> */}
				<Image source={flagIcon} style={styles.img} />
			</TouchableOpacity>
			<Text style={styles.difficultyParagraph}>
				Click on this icon anytime your child is having difficulty or
				experiening challenging behavior.
			</Text>
		</View>
	);
};

export default ChallengingBehavBtn;

const styles = StyleSheet.create({
	container: {
		width: "44%",
		paddingBottom: 0,
		flexDirection: "row",
		justifyContent: "space-around",
		alignContent: "center",
	},
	difficultyParagraph: {
		width: "70%",
		padding: 0,
		paddingLeft: 0,
		fontWeight: "600",
		alignSelf: "center",
	},
	img: {
		height: 60,
		width: 60,
		alignSelf: "center",
		color: CustomColors.uva.magenta75Soft,
		resizeMode: "contain",
		// margin: 10,
	},
});

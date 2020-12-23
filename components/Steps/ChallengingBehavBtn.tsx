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
			<View style={styles.iconContainer}>
				<TouchableOpacity>
					{/* <SvgUri width="100%" height="100%" uri={flagIcon} /> */}
					<Image source={flagIcon} style={styles.img} />
				</TouchableOpacity>
			</View>
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
		paddingRight: 20,
		paddingBottom: 0,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "flex-end",
	},
	iconContainer: {
		padding: 10,
		// backgroundColor: CustomColors.uva.grayMedium,
		borderRadius: 5,
	},
	difficultyParagraph: {
		width: "60%",
		padding: 0,
		paddingLeft: 10,
		fontWeight: "600",
		alignSelf: "center",
		fontSize: 12,
		fontStyle: "italic",
	},
	img: {
		height: 40,
		width: 40,
		alignSelf: "center",
		// color: CustomColors.uva.magenta75Soft,
		resizeMode: "contain",
	},
});

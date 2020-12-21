import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { MasteryIcons } from "../../styles/MasteryIcons";

const MasteryIconContainer = () => {
	const masteredIcon = require("../../assets/icons/ribbon-icon.png");
	return (
		<View style={styles.container}>
			<Image style={styles.img} source={masteredIcon} />
		</View>
	);
};

export default MasteryIconContainer;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignContent: "center",
		paddingBottom: 10,
	},
	img: {
		height: 50,
		width: 50,
		resizeMode: "contain",
	},
});

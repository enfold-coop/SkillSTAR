import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StepAttemptStars } from "./index";
import CustomColors from "../../styles/Colors";

type Props = {};

const StarsNIconsContainer = () => {
	return (
		<View style={styles.container}>
			<Text></Text>
			<StepAttemptStars />
		</View>
	);
};

export default StarsNIconsContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: CustomColors.uva.gray,
	},
});

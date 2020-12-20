import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CustomColors from "../../styles/Colors";

type Props = {};

const StepAttemptStars = () => {
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}></View>
			<AntDesign
				name="star"
				size={50}
				color={CustomColors.uva.yellow}
				style={styles.star}
			/>
		</View>
	);
};

export default StepAttemptStars;

const styles = StyleSheet.create({
	container: {},
	subContainer: {},
	starContainer: {},
	star: {},
});

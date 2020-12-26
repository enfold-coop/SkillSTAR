import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
	StepAttemptStars,
	ChallengingBehavBtn,
	MasteryIconContainer,
} from "./index";
import CustomColors from "../../styles/Colors";

type Props = {};

const StarsNIconsContainer: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			{/* <MasteryIconContainer /> */}
			<View style={styles.subContainer}>
				<StepAttemptStars promptType={"FP"} attemptsWPromptType={1} />
				<ChallengingBehavBtn />
			</View>
		</View>
	);
};

export default StarsNIconsContainer;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "column",
		justifyContent: "space-between",
		alignContent: "center",
		margin: 10,
		marginBottom: 0,
		padding: 10,
		paddingBottom: 0,
	},
	subContainer: {
		width: "100%",
		alignSelf: "flex-start",
		flexDirection: "row",
		justifyContent: "space-between",
	},
});

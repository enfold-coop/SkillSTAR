import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProgressBar as ProgBar } from "react-native-paper";
import CustomColors from "../../styles/Colors";

type Props = {
	masteryLevel: string;
	currStep: number;
	totalSteps: number;
};

const ProgressBar: FC<Props> = (props) => {
	const { totalSteps, currStep, masteryLevel } = props;
	const [mastery, setMastery] = useState("focus");
	const [barColor, setBarColor] = useState(CustomColors.uva.magenta);

	// Convert progress to "0.1 - 1.0" value
	const progressBarCalculation = (len: number, currStep: number): number => {
		return currStep / len;
	};

	const getMasteryLevel = () => {
		if (mastery === "mastered") {
			setBarColor(CustomColors.uva.cyan);
		} else if (mastery === "focus") {
			setBarColor(CustomColors.uva.magenta);
		} else {
			setBarColor(CustomColors.uva.gray);
		}
	};

	useEffect(() => {}, [currStep]);

	useEffect(() => {
		setMastery(masteryLevel);
		getMasteryLevel();
	}, [masteryLevel]);

	return (
		<View>
			<ProgBar
				style={styles.progressBar}
				progress={progressBarCalculation(totalSteps, currStep)}
				color={barColor}
			/>
		</View>
	);
};

export default ProgressBar;

const styles = StyleSheet.create({
	progressBar: {
		width: 200,
		height: 40,
		borderWidth: 0,
		borderRadius: 5,
	},
});

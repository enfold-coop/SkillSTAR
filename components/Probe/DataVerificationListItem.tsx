import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ToggleButton } from "react-native-paper";
import CustomColors from "../../styles/Colors";
import ToggleButtons from "../GlobalComponents/ToggleButtons";

type Props = {
	instruction: string;
	stepAttempt: {};
};

export const DataVerificationListItem: FC<Props> = (props) => {
	const { instruction, stepAttempt } = props;
	const [activeBtn, setActiveBtn] = useState(false);
	const [value, setValue] = React.useState("left");
	/**
	 * - toggle active color of buttons
	 * -
	 */

	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>{instruction}</Text>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Task Completed?</Text>
				<View style={styles.btnContainer}>
					<ToggleButtons btnStyle={styles.yesNoBtn} />
				</View>
			</View>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Challenging Behavior?</Text>
				<View style={styles.btnContainer}>
					<ToggleButtons btnStyle={styles.yesNoBtn} />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 5,
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		margin: 5,
		marginLeft: 20,
		marginRight: 20,
		backgroundColor: "rgba(255,255,255,0.3)",
	},
	questionContainer: {
		justifyContent: "center",
		margin: 10,
		marginBottom: 20,
	},
	question: {
		fontSize: 20,
		fontWeight: "400",
		paddingBottom: 10,
		textAlign: "center",
	},
	stepTitle: {
		fontSize: 24,
		fontWeight: "600",
		paddingBottom: 10,
	},
	btnContainer: {
		justifyContent: "center",
		flexDirection: "row",
	},
	yesNoBtn: {
		width: 144,
		margin: 5,
		marginLeft: 20,
		marginRight: 20,
	},
});

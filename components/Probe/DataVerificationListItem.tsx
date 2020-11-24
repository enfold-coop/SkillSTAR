import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ToggleButtons from "../GlobalComponents/ToggleButtons";
import CustomColors from "../../styles/Colors";
import ListItemSwitch from "./ListItemSwitch";

type Props = {
	instruction: string;
	stepAttempt: {};
};

export const DataVerificationListItem: FC<Props> = (props) => {
	const { instruction, stepAttempt } = props;
	let [instruct, setInstruction] = useState(instruction);

	/**
	 * - toggle active color of buttons
	 */

	useEffect(() => {}, [instruction]);

	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>Step: "{instruction}"</Text>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Was the task Completed?</Text>
				{/* <View style={styles.btnContainer}> */}
				<ListItemSwitch instruction={instruction} />
				{/* <ToggleButtons
						btnStyle={styles.yesNoBtn}
						stepTitle={instruction}
					/> */}
				{/* </View> */}
			</View>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Challenging Behavior?</Text>
				<ListItemSwitch instruction={instruction} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 5,
		borderColor: CustomColors.uva.sky,
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		margin: 5,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: "rgba(255,255,255,0.5)",
	},
	questionContainer: {
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-around",
		margin: 10,
		marginBottom: 20,
	},
	question: {
		fontSize: 30,
		fontWeight: "400",
		textAlign: "center",
		alignSelf: "center",
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

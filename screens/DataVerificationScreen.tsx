import React, { useState, useEffect, ReactNode } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import { Session } from "../types/CHAIN/Session";
import CustomColors from "../styles/Colors";
import AppHeader from "../components/Header/AppHeader";
import DataVerificationList from "../components/Probe/DataVerificationList";
import { DataVerificationListItem } from "../components/Probe/index";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import { chainSteps } from "../data/chainSteps";

type Props = {
	session: [];
};

/**
 *
 */
function DataVerificationScreen({ session }: Props): ReactNode {
	console.log(session);

	const navigation = useNavigation();
	let [stepIndex, setStepIndex] = useState(0);
	let [readyToSubmit, setReadyToSubmit] = useState(false);
	let [sessionData, setSessionData] = useState();
	let [text, setText] = useState("");

	// const createAttempts = () => {
	// 	chainSteps.forEach((e, i) => {
	// 		let { stepId, instruction } = chainSteps[i];
	// 		session.addStepData(new StepAttempt(stepId, instruction));
	// 	});
	// };

	/** START: Lifecycle calls */
	useEffect(() => {
		setSessionData(session);
		console.log("USE EFFECT!");
	}, []);
	/** END: Lifecycle calls */

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<AppHeader name="Brushing Teeth" />
				<View style={styles.instructionContainer}>
					<Text style={styles.screenHeader}>Probe Session</Text>
					<Text style={styles.instruction}>
						Please instruct the child to brush their teeth. As they
						do, please complete this survey for each step.
					</Text>
				</View>
				<View style={styles.formContainer}>
					<DataVerificationList session={sessionData.data} />
				</View>

				{readyToSubmit && (
					<Button
						mode="contained"
						onPress={() => {
							navigation.navigate("ChainsHomeScreen");
						}}
					>
						Submit
					</Button>
				)}
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	instructionContainer: {
		margin: 20,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	screenHeader: {
		marginTop: 20,
		paddingBottom: 20,
		fontSize: 22,
		fontWeight: "600",
	},
	instruction: {
		padding: 10,
		fontSize: 22,
	},
	formContainer: {},
	formItemContainer: {},
	formItemLabel: {},
	btnContainer: {},
	formItemButton: {},
	nextBackBtnsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 100,
		marginRight: 20,
	},
	nextButton: {
		width: 144,
		margin: 15,
	},
	backButton: {
		width: 144,
		margin: 15,
	},
	inputField: {},
});

export default DataVerificationScreen;

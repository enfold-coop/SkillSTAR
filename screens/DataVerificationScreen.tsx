import React, { useState, useEffect, ReactNode } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import { Session } from "../types/CHAIN/Session";
import CustomColors from "../styles/Colors";
import AppHeader from "../components/Header/AppHeader";
import { DataVerifList } from "../components/DataVerification/";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import { chainSteps } from "../data/chainSteps";
// MOCK IMPORT:
import { createSesh } from "../components/DataVerification/mock_session";

type Props = {
	session: [];
};

/**
 *
 */
function DataVerificationScreen({ session }: Props): ReactNode {
	const navigation = useNavigation();
	let [stepIndex, setStepIndex] = useState(0);
	let [readyToSubmit, setReadyToSubmit] = useState(false);
	// let [sessionData, setSessionData] = useState(); <--COMMENTED OUT TIL DATA IMPORTED
	let sessionData: StepAttempt[];
	let [text, setText] = useState("");
	let mockSesh;

	/**
	 * BEGIN: MOCK
	 */
	if (session == undefined) {
		mockSesh = createSesh();
		sessionData = mockSesh.data;
	}
	/**
	 * BEGIN: MOCK
	 */

	/** START: Lifecycle calls */
	// useEffect(() => {
	// 	setSessionData(session);
	// }, []);
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
					<DataVerifList session={sessionData} />
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

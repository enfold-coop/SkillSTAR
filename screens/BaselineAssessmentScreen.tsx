import React, { useState, useEffect, ReactNode } from "react";
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Dimensions,
} from "react-native";
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
	route: RootNavProps<"BaselineAssessmentScreen">;
	navigation: RootNavProps<"BaselineAssessmentScreen">;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

/**
 *
 */
function BaselineAssessmentScreen({ route }: Props): ReactNode {
	/**
	 * Set session type: Probe or Training
	 */
	const navigation = useNavigation();
	let [stepIndex, setStepIndex] = useState(0);
	let [readyToSubmit, setReadyToSubmit] = useState(false);
	let [sessionReady, setSessionReady] = useState(false);
	let [session, setSession] = useState(new Session());
	let [text, setText] = useState("");

	const createAttempts = () => {
		chainSteps.forEach((e, i) => {
			let { stepId, instruction } = chainSteps[i];
			session.addStepData(new StepAttempt(stepId, instruction));
		});
		setSessionReady(true);
	};

	/** START: Lifecycle calls */
	useEffect(() => {
		if (!session.data.length) {
			createAttempts();
		} else {
		}
	}, []);
	/** END: Lifecycle calls */

	const incrIndex = () => {
		stepIndex += 1;
		setStepIndex(stepIndex);
	};

	const decIndex = () => {
		if (stepIndex > 0) {
			stepIndex -= 1;
			setStepIndex(stepIndex);
		}
	};

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			{sessionReady && (
				<View style={styles.container}>
					<AppHeader name="Brushing Teeth" />
					<View style={styles.instructionContainer}>
						<Text style={styles.screenHeader}>Probe Session</Text>
						<Text style={styles.instruction}>
							Please instruct the child to brush their teeth. As
							they do, please complete this survey for each step.
						</Text>
					</View>
					<View style={styles.formContainer}>
						{<DataVerificationList session={session.data} />}
					</View>

					<View style={styles.nextBackBtnsContainer}>
						<Button
							style={styles.nextButton}
							color={CustomColors.uva.blue}
							mode="contained"
							onPress={() => {
								if (stepIndex + 1 <= chainSteps.length - 1) {
									incrIndex();
								} else {
									setReadyToSubmit(true);
								}
							}}
						>
							NEXT
						</Button>
					</View>
				</View>
			)}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	instructionContainer: {
		marginLeft: 40,
		marginRight: 40,
		margin: 10,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	screenHeader: {
		marginLeft: 10,
		marginTop: 0,
		paddingBottom: 10,
		fontSize: 22,
		fontWeight: "600",
	},
	instruction: {
		paddingLeft: 10,
		paddingRight: 10,
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

export default BaselineAssessmentScreen;

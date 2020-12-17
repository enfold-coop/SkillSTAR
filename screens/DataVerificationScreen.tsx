import React, { useState, useEffect, ReactNode } from "react";
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
} from "react-native";
import ColumnLabels from "../components/DataVerification/ColumnLabels";
import * as Animatable from "react-native-animatable";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomColors from "../styles/Colors";
import { OnSubmitModal } from "../components/GlobalComponents/";
import ChallengingBehavModal from "../components/ChallengingBehavior/ChallengingBehavModal";
import AppHeader from "../components/Header/AppHeader";
import { DataVerifItem } from "../components/DataVerification/";
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
	let [confirmSubmit, setConfirmSubmit] = useState(false);
	let [sessionData, setSessionData] = useState();
	let [scrolling, setScrolling] = useState(false);

	let mockSesh;

	// Called on 2nd press of Submit button
	const submitAndNavigate = () => {
		setConfirmSubmit(false);
		postData();
		navigation.navigate("ChainsHomeScreen");
	};

	// Post state data to API
	const postData = () => {
		console.log("POSTING DATA");
	};

	/**
	 * BEGIN: MOCK
	 */
	useEffect(() => {
		if (session == undefined) {
			mockSesh = createSesh();
			setSessionData(mockSesh.data);
		}
	}, []);
	/**
	 * END: MOCK
	 */

	/** START: Lifecycle calls */
	// useEffect(() => {
	// 	setSessionData(session);
	// }, []);
	/** END: Lifecycle calls */

	return (
		<View style={styles.container}>
			<AppHeader name="Brushing Teeth" />
			<View style={styles.instructionContainer}>
				<Text
					style={[
						scrolling ? styles.smallHeader : styles.screenHeader,
					]}
				>
					Probe Session
				</Text>
				<Animatable.Text
					transition="fontSize"
					duration={1000}
					style={[
						scrolling
							? styles.smallInstruction
							: styles.instruction,
					]}
				>
					Please instruct the child to brush their teeth. As they do,
					please complete this survey for each step.
				</Animatable.Text>
			</View>
			<View style={styles.formContainer}>
				<ColumnLabels />
				{sessionData && (
					<FlatList
						onScrollBeginDrag={() => {
							setScrolling(true);
							setReadyToSubmit(true);
						}}
						data={sessionData}
						renderItem={(item) => {
							return <DataVerifItem stepAttempt={item.item} />;
						}}
						keyExtractor={() => nanoid()}
					/>
				)}
			</View>

			{readyToSubmit && (
				<View style={styles.btnContainer}>
					<Text style={styles.btnContainerText}>
						Please confirm your selections, then press Submit.
					</Text>
					<Button
						mode="contained"
						color={CustomColors.uva.orange}
						labelStyle={{
							fontSize: 16,
							fontWeight: "600",
							color: CustomColors.uva.blue,
						}}
						style={styles.nextButton}
						onPress={() => {
							if (confirmSubmit) {
								submitAndNavigate();
							} else {
								setConfirmSubmit(true);
							}
						}}
					>
						{confirmSubmit ? "Confirm and Submit" : "Submit"}
					</Button>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		marginBottom: 100,
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
	smallinstructionContainer: {
		margin: 20,
		marginBottom: 1,
		marginTop: 1,
		fontSize: 16,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	screenHeader: {
		marginTop: 20,
		paddingBottom: 20,
		fontSize: 22,
		fontWeight: "600",
	},
	smallHeader: {
		display: "none",
	},

	instruction: {
		padding: 40,
		paddingBottom: 10,
		paddingTop: 10,
		fontSize: 22,
	},
	smallInstruction: {
		padding: 20,
		paddingBottom: 5,
		paddingTop: 5,
		fontSize: 18,
	},
	formContainer: {
		height: "80%",
	},
	formItemContainer: {},
	formItemLabel: {},
	btnContainer: {},
	formItemButton: {},
	nextBackBtnsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 100,
		marginRight: 20,
		marginTop: 100,
	},
	btnContainerText: {
		display: "none",
		fontSize: 18,
		textAlign: "center",
		padding: 10,
	},
	nextButton: {
		width: "90%",
		height: 50,
		margin: 10,
		justifyContent: "center",
		alignSelf: "center",
		fontWeight: "600",
	},
});

export default DataVerificationScreen;

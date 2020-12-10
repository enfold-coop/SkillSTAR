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
	let [readyToSubmit, setReadyToSubmit] = useState(true);
	let [sessionData, setSessionData] = useState();
	let [scrolling, setScrolling] = useState(false);
	let [text, setText] = useState("");
	let mockSesh;

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
		// <ImageBackground
		// 	source={require("../assets/images/sunrise-muted.png")}
		// 	resizeMode={"cover"}
		// 	style={styles.image}
		// >
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
						color={CustomColors.uva.redSoft}
						labelStyle={{ fontSize: 16, fontWeight: "600" }}
						style={styles.nextButton}
						onPress={() => {
							navigation.navigate("ChainsHomeScreen");
						}}
					>
						Submit
					</Button>
				</View>
			)}
		</View>
		// </ImageBackground>
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
		backgroundColor: "#f0f",
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
		fontSize: 18,
		textAlign: "center",
	},
	nextButton: {
		width: "90%",
		height: 50,
		margin: 10,
		justifyContent: "center",
		alignSelf: "center",
		fontWeight: "600",
	},
	backButton: {
		flex: 1,
		width: 144,
		margin: 15,
	},
	inputField: {},
});

export default DataVerificationScreen;

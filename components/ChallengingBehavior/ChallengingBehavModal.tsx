import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput, Button, Card } from "react-native-paper";
import CustomColors from "../../styles/Colors";
import { StepAttempt } from "../../types/Chain/StepAttempt";

type Props = {
	stepComplete: string;
	challengeOccur: string;
	visible: boolean;
	toggleModal: () => void;
	attempt: StepAttempt;
};

const ChallengingBehavModal: FC<Props> = (props) => {
	let { visible } = props;

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				props.toggleModal();
				/**
				 * save data to attempt and return to StepScreen
				 */
			}}
		>
			<View style={styles.container}>
				<View style={styles.subContainer}>
					<View style={styles.textInputContainer}>
						<TouchableOpacity
							style={styles.exitBtn}
							onPress={() => {
								props.toggleModal();
							}}
						>
							<Text>EXIT</Text>
						</TouchableOpacity>
						<Text style={styles.headline}>
							Step {props.attempt.stepId} Challenging Behavior
						</Text>
						<Text style={styles.textInputPrompt}></Text>
						<TextInput
							label="Challenging behavior"
							mode="outlined"
							style={styles.textInput}
						></TextInput>
					</View>
					<View style={styles.questionContainer}>
						<Text style={styles.questionText}>
							Some Text for a question?
							{props.stepComplete}
						</Text>
						<View style={styles.buttonContainer}>
							<Button style={styles.button} mode="contained">
								Yes
							</Button>
							<Button style={styles.button} mode="contained">
								No
							</Button>
						</View>
					</View>
					<View style={styles.questionContainer}>
						<Text style={styles.questionText}>
							Some Text for a question?
							{props.stepComplete}
						</Text>
						<View style={styles.buttonContainer}>
							<Button style={styles.button} mode="contained">
								Yes
							</Button>
							<Button style={styles.button} mode="contained">
								No
							</Button>
						</View>
					</View>
					<Button
						style={styles.submitBtn}
						mode="contained"
						onPress={() => {
							console.log("submit");
						}}
					>
						Enter
					</Button>
				</View>
			</View>
		</Modal>
	);
};

export default ChallengingBehavModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		alignSelf: "center",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	subContainer: {
		marginTop: 200,
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 30,
	},
	headline: {
		fontSize: 30,
		alignSelf: "center",
	},
	modal: {
		// height: 600,
		width: 400,
	},
	exitBtn: {
		alignSelf: "flex-start",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		height: 40,
		width: 80,
	},
	textInputContainer: {
		width: 400,
		margin: 10,
	},
	textInputPrompt: {
		padding: 4,
	},
	textInput: {
		margin: 5,
	},
	questionContainer: {
		// marginTop: 30,

		justifyContent: "center",
		alignItems: "center",
	},
	questionText: {
		fontSize: 20,
		padding: 10,
	},
	buttonContainer: {
		flexDirection: "row",
	},
	button: {
		width: 122,
		margin: 5,
	},
	submitBtn: {
		marginLeft: 280,
		marginTop: 100,
		width: 122,
		margin: 5,
	},
});

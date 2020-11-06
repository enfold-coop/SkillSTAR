import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput, Button, Card } from "react-native-paper";
import CustomColors from "../../styles/Colors";

type Props = {
	stepComplete: string;
	challengeOccur: string;
};

const ChallengingBehavModal: FC<Props> = (props) => {
	const [visible, setVisible] = React.useState(true);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={true}
			// style={styles.container}
			onRequestClose={() => {
				console.log("Closed modal");
			}}
		>
			<View style={styles.container}>
				<View style={styles.textInputContainer}>
					<TouchableOpacity style={styles.exitBtn}>
						<Text>EXIT</Text>
					</TouchableOpacity>
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
				<Button style={styles.submitBtn} mode="contained">
					Enter
				</Button>
			</View>
		</Modal>
	);
};

export default ChallengingBehavModal;

const styles = StyleSheet.create({
	container: {
		margin: 50,
		marginTop: 200,
		alignSelf: "center",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 30,
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
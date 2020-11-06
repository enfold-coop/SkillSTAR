import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modal, Portal, TextInput, Button, Provider } from "react-native-paper";

type Props = {
	stepComplete: string;
	challengeOccur: string;
};

const ChallengingBehavModal: FC<Props> = (props) => {
	const [visible, setVisible] = React.useState(true);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={styles.modal}
			>
				<View style={styles.textInputContainer}>
					<Text style={styles.textInputPrompt}></Text>
					<TextInput style={styles.textInput}></TextInput>
				</View>
				<View style={styles.questionContainer}>
					<Text style={styles.questionText}>
						{props.stepComplete}
					</Text>
					<View style={styles.buttonContainer}>
						<Button style={styles.button}>Yes</Button>
						<Button style={styles.button}>Yes</Button>
					</View>
				</View>
				<View style={styles.questionContainer}>
					<Text style={styles.questionText}>
						{props.stepComplete}
					</Text>
					<View style={styles.buttonContainer}>
						<Button style={styles.button}>Yes</Button>
						<Button style={styles.button}>Yes</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default ChallengingBehavModal;

const styles = StyleSheet.create({
	constainer: {},
	modal: {},
	textInputContainer: {},
	textInput: {},
	textInputPrompt: {},
	questionContainer: {},
	questionText: {},
	buttonContainer: {},
	button: {},
});

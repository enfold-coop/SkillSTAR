import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import CustomColors from "../../styles/Colors";

export const DataVerificationListItem = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.stepTitle}>{"Some question"}</Text>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Task Completed?</Text>
				<View style={styles.btnContainer}>
					<Button mode="contained" style={styles.yesNoBtn}>
						Yes
					</Button>
					<Button mode="contained" style={styles.yesNoBtn}>
						No
					</Button>
				</View>
			</View>
			<View style={styles.questionContainer}>
				<Text style={styles.question}>Challenging Behavior?</Text>
				<View style={styles.btnContainer}>
					<Button mode="contained" style={styles.yesNoBtn}>
						Yes
					</Button>
					<Button mode="contained" style={styles.yesNoBtn}>
						No
					</Button>
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
		backgroundColor: CustomColors.uva.blue,
	},
});

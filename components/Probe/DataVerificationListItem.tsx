import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

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
		backgroundColor: "#f0f",
		flexDirection: "column",
		justifyContent: "space-around",
		padding: 20,
		margin: 5,
		marginLeft: 20,
		marginRight: 20,
	},
	questionContainer: {},
	question: {
		fontSize: 20,
		fontWeight: "400",
		paddingBottom: 10,
	},
	stepTitle: {
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
		paddingBottom: 10,
	},
	btnContainer: {
		backgroundColor: "#aaa",
		flexDirection: "row",
	},
	yesNoBtn: {
		width: 144,
		margin: 5,
	},
});

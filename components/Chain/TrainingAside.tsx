import React, { FC, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	sessionNmbr: number;
};

const TrainingAside: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Training Session</Text>
			<Text style={styles.instructionText}>
				Focus Step: {"3.Rinse Toothbrush"}
			</Text>
			<Text style={styles.instructionText}>
				Prompt Level {"Full Physical"}
			</Text>
		</View>
	);
};

export default TrainingAside;

const styles = StyleSheet.create({
	container: {
		padding: 10,
		height: 200,
	},
	headerText: {
		fontSize: 18,
		fontWeight: "600",
	},
	instructionText: {
		fontSize: 16,
		padding: 5,
	},
});

import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	historicalData: {};
};

/**
 * PROBE + TRAINING SESSION 
 * SESSION #: 10
FOCUS STEP: RINSE TOOTHBRUSH 
PROMPT LEVEL: PARTIAL PHYSICAL 
% MASTERY (SEE DETAILS) <-- button
 */

const SessionDataAside: FC<Props> = ({ name }) => {
	console.log(name);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Today's Session</Text>
			<View style={styles.subContainer}>
				<Text style={styles.sessionNum}>Session #${10}</Text>
				<Text style={styles.isProbeTrainingSession}></Text>
				<Text style={styles.focusStep}>
					Focus Step: {"rinse brush"}
				</Text>
				<Text style={styles.promptLevel}>
					Prompt Level: {"Partial Phys."}
				</Text>
				<Text style={styles.masteryLevel}>Mastery: {"Focus Step"}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		width: 300,
		height: 400,
		margin: 5,
		marginLeft: 0,
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
	},
	header: {
		fontSize: 16,
	},
	subContainer: {},
	sessionNum: {
		fontSize: 18,
	},
	isProbeTrainingSession: {
		fontSize: 18,
	},
	focusStep: {
		fontSize: 18,
	},
	promptLevel: {
		fontSize: 18,
	},
	masteryLevel: {
		fontSize: 18,
	},
});

export default SessionDataAside;

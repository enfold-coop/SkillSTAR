import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Button, Card } from "react-native-paper";
import CustomColors from "../../styles/Colors";

type Props = {
	historicalData: {};
	name: string;
};

const SessionDataAside: FC<Props> = ({ name }) => {
	return (
		<View style={styles.container}>
			<View>
				<View>
					<Card>
						<Text style={styles.sessionNum}>Session #: {10}</Text>
						<Text style={styles.isProbeTrainingSession}></Text>
						<Text style={styles.focusStep}>
							Focus Step: {"rinse brush"}
						</Text>
						<Text style={styles.promptLevel}>
							Prompt Level: {"Partial Phys."}
						</Text>
						<Text style={styles.masteryLevel}>
							Mastery: {"Focus Step"}
						</Text>
						<TouchableOpacity>
							<Button
								color={CustomColors.uva.orange}
								labelStyle={{ fontSize: 12, fontWeight: "800" }}
								contentStyle={styles.moreDetailsBtn}
								style={styles.moreDetailsBtn}
								mode="outlined"
							>
								See more details
							</Button>
						</TouchableOpacity>
					</Card>
				</View>
				<View style={styles.graphIconContainer}>
					<TouchableOpacity>
						<Card>
							<Image
								resizeMode="contain"
								style={styles.graphIcon}
								source={require("../../assets/images/graph.png")}
							/>
							<Text style={styles.graphText}>
								View your progress
							</Text>
						</Card>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 300,
		margin: 10,
		marginLeft: 0,
		padding: 0,
		borderRadius: 10,
		fontSize: 22,
	},
	subContainer: {
		marginTop: 0,
		flexDirection: "row",
	},
	sessionNum: {
		fontWeight: "600",
		fontSize: 18,
		padding: 5,
		paddingTop: 15,
		paddingLeft: 10,
	},
	isProbeTrainingSession: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	focusStep: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	promptLevel: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	masteryLevel: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	moreDetailsBtn: {
		padding: 1,
		margin: 10,
	},
	graphIconContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		marginTop: 10,
		padding: 2,
		// height: 200,
	},
	graphIcon: {
		padding: 5,
	},
	graphText: {
		fontSize: 16,
		fontWeight: "200",
		alignSelf: "center",
		padding: 5,
	},
});

export default SessionDataAside;

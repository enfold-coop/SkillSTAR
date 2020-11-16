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
			<Text style={styles.header}>Today's Session</Text>
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
					<Card>
						<Image
							resizeMode="contain"
							style={styles.graphIcon}
							source={require("../../assets/images/graph.png")}
						/>
					</Card>
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
		fontWeight: "600",
	},
	header: {
		fontSize: 32,
	},
	subContainer: {
		flexDirection: "row",
	},
	sessionNum: {
		fontSize: 18,
		padding: 5,
		paddingTop: 15,
		paddingLeft: 10,
	},
	isProbeTrainingSession: {
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	focusStep: {
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	promptLevel: {
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	masteryLevel: {
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
		height: 200,
	},
	graphIcon: {
		padding: 5,
	},
});

export default SessionDataAside;

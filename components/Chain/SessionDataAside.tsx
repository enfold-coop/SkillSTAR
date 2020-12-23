import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Button, Card } from "react-native-paper";
import { ProbeAside, TrainingAside } from "./index";
import LineGraph from "../DataGraph/LineGraph";
import GraphModal from "../DataGraph/GraphModal";
import CustomColors from "../../styles/Colors";
import date from "date-and-time";
import { PlotlyLineGraph } from "../DataGraph/index";

type Props = {
	historicalData: {};
	name: string;
	sessionNumber: number;
};

/**
 * NEEDS:
 * ** Session type: Probe or Training,
 * ** today's FOCUS STEP (instructions, stepnumber)
 * ** today's PROMPT LEVEL
 * **
 */

const SessionDataAside: FC<Props> = (props) => {
	const { sessionNumber, name } = props;
	const [isTraining, setIsTraining] = useState(true);
	const [today, setToday] = useState(date.format(new Date(), "MM/DD/YYYY"));
	const [promptLevel, setPromptLevel] = useState("Full Physical");
	const [masteryLevel, setMasteryLevel] = useState("Focus");
	const [graphContainerDimens, setGraphContainerDimens] = useState({});
	const [modalVis, setModalVis] = useState(false);

	const handleModal = () => {
		setModalVis(!modalVis);
	};

	return (
		<View style={styles.container}>
			<GraphModal visible={modalVis} handleVis={handleModal} />
			<View>
				<View>
					<Card>
						<View style={styles.sessionNumbAndDateContainer}>
							<Text style={styles.sessionNum}>Session #{1}</Text>
							<Text style={styles.date}>{today}</Text>
						</View>
						<View style={styles.taskInfoContainer}>
							<ProbeAside />
							{/* <TrainingAside /> */}
							{/* <Text style={styles.isProbeTrainingSession}>
								{isTraining
									? "Training Session"
									: "Probe Session"}
							</Text>
							<Text style={styles.focusStep}>
								Focus Step:{" "}
								<Text style={styles.focusStepInstruction}>
									{"Put toothpaste on brush"}
								</Text>
							</Text>
							<Text style={styles.promptLevelLabel}>
								Prompt Level:{" "}
								<Text style={styles.promptLevel}>
									{promptLevel}
								</Text>
							</Text>
							<Text style={styles.masteryLevelLabel}>
								Mastery:{" "}
								<Text style={styles.masteryLevel}>
									{masteryLevel}
								</Text>
							</Text> */}
						</View>
						<View style={styles.upNextContainer}>
							<Text style={styles.upNextLabel}>
								Up next: <Text>{"Focus Step #3"}</Text>
							</Text>
						</View>
					</Card>
				</View>
				<View
					style={styles.graphIconContainer}
					onLayout={(e) => {
						setGraphContainerDimens(e.nativeEvent.layout);
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setModalVis(true);
						}}
					>
						{/* <Card
							style={{
								backgroundColor: CustomColors.uva.white,
							}}
						> */}
						{/* <View style={styles.plotlyContainer}> */}
						<PlotlyLineGraph
							modal={modalVis}
							dimensions={graphContainerDimens}
						/>
						{/* </View> */}
						<Text style={styles.graphText}>View your progress</Text>
						{/* </Card> */}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 300,
		marginLeft: 10,
		padding: 10,
		borderRadius: 10,
		fontSize: 22,
	},

	subContainer: {
		marginTop: 0,
		flexDirection: "row",
	},

	sessionNumbAndDateContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		padding: 10,
	},
	date: {
		fontSize: 18,
		fontWeight: "600",
	},
	sessionNum: {
		fontWeight: "600",
		fontSize: 18,
	},
	taskInfoContainer: {
		padding: 10,
	},
	isProbeTrainingSession: {
		fontWeight: "600",
		fontSize: 18,
		padding: 5,
		textDecorationLine: "underline",
		textDecorationStyle: "solid",
		textDecorationColor: CustomColors.uva.grayMedium,
	},
	upNextContainer: { padding: 10 },
	upNextLabel: {
		fontWeight: "600",
		fontSize: 18,
	},
	focusStep: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	focusStepInstruction: {
		fontWeight: "400",
	},
	promptLevelLabel: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	promptLevel: {
		fontWeight: "400",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	masteryLevelLabel: {
		fontWeight: "600",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	masteryLevel: {
		fontWeight: "400",
		fontSize: 18,
		padding: 2,
		paddingLeft: 10,
	},
	moreDetailsBtn: {
		padding: 1,
		margin: 10,
	},
	graphIconContainer: {
		width: "100%",
		height: 200,
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		marginTop: 10,
		padding: 2,
		backgroundColor: "#fff",
	},
	plotlyContainer: {
		justifyContent: "center",
		alignContent: "center",
	},
	graphText: {
		fontSize: 16,
		color: CustomColors.uva.grayDark,
		alignSelf: "center",
		padding: 5,
	},
});

export default SessionDataAside;

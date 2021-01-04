import React, { FC, useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Button, Card } from "react-native-paper";
import { ProbeAside, TrainingAside } from "./index";
import { ChainsHomeGraph } from "../DataGraph/index";
import GraphModal from "../DataGraph/GraphModal";
import CustomColors from "../../styles/Colors";
import date from "date-and-time";
import { store } from "../../context/ChainProvider";

type Props = {
	historicalData: {};
	name: string;
	sessionNumber: number;
	asideContent: {};
};

/**
 * NEEDS:
 * ** Session type: Probe or Training,
 * ** today's FOCUS STEP (instructions, stepnumber)
 * ** today's PROMPT LEVEL
 * **
 */

const SessionDataAside: FC<Props> = (props) => {
	const { sessionNumber, name, asideContent } = props;
	const context = useContext(store);
	const { state } = context;
	// console.log(state);

	// console.log(context);
	useEffect(() => {
		if (state.sessionType === "training") {
			setIsTraining(true);
		}
	}, []);

	const [isTraining, setIsTraining] = useState(false);
	const [today, setToday] = useState(date.format(new Date(), "MM/DD/YYYY"));
	const [promptLevel, setPromptLevel] = useState("Full Physical");
	const [masteryLevel, setMasteryLevel] = useState("Focus");
	const [graphContainerDimens, setGraphContainerDimens] = useState({});
	const [modalVis, setModalVis] = useState(false);

	const handleModal = () => {
		setModalVis(!modalVis);
	};

	const setAsideContent = () => {
		if (isTraining) {
			return <TrainingAside />;
		} else {
			return <ProbeAside />;
		}
	};

	return (
		<View style={styles.container}>
			<GraphModal visible={modalVis} handleVis={handleModal} />
			<View>
				<View>
					<Card>
						<View style={styles.sessionNumbAndDateContainer}>
							<Text style={styles.sessionNum}>
								Session #{sessionNumber}
							</Text>
							<Text style={styles.date}>{today}</Text>
						</View>
						<View style={styles.taskInfoContainer}>
							{setAsideContent()}
						</View>
					</Card>
				</View>
				<View
					style={styles.graphIconContainer}
					onLayout={(e) => {
						setGraphContainerDimens(e.nativeEvent.layout);
					}}
				>
					<Card>
						<ChainsHomeGraph dimensions={graphContainerDimens} />
						<TouchableOpacity
							onPress={() => {
								setModalVis(true);
							}}
						>
							<Text style={styles.graphText}>
								View your progress
							</Text>
						</TouchableOpacity>
					</Card>
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
		width: 280,
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		marginTop: 20,
		borderRadius: 10,
		backgroundColor: "#fff",
	},
	graphText: {
		fontSize: 18,
		color: CustomColors.uva.grayDark,
		alignSelf: "center",
		padding: 5,
	},
});

export default SessionDataAside;

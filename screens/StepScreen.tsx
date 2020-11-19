import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import React, { FC, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, ProgressBar } from "react-native-paper";
import ChallengingBehavModal from "../components/ChallengingBehavior/ChallengingBehavModal";
import AppHeader from "../components/Header/AppHeader";
import { chainSteps } from "../data/chainSteps";
import { videos } from "../data/videos";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import { Session } from "../types/CHAIN/Session";
import { StepAttempt } from "../types/CHAIN/StepAttempt";

interface Props {
	route: RootNavProps<"StepScreen">;
	navigation: RootNavProps<"StepScreen">;
}

// Convert progress to "0.1 - 1.0" value
const progressBarCalculation = (arr: Array, currStep: number): number => {
	return currStep / arr.length;
};

const StepScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	let [visible, setVisible] = React.useState(false);
	let [steps, setSteps] = useState([]);
	let [stepIndex, setStepIndex] = useState<number>(0);
	let [session, setSession] = useState(new Session());

	const toggleModal = () => {
		setVisible(!visible);
	};

	const handleModalClose = () => {
		toggleModal();
	};

	const incrIndex = () => {
		stepIndex += 1;
		setStepIndex(stepIndex);
	};

	const decIndex = () => {
		if (stepIndex > 0) {
			stepIndex -= 1;
			setStepIndex(stepIndex);
		}
	};

	const createAttempts = () => {
		chainSteps.forEach((e, i) => {
			session.addStepData(new StepAttempt(chainSteps[i].step));
		});
	};

	useEffect(() => {
		navigation.setOptions({ title: chainSteps[stepIndex].name });
		setSteps(chainSteps);
		if (!session.data.length) {
			createAttempts();
		}
	});

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<AppHeader name={"Brush Teeth"} />
				{session.data[stepIndex] && (
					<ChallengingBehavModal
						visible={visible}
						toggleModal={handleModalClose}
						attempt={session.data[stepIndex]}
					/>
				)}
				<View style={styles.progress}>
					<Text style={styles.headline}>
						Step {chainSteps[stepIndex].step}:{" "}
						{chainSteps[stepIndex].instruction}
					</Text>
					<View style={styles.progressContainer}>
						<ProgressBar
							style={styles.progressBar}
							progress={progressBarCalculation(
								chainSteps,
								stepIndex
							)}
							color={CustomColors.uva.blue}
						/>
						<Text style={styles.progressText}>
							Step {chainSteps[stepIndex].step} out of{" "}
							{chainSteps.length}
						</Text>
					</View>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.challengingBehavior}>
						<TouchableOpacity
							onPress={() => {
								toggleModal();
							}}
						>
							<AntDesign
								name="exclamationcircleo"
								size={50}
								color="black"
								style={styles.difficultyButton}
							/>
						</TouchableOpacity>
						<Text style={styles.difficultyParagraph}>
							Click on this icon anytime your child is having
							difficulty or experiening challenging behavior.
						</Text>
					</View>
					<View style={styles.subVideoContainer}>
						<Video
							source={videos[`chain_0_${stepIndex + 1}`]}
							rate={1.0}
							volume={1.0}
							isMuted={true}
							resizeMode="cover"
							isLooping={false}
							useNativeControls={true}
							style={styles.video}
						/>
					</View>
					<View style={styles.bottomContainer}>
						<Button
							style={styles.exitButton}
							color={CustomColors.uva.blue}
							mode="outlined"
							onPress={() => {
								console.log("exit");
								navigation.navigate("ChainsHomeScreen");
							}}
						>
							Exit
						</Button>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<AntDesign
								name="exclamationcircleo"
								size={24}
								color="black"
								style={styles.focusStepIcon}
							/>
							<Text
								style={{
									fontSize: 14,
									fontWeight: "700",
									paddingLeft: 10,
									paddingTop: 3,
									alignContent: "center",
								}}
							>
								{"Focus Step"}
							</Text>
						</View>
					</View>
					<View style={styles.nextBackBtnsContainer}>
						<Button
							style={styles.backButton}
							color={CustomColors.uva.blue}
							mode="contained"
							onPress={() => {
								decIndex();
							}}
						>
							BACK
						</Button>
						<Button
							style={styles.nextButton}
							color={CustomColors.uva.blue}
							mode="contained"
							onPress={() => {
								if (stepIndex + 1 <= chainSteps.length - 1) {
									incrIndex();
								} else {
									navigation.navigate(
										"BaselineAssessmentScreen",
										{
											session,
										}
									);
								}
							}}
						>
							NEXT
						</Button>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	progress: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 20,
		marginRight: 20,
	},
	progressContainer: {},
	progressText: {
		paddingTop: 4,
	},
	headline: {
		width: "60%",
		fontSize: 20,
		fontWeight: "600",
	},
	subContainer: {
		flexDirection: "column",
	},
	challengingBehavior: {
		flexDirection: "row",
		padding: 10,
		paddingLeft: 80,
		alignContent: "center",
		justifyContent: "flex-start",
	},
	difficultyButton: {
		margin: 0,
		padding: 0,
	},
	difficultyParagraph: {
		width: 300,
		padding: 0,
		paddingLeft: 40,
		fontWeight: "600",
	},
	icon: {
		padding: 10,
	},
	itemName: {},
	subVideoContainer: {
		padding: 10,
		height: 400,
		flexDirection: "row",
		justifyContent: "center",
	},
	video: {
		height: 400,
		width: "100%",
	},
	progressBar: {
		width: 122,
		height: 20,
	},
	bottomContainer: {
		flexDirection: "row",
		padding: 20,
		margin: 10,
		justifyContent: "space-between",
	},
	focusStepIcon: {
		height: 30,
	},
	exitButton: {
		width: 144,
		fontWeight: "600",
	},
	nextBackBtnsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	nextButton: {
		width: 144,
		margin: 15,
		// alignSelf: "flex-end",
	},
	backButton: {
		width: 144,
		margin: 15,
		// alignSelf: "flex-start",
	},
});

export default StepScreen;

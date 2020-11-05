import React, { FC, Fragment } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button, ProgressBar, Colors } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootNavProps } from "../navigation/root_types";
import AppHeader from "../components/Header/AppHeader";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";
import CustomColors from "../styles/Colors";

type Props = {
	route: RootNavProps<"StepScreen">;
	navigation: RootNavProps<"StepScreen">;
};

const dummy_data = {
	stepNum: 1,
	stepDirection: "I get my toothbrush.",
};

const StepScreen: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<AppHeader name={"Step Screen"} />
			<View style={styles.progress}>
				<Text style={styles.headline}>
					Step {dummy_data.stepNum}: {dummy_data.stepDirection}
				</Text>
				<View style={styles.progressContainer}>
					<ProgressBar
						style={styles.progressBar}
						progress={0.5}
						color={CustomColors.uva.blue}
					/>
					<Text style={styles.progressText}>
						Step {"1"} out of {"17"}{" "}
					</Text>
				</View>
			</View>
			<View style={styles.subContainer}>
				<View style={styles.challengingBehavior}>
					<TouchableOpacity>
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
						source={{
							uri:
								"http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
						}}
						rate={1.0}
						volume={1.0}
						isMuted={false}
						resizeMode="cover"
						shouldPlay
						isLooping
						style={styles.video}
					/>
				</View>
				<View style={styles.bottomContainer}>
					<Button
						style={styles.exitButton}
						color={CustomColors.uva.blue}
						mode="outlined"
						onPress={() => {
							console.log("nav to next step");
						}}
					>
						Exit
					</Button>
					<AntDesign
						name="exclamationcircleo"
						size={24}
						color="black"
						style={styles.focusStepIcon}
					/>
				</View>
				<Button
					style={styles.nextButton}
					color={CustomColors.uva.blue}
					mode="contained"
					onPress={() => {
						console.log("nav to next step");
					}}
				>
					NEXT
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	progress: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: 50,
		padding: 10,
		paddingLeft: 20,
		paddingRight: 20,
	},
	progressContainer: {},
	progressText: {
		paddingTop: 4,
	},
	headline: {
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
	nextButton: {
		width: 144,
		marginLeft: 20,
	},
});

export default StepScreen;

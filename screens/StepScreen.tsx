import React, { FC, Fragment } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button, ProgressBar, Colors } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootNavProps } from "../navigation/root_types";
import AppHeader from "../components/Header/AppHeader";
import { Video } from "expo-av";

type Props = {
	route: RootNavProps<"StepScreen">;
	navigation: RootNavProps<"StepScreen">;
};

const dummy_data = {
	stepNum: 1,
	stepDirection: "I get my toothbrush.",
};

const StepScreen: FC<Props> = (props) => {
	// console.log(props);
	/**
	 * Need to add:
	 * - step number, w/ label
	 * - steps progress bar
	 * - "challenging behavior" button
	 * - view for instructions and/or video
	 * - "Focused step" label
	 * - EXIT button
	 * - NEXT button
	 */
	return (
		<View style={styles.container}>
			<AppHeader />
			<View style={styles.progress}>
				{/* flex: row */}
				<Text style={styles.headline}>
					Step {dummy_data.stepNum}: {dummy_data.stepDirection}
				</Text>
				{/* PROGRESS BAR */}
				<ProgressBar
					style={styles.progressBar}
					progress={0.5}
					color={Colors.red800}
				/>
			</View>
			<View style={styles.subContainer}>
				{/* flex: column */}
				<View style={styles.challengingBehavior}>
					{/* flex: row */}
					<TouchableOpacity>
						<Text>DIFFICULTY BUTTON</Text>
					</TouchableOpacity>
					<Text style={styles.difficultyParagraph}>
						Click on this icon anytime your child is having
						difficulty or experiening challenging behavior.
					</Text>
				</View>
				<View style={styles.subVideoContainer}>
					{/* <Image source={require("...to focus step icon")}/> */}
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
				<Button
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
		// paddingRight: 100,
		paddingLeft: 80,
		justifyContent: "flex-start",
	},
	difficultyParagraph: {
		width: 300,
		padding: 10,
		paddingLeft: 40,
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
});

export default StepScreen;

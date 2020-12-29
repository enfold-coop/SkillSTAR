import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../components/Header/AppHeader";
import { Button } from "react-native-paper";
import CustomColors from "../styles/Colors";

type Props = {};

const RewardsScreens: FC<Props> = (props) => {
	const navigation = useNavigation();
	const star = require("../assets/images/reward_screen/reward-star-01.png");
	// const awesomeJobText = require("../assets/images/reward_screen/awesome-job-text-v3.png");
	return (
		<View style={styles.container}>
			<AppHeader name={"Congrats!"} />
			{/* <Text style={styles.headline}>All Steps Complete!</Text> */}
			{/* <Text style={styles.instructions}>
				(Give reinforcement and praise.)
			</Text> */}
			<View style={styles.instructionContainer}>
				<Text style={styles.congratsMsg}>You brushed your teeth!</Text>
				<Text style={styles.awesomeText}>Awesome job!</Text>
			</View>
			<View style={styles.mainRewardContainer}>
				<Image style={styles.img} source={star} />
				{/* <Image style={styles.awesomeText} source={star} /> */}
			</View>
			<Button
				mode="contained"
				style={styles.submitBtn}
				onPress={() => navigation.navigate("ChainsHomeScreen")}
			>
				<Text style={{ color: CustomColors.uva.blue }}>
					Back to Chains Home
				</Text>
			</Button>
		</View>
	);
};

export default RewardsScreens;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		padding: 20,
		marginHorizontal: 20,
	},
	headline: {
		fontSize: 28,
		fontWeight: "600",
		textAlign: "center",
		paddingVertical: 10,
		// backgroundColor: "#f0f",
	},
	instructionContainer: {
		// marginHorizontal: 24,
		paddingHorizontal: 10,
		paddingVertical: 10,
		// backgroundColor: CustomColors.uva.graySoft,
		marginVertical: 5,
	},
	instructions: {
		fontSize: 20,
		fontWeight: "200",
		textAlign: "center",
	},
	mainRewardContainer: {
		height: "75%",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "center",
	},
	congratsMsg: {
		fontSize: 26,
		fontWeight: "800",
		textAlign: "center",
		color: CustomColors.uva.blue,
	},
	img: {
		height: "100%",
		width: "100%",
		alignSelf: "center",
		resizeMode: "contain",
		margin: 10,
		marginTop: 0,
		borderWidth: 5,
		borderRadius: 50,
		borderColor: CustomColors.uva.graySoft,
	},
	awesomeText: {
		fontSize: 36,
		fontWeight: "800",
		textAlign: "center",
		color: CustomColors.uva.blue,
	},
	submitBtn: {
		marginTop: 20,
		backgroundColor: CustomColors.uva.orange,
		width: 300,
		alignSelf: "flex-end",
		color: CustomColors.uva.blue,
	},
});

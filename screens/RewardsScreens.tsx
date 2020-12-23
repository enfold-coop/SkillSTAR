import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../components/Header/AppHeader";
import { Button } from "react-native-paper";
import CustomColors from "../styles/Colors";

type Props = {};

const RewardsScreens: FC<Props> = (props) => {
	const navigation = useNavigation();
	const star = require("../assets/images/reward-star.png");
	return (
		<View style={styles.container}>
			<AppHeader name={"Congrats!"} />
			<Text style={styles.headline}>All Steps Complete!</Text>
			<View style={styles.instructionContainer}>
				<Text style={styles.instructions}>
					(Give reinforcement and praise.)
				</Text>
			</View>
			<View style={styles.mainRewardContainer}>
				<Text style={styles.congratsMsg}>You brushed your teeth!</Text>
				<Text style={styles.congratsMsg}>Awesome job!</Text>
				<Image style={styles.img} source={star} />
			</View>
			<Button
				mode="contained"
				onPress={() => navigation.navigate("ChainsHomeScreen")}
			>
				Back to Chains Home
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
	},
	headline: {
		fontSize: 28,
		fontWeight: "600",
		textAlign: "center",
		paddingVertical: 40,
	},
	instructionContainer: {
		// marginHorizontal: 24,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: CustomColors.uva.sky,
		marginVertical: 5,
	},
	instructions: {
		fontSize: 20,
		fontWeight: "500",
		textAlign: "center",
	},
	mainRewardContainer: {
		marginVertical: 5,
		backgroundColor: CustomColors.uva.sky,
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
	},
	congratsMsg: {
		fontSize: 36,
		fontWeight: "800",
		textAlign: "center",
	},
	img: {
		height: "60%",
		width: "60%",
		alignSelf: "center",
		resizeMode: "contain",
	},
});

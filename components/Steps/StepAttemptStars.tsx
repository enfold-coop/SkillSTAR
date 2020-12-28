import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CustomColors from "../../styles/Colors";

type Props = {
	promptType: string;
	attemptsWPromptType: boolean[];
};

const StepAttemptStars: FC<Props> = (props) => {
	let { attemptsWPromptType } = props;
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}></View>
			<View style={styles.starContainer}>
				<Text style={styles.promptTypeText}>
					{props.promptType + ":"}
				</Text>
				{attemptsWPromptType.map((e) => {
					if (e) {
						return (
							<AntDesign
								name="star"
								size={50}
								color={CustomColors.uva.orange}
								style={styles.star}
							/>
						);
					} else {
						return (
							<AntDesign
								name="staro"
								size={50}
								color={CustomColors.uva.orange}
								style={styles.star}
							/>
						);
					}
				})}
			</View>
		</View>
	);
};

export default StepAttemptStars;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		width: "33%",
		padding: 10,
		// alignContent: "center",
	},
	subContainer: {},
	promptTypeText: {
		alignSelf: "center",
		paddingRight: 20,
		fontSize: 30,
		fontWeight: "800",
		color: "#333",
	},
	starContainer: {
		flexDirection: "row",
	},
	star: {},
});

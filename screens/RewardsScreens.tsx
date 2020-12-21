import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
type Props = {};

const RewardsScreens: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.headline}></Text>
			<View style={styles.instructionContainer}>
				<Text style={styles.instructions}></Text>
			</View>
			<View style={styles.mainRewardContainer}>
				<Text style={styles.congratsMsg}>You brushed your teeth!</Text>
				<Text style={styles.congratsMsg}>Awesome job!</Text>
				<Image style={styles.img} />
			</View>
		</View>
	);
};

export default RewardsScreens;

const styles = StyleSheet.create({
	container: {},
	headline: {},
	instructionContainer: {},
	instructions: {},
	mainRewardContainer: {},
	congratsMsg: {},
	img: {},
});

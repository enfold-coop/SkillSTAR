import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChainNavProps } from "../navigation/ChainNavigation/types";
import { ScorecardList } from "../components/Chain/index";

type Props = {
	skill?: {};
	route: ChainNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<Text>CHAINS HOME</Text>
			{/* <Text>{thisSkill}</Text>
			<Text style={styles.title}>Scorecard</Text>
			<ScorecardList data={data} /> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});

export default ChainsHomeScreen;

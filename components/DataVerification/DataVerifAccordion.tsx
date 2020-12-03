import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {};

const DataVerifAccordion: FC<Props> = (props) => {
	return (
		<View style={[styles.container]}>
			<Text>ACCORDION</Text>
		</View>
	);
};

export default DataVerifAccordion;

const styles = StyleSheet.create({
	container: {
		height: 400,
		backgroundColor: "#f0f",
	},
});

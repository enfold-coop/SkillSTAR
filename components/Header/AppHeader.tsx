import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Appbar } from "react-native-paper";
import CustomColors from "../../styles/Colors";

// TEST TEXT
import * as TESTTEXT from "./TestText";

const logo = {
	uri: "../../assets/images/icon.png",
};

export default function AppHeader(props) {
	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/images/logo.png")}
				style={styles.logo}
			/>
			<View style={styles.skillTextContainer}>
				<Text style={styles.headline}>{props.name}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 20,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		color: "#000",
		padding: 10,
		paddingTop: 0,
		borderBottomWidth: 3,
		borderBottomColor: CustomColors.uva.orange,
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 10,
	},
	skillTextContainer: {
		flexDirection: "column",
		justifyContent: "flex-end",
		padding: 0,
		paddingLeft: 30,
	},
	headline: {
		fontSize: 30,
		fontWeight: "800",
		color: "#000",
		alignSelf: "center",
	},
	subHeadline: {
		fontSize: 20,
	},
});

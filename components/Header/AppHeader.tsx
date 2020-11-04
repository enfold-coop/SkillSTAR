import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Appbar } from "react-native-paper";

// TEST TEXT
import * as TESTTEXT from "./TestText";

const logo = {
	uri: "../../assets/images/icon.png",
};

export default function AppHeader(props) {
	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/images/icon.png")}
				style={styles.logo}
			/>
			<View style={styles.skillTextContainer}>
				<Text style={styles.headline}>Brushing Teeth</Text>
				<Text style={styles.subHeadline}>
					{TESTTEXT.subHeadlineTestText.teeth}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		color: "#000",
		padding: 10,
		paddingLeft: 80,
		borderBottomWidth: 3,
		borderBottomColor: "#aaa",
	},
	logo: {
		width: 100,
		height: 100,
	},
	skillTextContainer: {
		flexDirection: "column",
		padding: 10,
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

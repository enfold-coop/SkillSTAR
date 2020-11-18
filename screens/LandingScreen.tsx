import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { RootNavProps as Props } from "../navigation/root_types";
import CustomColors from "../styles/Colors";

let url = "../data/chain_steps.json";
let dataJSON = require(url);

export default function LandingScreen({ navigation }: Props<"LandingScreen">) {
	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("");

	return (
		<View style={styles.container}>
			<Image
				style={{ alignSelf: "center" }}
				source={require("../assets/images/logo.png")}
			/>
			{/**
			 * New user?
			 * -- Yes: background survey,
			 * -- No: baseline assesssment
			 */}
			<TextInput
				label="Email"
				mode="outlined"
				value={email}
				style={styles.input}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				label="Password"
				mode="outlined"
				value={password}
				style={styles.input}
				onChangeText={(text) => setPassword(text)}
			/>
			{/* </View> */}
			<Button
				style={styles.button}
				color={CustomColors.uva.blue}
				mode="contained"
				onPress={() => navigation.navigate("ChainsHomeScreen")}
			>
				Log In
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignContent: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	input: {
		height: 50,
		width: 200,
		alignSelf: "center",
		margin: 10,
	},
	button: {
		margin: 22,
		width: 122,
		alignSelf: "center",
	},
});

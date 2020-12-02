import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text, ImageBackground } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { RootNavProps as Props } from "../navigation/root_types";
import CustomColors from "../styles/Colors";

export default function LandingScreen({ navigation }: Props<"LandingScreen">) {
	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("");

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<Image
					style={{
						alignSelf: "center",
						width: 400,
						height: 400,
						marginBottom: 40,
					}}
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
					// onPress={() => navigation.navigate("ChainsHomeScreen")}
					onPress={() =>
						navigation.navigate("DataVerificationScreen")
					}
				>
					Log In
				</Button>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignContent: "center",
		justifyContent: "center",
		padding: 0,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
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
	logo: {
		alignSelf: "center",
		width: 200,
		height: 200,
	},
});

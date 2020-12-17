import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthProvider";
import { RootNavProps as Props } from "../navigation/root_types";
import { ApiService } from "../services/ApiService";
import CustomColors from "../styles/Colors";
import { AuthProviderProps } from "../types/AuthProvider";
import { Participant, User } from "../types/User";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD} from "@env";

export default function LandingScreen({ navigation }: Props<"LandingScreen">) {
	let [email, setEmail] = useState(DEFAULT_USER_EMAIL);
	let [password, setPassword] = useState(DEFAULT_USER_PASSWORD);
	let [isValid, setIsValid] = useState<boolean>(false);
	let [errorMessage, setErrorMessage] = useState<string>("");
	const api = new ApiService();
	const context = useContext<AuthProviderProps>(AuthContext);

	const _checkEmail = (inputText: string) => {
		setErrorMessage("");
		setIsValid(!!(inputText && password));
		setEmail(inputText);
	};

	const _checkPassword = (inputText: string) => {
		setErrorMessage("");
		setIsValid(!!(email && inputText));
		setPassword(inputText);
	};

	useEffect(() => {
		setIsValid(!!(email && password));
		AsyncStorage.getItem("user")
			.then((userJson: string | null) => {
				if (userJson !== null) {
					const user: User = JSON.parse(userJson);

					if (user && user.token) {
						context.state.user = user;

						if (user.participants && user.participants.length > 0) {
							const dependents = user.participants.filter(
								(p) => p.relationship === "dependent"
							);

							AsyncStorage.getItem("selected_participant").then(
								(p: string | null) => {
									if (p) {
										const cachedParticipant = JSON.parse(
											p
										) as Participant;
										const selectedParticipant = dependents.find(
											(p) => p.id === cachedParticipant.id
										);
										if (selectedParticipant) {
											context.state.participant = selectedParticipant;
											navigation.navigate(
												"ChainsHomeScreen"
											);
										}
									}
								}
							);
						}
					}
				}
			})
			.catch((error) => {
				console.error("Error retrieving user:", error);
			});
	});

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<Animatable.View animation="zoomIn">
					<Image
						style={styles.logo}
						source={require("../assets/images/logo.png")}
					/>
					<TextInput
						textContentType="emailAddress"
						autoCompleteType="username"
						label="Email"
						mode="outlined"
						value={email}
						style={styles.input}
						onChangeText={(text) => _checkEmail(text)}
						autoFocus={true}
					/>
					<TextInput
						textContentType="password"
						autoCompleteType="password"
						secureTextEntry={true}
						label="Password"
						mode="outlined"
						value={password}
						style={styles.input}
						onChangeText={(text) => _checkPassword(text)}
					/>
					<View
						style={{
							display: errorMessage === "" ? "none" : "flex",
							...styles.container,
						}}
					>
						<Text style={styles.error}>{errorMessage}</Text>
					</View>
					<Button
						style={styles.button}
						color={CustomColors.uva.blue}
						mode="contained"
						disabled={!isValid}
						onPress={() => {
							setErrorMessage("");
							api.login(email, password).then((user) => {
								// console.log('user', user);
								if (user) {
									context.state.user = user;
									navigation.navigate(
										"DataVerificationScreen"
									);
								} else {
									setErrorMessage(
										"Invalid username or password. Please check your login information and try again."
									);
								}
							});
						}}
					>
						Log In
					</Button>
				</Animatable.View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignContent: "center",
		justifyContent: "flex-start",
		padding: 0,
		marginTop: 100,
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
		marginBottom: 40,
	},
	error: {
		textAlign: "center",
		alignSelf: "center",
		color: CustomColors.uva.warning,
		fontWeight: "bold",
		alignContent: "center",
		justifyContent: "center",
	},
});

import React, { FC, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { TextInput, Checkbox, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import { Session } from "../types/CHAIN/Session";
import CustomColors from "../styles/Colors";

type Props = {
	route: RootNavProps<"BaselineAssessmentScreen">;
	navigation: RootNavProps<"BaselineAssessmentScreen">;
	session: Session;
};

const BaselineAssessmentScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	let [stepIndex, setStepIndex] = useState(0);
	let [readyToSubmit, setReadyToSubmit] = useState(false);
	let [text, setText] = useState("");
	let { session } = props.route.params;

	const incrIndex = () => {
		stepIndex += 1;
		setStepIndex(stepIndex);
	};

	const decIndex = () => {
		if (stepIndex > 0) {
			stepIndex -= 1;
			setStepIndex(stepIndex);
		}
	};

	/**
	 * 1. get attempts array
	 * 2. load first attempt into DOM
	 * 3. increment array logic
	 * 4. functionality to write changes to attempt items
	 * 5.
	 */

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<View style={styles.formContainer}>
					<View style={styles.formItemContainer}>
						<Text style={styles.formItemLabel}>{}</Text>

						<Button style={styles.formItemButton}></Button>
						{/* <TextInput
						label="Email"
						value={text}
						onChangeText={(text) => setText(text)}
					/> */}
					</View>
				</View>
			</View>
			<View style={styles.nextBackBtnsContainer}>
				<Button
					style={styles.backButton}
					color={CustomColors.uva.blue}
					mode="contained"
					onPress={() => {
						decIndex();
					}}
				>
					BACK
				</Button>
				<Button
					style={styles.nextButton}
					color={CustomColors.uva.blue}
					mode="contained"
					onPress={() => {
						if (stepIndex + 1 <= chainSteps.length - 1) {
							incrIndex();
						} else {
							setReadyToSubmit(true);
							navigation.navigate("BaselineAssessmentScreen", {
								session,
							});
						}
					}}
				>
					NEXT
				</Button>
			</View>
			{readyToSubmit && (
				<Button
					mode="contained"
					onPress={() => {
						navigation.navigate("ChainsHomeScreen");
					}}
				>
					Submit
				</Button>
			)}
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	formContainer: {},
	formItemContainer: {},
	formItemLabel: {},
	formItemButton: {},
	nextBackBtnsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	nextButton: {
		width: 144,
		margin: 15,
	},
	backButton: {
		width: 144,
		margin: 15,
	},
	inputField: {},
});

export default BaselineAssessmentScreen;

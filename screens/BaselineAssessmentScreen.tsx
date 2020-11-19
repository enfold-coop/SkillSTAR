import React, { FC } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { TextInput, Checkbox, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import { Session } from "../types/CHAIN/Session";

type Props = {
	route: RootNavProps<"BaselineAssessmentScreen">;
	navigation: RootNavProps<"BaselineAssessmentScreen">;
	session: Session;
};

const BaselineAssessmentScreen: FC<Props> = (props) => {
	const navigation = useNavigation();

	let { session } = props.route.params;

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
				<Text></Text>
				<Button
					mode="contained"
					onPress={() => {
						navigation.navigate("ChainsHomeScreen");
					}}
				>
					To the Chain
				</Button>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default BaselineAssessmentScreen;

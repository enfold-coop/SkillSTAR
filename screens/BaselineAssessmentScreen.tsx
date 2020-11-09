import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, Checkbox, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";

type Props = {
	route: RootNavProps<"BaselineAssessmentScreen">;
	navigation: RootNavProps<"BaselineAssessmentScreen">;
};

const BaselineAssessmentScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	return (
		<View>
			<Text></Text>
			<Button
				mode="contained"
				onPress={() => {
					navigation.navigate("SkillsHomeScreen");
				}}
			>
				To SkillsHome
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({});

export default BaselineAssessmentScreen;

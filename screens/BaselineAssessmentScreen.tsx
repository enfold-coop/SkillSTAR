import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, Checkbox, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function BaselineAssessmentScreen() {
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
}

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Checkbox, Button, RadioButton } from "react-native-paper";
import Navigation from "../navigation";

export default function BackgroundSurveyScreen({}) {
	const navigation = useNavigation();
	return (
		<View>
			<Text></Text>
			<Button
				mode="contained"
				onPress={() => {
					navigation.navigate("BaselineAssessmentScreen");
				}}
			>
				To Baseline Assessment
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({});

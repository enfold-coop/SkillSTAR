import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

const DataItemCheckBox = () => {
	const [checked, setChecked] = React.useState(false);

	return (
		<Checkbox
			status={checked ? "checked" : "unchecked"}
			onPress={() => {
				setChecked(!checked);
			}}
		/>
	);
};

export default DataItemCheckBox;

const styles = StyleSheet.create({});

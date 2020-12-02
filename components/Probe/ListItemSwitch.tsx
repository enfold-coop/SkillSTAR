import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-paper";
import CustomColors from "../../styles/Colors";

type Props = {
	instruction: string;
};

const ListItemSwitch: FC<Props> = (props) => {
	let { instruction } = props;
	const [isSwitchOn, setIsSwitchOn] = useState(false);
	let [label, setLabel] = useState("No");
	const toggleLabel = () => {
		setLabel((label = isSwitchOn === false ? "No" : "Yes"));
	};

	useEffect(() => {
		setIsSwitchOn(false);
	}, [instruction]);

	useEffect(() => {
		toggleLabel();
	}, [isSwitchOn]);

	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<Switch
				value={isSwitchOn}
				color={CustomColors.uva.orange}
				onValueChange={onToggleSwitch}
				style={[styles.switch]}
			/>
		</View>
	);
};

export default ListItemSwitch;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
	},
	label: {
		fontSize: 30,
		textAlign: "center",
		alignSelf: "center",
	},
	switch: {
		margin: 20,
		alignSelf: "center",
		transform: [{ scaleX: 1 }, { scaleY: 1 }],
	},
});

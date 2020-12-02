import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-paper";
import CustomColors from "../../styles/Colors";

type Props = {
	instruction: string;
	type: number;
	id: number;
	defaultValue: boolean;
};

const ListItemSwitch: FC<Props> = (props) => {
	const navigation = useNavigation();
	/**
	 *
	 * use context api, here:
	 * -- send collected data to Context / server:
	 * ---- set switch value to type, on stepId
	 *
	 */

	let { instruction, type, defaultValue } = props;
	const [isSwitchOn, setIsSwitchOn] = useState(defaultValue);

	let [label, setLabel] = useState("No");

	// Checks for question type and switch value.  If results are positive
	// navigate to ChainsHomeScreen
	const checkTypeAgainstSwitchVal = () => {
		if (type === 0 && isSwitchOn === false) navigateToChainsHome();
		if (type === 1 && isSwitchOn === true) navigateToChainsHome();
	};

	// Sets question type swtich value type
	const setQuestionType = () => {
		if (type === 0) {
			setIsSwitchOn(true);
		} else if (type === 1) {
			setIsSwitchOn(false);
		}
	};
	// Navigate to ChainsHome
	const navigateToChainsHome = () => {
		navigation.navigate("ChainsHomeScreen");
	};

	// Toogle switch label (yes/no)
	const toggleLabel = () => {
		setLabel((label = isSwitchOn === false ? "No" : "Yes"));
		checkTypeAgainstSwitchVal();
	};

	// callback for setting isSwitchOn value
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	//

	/** START: Lifecycle calls */
	useEffect(() => {
		setQuestionType();
	}, [type]);

	// useEffect(() => {
	// 	setIsSwitchOn(false);
	// }, [instruction]);

	useEffect(() => {
		toggleLabel();
	}, [isSwitchOn]);
	/** END: Lifecycle calls */

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
		fontSize: 28,
		textAlign: "center",
		alignSelf: "center",
	},
	switch: {
		margin: 20,
		alignSelf: "center",
		transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
	},
});

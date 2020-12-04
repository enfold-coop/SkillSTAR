import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-paper";
import CustomColors from "../../styles/Colors";
import * as Animatable from "react-native-animatable";

type Props = {
	instruction: string;
	type: number;
	id: number;
	defaultValue: boolean;
	handleSwitchVal: () => {};
};
const DataVerifSwitch: FC<Props> = (props) => {
	const navigation = useNavigation();

	let { instruction, type, defaultValue, handleSwitchVal } = props;

	const [isSwitchOn, setIsSwitchOn] = useState(defaultValue);

	let [label, setLabel] = useState("No");

	const handleSwitchValue = (v: boolean, type: number) => {
		return handleSwitchVal(v, type);
	};

	// Checks for question type and switch value.  If results are positive
	// navigate to ChainsHomeScreen
	const checkTypeAgainstSwitchVal = () => {
		if (type === 0 && isSwitchOn === false)
			handleSwitchValue(isSwitchOn, 0);
		if (type === 1 && isSwitchOn === true) handleSwitchValue(isSwitchOn, 1);
	};

	// Sets question type swtich value type
	const setQuestionType = () => {
		if (type === 0) {
			setIsSwitchOn(true);
			handleSwitchValue(isSwitchOn, 0);
		} else if (type === 1) {
			setIsSwitchOn(false);
			handleSwitchValue(isSwitchOn, 1);
		}
	};

	// Navigate to ChainsHome
	const navigateToChainsHome = () => {
		// navigation.navigate("ChainsHomeScreen");
		// console.log("switch");
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

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	subContainer: {
		flexDirection: "row",
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
	accordion: {
		display: "flex",
		height: 100,
	},
	noAccordion: {
		display: "none",
		height: 0,
	},
});
export default DataVerifSwitch;

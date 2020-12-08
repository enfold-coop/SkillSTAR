import React, { FC, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import CustomColors from "../../styles/Colors";

const MOCK_BEHAV_OPTS = [
	"Mild (did not interfere with task)",
	"Moderate (interfered with task, but we were able to work through it)",
	"Severe (we were not able to complete the task due to the severity of the behavior)",
];

const MOCK_BEHAV_Q = "How severe was the challenging behavior?";

type Props = {
	instruction: string;
	id: number;
	handleSwitch: any;
};

const BehavDataVerifSwitch: FC<Props> = (props) => {
	const navigation = useNavigation();
	const refSwitched = useRef(true);
	const { instruction, id, handleSwitch } = props;
	const [isSwitchOn, setIsSwitchOn] = useState(false);
	let [active, setActive] = useState(false);
	let [Q, setQ] = useState("");
	let [opts, setOpts] = useState([]);

	let [label, setLabel] = useState("No");

	/**
	 * BEGIN: Accordion functionality
	 */
	/**
	 * END: Accordion functionality
	 */

	const handleSwitchVal = (v: boolean) => {
		return handleSwitch(v);
	};

	// Toogle switch label (yes/no)
	const toggleLabel = () => {
		setLabel((label = isSwitchOn === false ? "No" : "Yes"));
		// checkTypeAgainstSwitchVal();
	};

	// callback for setting isSwitchOn value
	const onToggleSwitch = () => {
		setIsSwitchOn(!isSwitchOn);
		handleSwitchVal(isSwitchOn);
	};
	//

	/** START: Lifecycle calls */

	useEffect(() => {
		if (refSwitched.current) {
			refSwitched.current = false;
		} else {
			toggleLabel();
			setActive(!active);
		}
	}, [isSwitchOn]);
	/** END: Lifecycle calls */

	return (
		<Animatable.View style={styles.container}>
			<View style={styles.subContainer}>
				<Text style={styles.label}>{label}</Text>
				<Switch
					value={isSwitchOn}
					color={CustomColors.uva.orange}
					onValueChange={() => {
						onToggleSwitch();
					}}
					style={[styles.switch]}
				/>
			</View>
		</Animatable.View>
	);
};

export default BehavDataVerifSwitch;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	subContainer: {
		flexDirection: "row",
	},
	accordionContainer: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		margin: 20,
		marginBottom: 40,
		padding: 20,
		borderColor: CustomColors.uva.gray,
		borderWidth: 0,
		borderRadius: 10,
		backgroundColor: "rgba(255,255,255,0.3)",
	},
	accordionSubContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
	},
	question: {
		width: "50%",
		paddingTop: 5,
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

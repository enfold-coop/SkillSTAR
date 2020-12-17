import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-paper";
import CustomColors from "../../styles/Colors";
import * as Animatable from "react-native-animatable";

type Props = {
	instruction: string;
	id: number;
};

const DataVerifSwitch: FC<Props> = (props) => {
	const navigation = useNavigation();

	const { instruction, id } = props;
	const [isSwitchOn, setIsSwitchOn] = useState();
	let [active, setActive] = useState(false);
	let [label, setLabel] = useState("No");

	/**
	 * BEGIN: Accordion functionality
	 */
	const [checked, setChecked] = React.useState(false);
	const [expanded, setExpanded] = useState(false);
	/**
	 * END: Accordion functionality
	 */

	// Toogle switch label (yes/no)
	const toggleLabel = () => {
		setLabel((label = !isSwitchOn ? "No" : "Yes"));
		// checkTypeAgainstSwitchVal();
	};

	// callback for setting isSwitchOn value
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	//

	/** START: Lifecycle calls */

	useEffect(() => {
		toggleLabel();
		setActive(!active);
	}, [isSwitchOn]);
	/** END: Lifecycle calls */

	return (
		<Animatable.View style={styles.container}>
			<View style={styles.subContainer}>
				<Text style={styles.label}>{label}</Text>
				<Switch
					value={isSwitchOn}
					color={CustomColors.uva.orange}
					onValueChange={onToggleSwitch}
					style={[styles.switch]}
				/>
			</View>
			{/* {active && <DataVerifAccordion question={Q} answerOptions={opts} />} */}
		</Animatable.View>
	);
};

export default DataVerifSwitch;

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
		margin: 10,
		alignSelf: "center",
		transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
	},
});

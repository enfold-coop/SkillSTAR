import React, { FC, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import CheckBox from "react-native-check-box";

import { TouchableOpacity } from "react-native-gesture-handler";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import * as Animatable from "react-native-animatable";
import { MOCK_BEHAV_OPTS, MOCK_BEHAV_Q } from "./mock_session";
import CustomColors from "../../styles/Colors";

type Props = {
	stepAttempt: StepAttempt;
	switched: boolean;
};

const BehavAccordion: FC<Props> = (props) => {
	const refSwitched = useRef(true);
	let { switched } = props;
	const [checked, setChecked] = React.useState(false);
	const [checked2, setChecked2] = React.useState(false);
	const [checked3, setChecked3] = React.useState(false);
	const [expanded, setExpanded] = useState(false);
	let [behavQ, setBehavQ] = useState(MOCK_BEHAV_Q);
	let [behavOpts, setBehavOpts] = useState(MOCK_BEHAV_OPTS);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);

	/**
	 * BEGIN: Lifecycle methods
	 */
	useEffect(() => {
		if (refSwitched.current) {
			refSwitched.current = false;
		} else {
			setExpanded(switched);
		}
	}, [switched]);
	/**
	 * END: Lifecycle methods
	 */

	return (
		<Animatable.View
			style={[styles.container, { display: expanded ? "flex" : "none" }]}
		>
			<View style={styles.behavSubContainer}>
				<Text style={styles.question}>{behavQ}</Text>
				<View style={[styles.behavOptsContainer]}>
					<CheckBox
						style={styles.checkbox}
						color={"#f0f"}
						onClick={() => {
							setChecked(!checked);
						}}
						isChecked={checked}
						leftText={"CheckBox"}
					/>
					<CheckBox
						style={styles.checkbox}
						color={"#f0f"}
						onClick={() => {
							setChecked2(!checked2);
						}}
						isChecked={checked2}
						leftText={"CheckBox"}
					/>
					<CheckBox
						style={styles.checkbox}
						color={"#f0f"}
						onClick={() => {
							setChecked3(!checked3);
						}}
						isChecked={checked3}
						leftText={"CheckBox"}
					/>
				</View>
			</View>
		</Animatable.View>
	);
};

export default BehavAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		marginTop: 5,
		marginBottom: 5,
		paddingLeft: 10,
		paddingBottom: 10,
		width: "100%",
		borderBottomRightRadius: 5,
		borderBottomLeftRadius: 5,
		backgroundColor: CustomColors.uva.white,
	},
	checkbox: {
		backgroundColor: "#f0f",
		padding: 10,
	},

	behavSubContainer: {
		paddingBottom: 10,
	},
	behavOptsContainer: {
		flexDirection: "column",
		marginLeft: 20,
		justifyContent: "space-around",
	},
	question: {
		paddingTop: 5,
		fontSize: 16,
		fontWeight: "600",
	},
	input: {
		padding: 5,
	},
});

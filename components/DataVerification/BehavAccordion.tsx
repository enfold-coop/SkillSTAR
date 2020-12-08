import React, { FC, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
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
	const [checked, setChecked] = React.useState(0);
	const [expanded, setExpanded] = useState(false);
	let [behavQ, setBehavQ] = useState(MOCK_BEHAV_Q);
	let [behavOpts, setBehavOpts] = useState(MOCK_BEHAV_OPTS);

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
					{behavOpts.map((e, i) => {
						return (
							<View style={styles.checkboxContainer}>
								<View
									style={{
										padding: 3,
										borderRadius: 3,
										borderWidth: 2,
										borderColor: CustomColors.uva.gray,
									}}
								>
									<RadioButton
										color={CustomColors.uva.orange}
										value={e + "YOYOYOYOYOYO"}
										status={
											checked === i
												? "checked"
												: "unchecked"
										}
										onPress={() => setChecked(i)}
									/>
								</View>
								<Text style={styles.radioBtnText}>{e}</Text>
							</View>
						);
					})}
					{/* <CheckBox
						style={styles.checkbox}
						color={"#f0f"}
						onClick={() => {
							setChecked3(!checked3);
						}}
						isChecked={checked3}
						leftText={MOCK_BEHAV_OPTS[2]}
					/> */}
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
		borderRadius: 5,
		backgroundColor: CustomColors.uva.white,
	},
	checkboxContainer: {
		marginRight: 5,
		flexDirection: "row",
		alignContent: "center",
		margin: 5,
	},

	radioBtnText: {
		alignSelf: "center",
		paddingLeft: 10,
		fontSize: 20,
	},

	behavSubContainer: {
		paddingBottom: 10,
	},
	behavOptsContainer: {
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "flex-start",
	},
	question: {
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 20,
		fontWeight: "600",
	},
	input: {
		padding: 5,
	},
});

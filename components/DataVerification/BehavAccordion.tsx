import React, { FC, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
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
	const [expanded, setExpanded] = useState(false);
	let [behavQ, setBehavQ] = useState(MOCK_BEHAV_Q);
	let [behavOpts, setBehavOpts] = useState(MOCK_BEHAV_OPTS);

	useEffect(() => {
		if (refSwitched.current) {
			console.log("first time");
			refSwitched.current = false;
			console.log(refSwitched.current);
		} else {
			console.log("subseq times");
			console.log(switched);
			setExpanded(!expanded);
		}
	}, [switched]);

	return (
		<Animatable.View
			style={[styles.container, { display: expanded ? "flex" : "none" }]}
		>
			<View style={styles.behavSubContainer}>
				<Text style={styles.question}>{behavQ}</Text>
				<View style={[styles.behavOptsContainer]}>
					<TouchableOpacity>
						{behavOpts.map((e, i) => {
							return (
								<Text>
									{i + 1}. {e}
								</Text>
							);
						})}
					</TouchableOpacity>
				</View>
			</View>
		</Animatable.View>
	);
};

export default BehavAccordion;

const styles = StyleSheet.create({
	container: {
		display: "none",
		flex: 1,
		flexDirection: "column",
		margin: 5,
		width: "100%",
		// backgroundColor: "#f0f",
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

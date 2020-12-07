import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { MOCK_BEHAV_OPTS, MOCK_BEHAV_Q } from "./mock_session";
import CustomColors from "../../styles/Colors";

type Props = {
	question: string;
	answerOptions: string[];
};

const BehavAccordion: FC<Props> = (props) => {
	const { question, answerOptions } = props;
	console.log(question);
	const [checked, setChecked] = React.useState(false);
	const [expanded, setExpanded] = useState(false);
	let [behavQ, setBehavQ] = useState(MOCK_BEHAV_Q);
	let [behavOpts, setBehavOpts] = useState(MOCK_BEHAV_OPTS);

	// { display: expanded ? "flex" : "none" }
	return (
		<Animatable.View style={[styles.container]}>
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

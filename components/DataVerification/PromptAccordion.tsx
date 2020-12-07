import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { MOCK_PROMPT_OPTS, MOCK_PROMP_Q } from "./mock_session";
import CustomColors from "../../styles/Colors";

type Props = {
	question: string;
	answerOptions: string[];
};

const PromptAccordion: FC<Props> = (props) => {
	const { question, answerOptions } = props;
	console.log(question);
	const [checked, setChecked] = React.useState(false);
	const [expanded, setExpanded] = useState(false);
	let [promptQ, setpromptQ] = useState(MOCK_PROMP_Q);
	let [promptOpts, setpromptOpts] = useState(MOCK_PROMPT_OPTS);

	// { display: expanded ? "flex" : "none" }
	return (
		<Animatable.View style={[styles.container]}>
			<Text style={styles.question}>{promptQ}</Text>
			<View style={[styles.promptOptsContainer]}>
				<TouchableOpacity>
					{promptOpts.map((e, i) => {
						return (
							<Text>
								{i + 1}. {e}
							</Text>
						);
					})}
				</TouchableOpacity>
			</View>
		</Animatable.View>
	);
};

export default PromptAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		margin: 5,
		width: "100%",
	},
	promptSubContainer: {
		paddingBottom: 10,
	},
	promptOptsContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
		marginLeft: 20,
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

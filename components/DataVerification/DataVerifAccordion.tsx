import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import * as Animatable from "react-native-animatable";

import CustomColors from "../../styles/Colors";

type Props = {
	question: string;
	answerOptions: string[];
};

const DataVerifAccordion: FC<Props> = (props) => {
	const { question, answerOptions } = props;
	const [checked, setChecked] = React.useState(false);
	const [expanded, setExpanded] = useState(false);

	// { display: expanded ? "flex" : "none" }
	return (
		<Animatable.View style={[styles.container]}>
			<View style={[styles.subContainer]}>
				<Text style={styles.question}>{question}</Text>
				<TouchableOpacity>
					{answerOptions.map((e, i) => {
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

export default DataVerifAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 20,
		marginBottom: 40,
		padding: 20,
		borderColor: CustomColors.uva.gray,
		borderWidth: 0,
		borderRadius: 10,
		backgroundColor: "rgba(255,255,255,0.3)",
	},
	subContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	question: {
		width: "50%",
		paddingTop: 5,
	},
	formContainer: {
		width: "50%",
	},
	input: {
		padding: 5,
	},
	answerOption: {},
});

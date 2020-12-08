import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import * as Animatable from "react-native-animatable";
import { MOCK_PROMPT_OPTS, MOCK_PROMP_Q } from "./mock_session";
import CustomColors from "../../styles/Colors";

type Props = {
	stepAttempt: StepAttempt;
	switched: boolean;
};

const PromptAccordion: FC<Props> = (props) => {
	let { switched } = props;

	const [checked, setChecked] = React.useState(0);
	const [expanded, setExpanded] = useState(false);
	let [promptQ, setpromptQ] = useState(MOCK_PROMP_Q);
	let [promptOpts, setpromptOpts] = useState(MOCK_PROMPT_OPTS);

	useEffect(() => {
		setExpanded(switched);
	}, [switched]);

	// { display: expanded ? "flex" : "none" }
	return (
		<Animatable.View
			style={[styles.container, { display: switched ? "flex" : "none" }]}
		>
			<View style={styles.promptSubContainer}>
				<Text style={styles.question}>{promptQ}</Text>
				<View style={[styles.promptOptsContainer]}>
					{promptOpts.map((e, i) => {
						return (
							<View style={styles.checkboxContainer}>
								<View
									style={{
										padding: 2,
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
				</View>
			</View>
		</Animatable.View>
	);
};

export default PromptAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingLeft: 10,
		paddingBottom: 10,
		marginTop: 5,
		marginBottom: 5,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		width: "100%",
		backgroundColor: CustomColors.uva.white,
	},
	promptSubContainer: {
		paddingBottom: 10,
	},
	promptOptsContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
		marginLeft: 20,
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

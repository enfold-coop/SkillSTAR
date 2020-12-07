import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-paper";
import CustomColors from "../../styles/Colors";
import * as Animatable from "react-native-animatable";

const MOCK_PROMPT_OPTS = [
	"No Prompt (Independent)",
	"Shadow Prompt (approximately one inch)",
	"Partial Physical Prompt (thumb and index finger)",
	"Full Physical Prompt (hand-over-hand)",
];

const MOCK_BEHAV_OPTS = [
	"Mild (did not interfere with task)",
	"Moderate (interfered with task, but we were able to work through it)",
	"Severe (we were not able to complete the task due to the severity of the behavior)",
];

const MOCK_PROMP_Q = "What prompt did you use to complete the step?";
const MOCK_BEHAV_Q = "How severe was the challenging behavior?";

type Props = {
	instruction: string;
	type: number;
	id: number;
};
const DataVerifSwitch: FC<Props> = (props) => {
	const navigation = useNavigation();

	const { instruction, type, id } = props;
	const [isSwitchOn, setIsSwitchOn] = useState();
	let [active, setActive] = useState(false);
	let [Q, setQ] = useState("");
	let [opts, setOpts] = useState([]);

	let [label, setLabel] = useState("No");

	/**
	 * BEGIN: Accordion functionality
	 */
	const [checked, setChecked] = React.useState(false);
	const [expanded, setExpanded] = useState(false);
	/**
	 * END: Accordion functionality
	 */

	// Checks for question type and switch value.  If results are positive
	// navigate to ChainsHomeScreen
	const checkTypeAgainstSwitchVal = () => {
		if (type === 0 && isSwitchOn === false) {
			setQ(MOCK_PROMP_Q);
			setOpts(MOCK_PROMPT_OPTS);
		}
		if (type === 1 && isSwitchOn === true) {
			setQ(MOCK_BEHAV_Q);
			setOpts(MOCK_BEHAV_OPTS);
		}
	};

	// Sets question type swtich value type
	const setQuestionType = () => {
		if (type === 0) {
			setIsSwitchOn(true);
		} else if (type === 1) {
			setIsSwitchOn(false);
		}
	};

	// Toogle switch label (yes/no)
	const toggleLabel = () => {
		setLabel((label = isSwitchOn === false ? "No" : "Yes"));
		// checkTypeAgainstSwitchVal();
	};

	// callback for setting isSwitchOn value
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
	//

	/** START: Lifecycle calls */
	useEffect(() => {
		setQuestionType();
	}, [type]);

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
			<Animatable.View style={[styles.accordionContainer]}>
				<Text style={styles.question}>{Q}</Text>
				<View style={[styles.accordionSubContainer]}>
					<TouchableOpacity>
						{opts.map((e, i) => {
							return (
								<Text>
									{i + 1}. {e}
								</Text>
							);
						})}
					</TouchableOpacity>
				</View>
			</Animatable.View>
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
		margin: 20,
		alignSelf: "center",
		transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
	},
});

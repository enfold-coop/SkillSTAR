import React, { FC, useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import { MasteryIcons } from "../../styles/MasteryIcons";
import { MasteryLevel as ML } from "../../types/Chain/MasteryLevel";
import { AntDesign } from "@expo/vector-icons";
import { MasteryLevel } from "../../types/Chain/MasteryLevel";
import * as Animatable from "react-native-animatable";
import date from "date-and-time";
import CustomColors from "../../styles/Colors";
import {StepAttempt} from '../../types/Chain/StepAttempt';

interface ScorecardStepListItem {
	attempts: StepAttempt[];
	step: number;
	instruction: string;
	mastery: MasteryLevel;
	video: string;
}

interface ListItem {
	item: ScorecardStepListItem;
}

type Props = {
	index?: number;
	itemProps: ListItem;
};

const ScorecardListItem: FC<Props> = ({ ...props }) => {
	const { step, instruction, mastery } = props.itemProps.item;
	const [isPressed, setIsPressed] = useState(false);

	return (
		<Animatable.View animation="fadeIn" duration={300 * step}>
			<Card style={styles.container}>
				<TouchableOpacity
					style={[styles.touchable]}
					onPress={() => {
						setIsPressed(!isPressed);
					}}
				>
					<Text style={styles.id}>{step}. </Text>
					<Text style={styles.skill}>{instruction}</Text>
					<Text style={styles.score}>{MasteryIcons(1)}</Text>
					<AntDesign
						name="caretright"
						size={24}
						color="black"
						style={[
							isPressed ? styles.nextIcon90 : styles.nextIcon,
						]}
					/>
				</TouchableOpacity>
				{isPressed && (
					<View style={styles.dropDownContainer}>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Introduced: `}
							<Text style={styles.dropDownItemDate}>
								{date.format(new Date(), "MM/DD/YYYY")}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Mastered: `}
							<Text style={styles.dropDownItemDate}>
								{date.format(new Date(), "MM/DD/YYYY")}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Booster training initiated: `}
							<Text style={styles.dropDownItemDate}>
								{date.format(new Date(), "MM/DD/YYYY")}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Mastered Booster training: `}
							<Text style={styles.dropDownItemDate}>
								{date.format(new Date(), "MM/DD/YYYY")}
							</Text>
						</Text>
					</View>
				)}
			</Card>
		</Animatable.View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 3,
		flexDirection: "row",
	},
	touchable: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
	},
	dropDownContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
		alignContent: "flex-start",
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10,
		paddingRight: 20,
		padding: 20,
		backgroundColor: CustomColors.uva.white,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: CustomColors.uva.graySoft,
	},
	dropDownLabel: {
		padding: 5,
		paddingLeft: 40,
		fontWeight: "500",
		alignSelf: "flex-start",
	},
	dropDownItemDate: {
		color: CustomColors.uva.grayDark,
	},
	id: {
		padding: 5,
		fontSize: 16,
		fontWeight: "bold",
	},
	skill: {
		width: 300,
		flexWrap: "wrap",
		padding: 5,
		fontSize: 16,
		fontWeight: "bold",
	},
	score: {
		paddingLeft: 20,
	},
	nextIcon: {
		marginLeft: "auto",
		padding: 10,
		paddingRight: 20,
		transform: [{ rotate: "0deg" }],
	},
	nextIcon90: {
		marginLeft: "auto",
		padding: 10,
		paddingRight: 20,
		transform: [{ rotate: "90deg" }],
	},

	title: {
		padding: 5,
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default ScorecardListItem;

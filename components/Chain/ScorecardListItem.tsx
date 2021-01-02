import React, { FC, useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { Card } from "react-native-paper";
import { MasteryIcons } from "../../styles/MasteryIcons";
import { MasteryLevel as ML } from "../../types/CHAIN/MasteryLevel";
import { AntDesign } from "@expo/vector-icons";
import { MasteryLevel } from "../../types/CHAIN/MasteryLevel";
import * as Animatable from "react-native-animatable";
import date from "date-and-time";
import CustomColors from "../../styles/Colors";

const masteredIcon = require("../../assets/icons/ribbon-icon_1.png");
const focusIcon = require("../../assets/icons/in-progress-icon_1.png");
const notStartedIcon = require("../../assets/icons/waving-icon.png");

type Props = {
	index?: number;
	itemProps: {};
	sessionStepData?: {};
};

const ScorecardListItem: FC<Props> = (props) => {
	const { id, instruction, last_updated } = props.itemProps.item;
	console.log(last_updated);

	const { sessionStepData } = props;
	const [isPressed, setIsPressed] = useState(false);
	const [icon, setIcon] = useState();
	const [stepData, setStepData] = useState({});
	const [dateIntro, setDateIntro] = useState("");
	const [dateMast, setDateMast] = useState();
	const [dateBoost, setDateBoosts] = useState();
	const [dateBoostMast, setDateBoostMast] = useState();

	useEffect(() => {
		setDateIntro(last_updated);
	});

	const determineMastery = () => {
		if (id === 0 && stepData) {
			setIcon(focusIcon);
		} else if (id > 0) {
			setIcon(notStartedIcon);
		} else {
			console.log("mastered icon??");
		}
	};

	const setDropDownDates = () => {
		//
	};

	const handleDateVals = (d: string) => {
		let _d = date.format(new Date(d), "MM/DD/YYYY");
		console.log(_d);

		if (_d === "aN/aN/0NaN") {
			return "N/A";
		} else {
			return date.format(new Date(d), "MM/DD/YYYY");
		}
	};

	useEffect(() => {
		setStepData(sessionStepData());
		determineMastery();
		setDateIntro();
	}, []);

	return (
		<Animatable.View animation="fadeIn" duration={300 * id}>
			<Card style={styles.container}>
				<TouchableOpacity
					style={[styles.touchable]}
					onPress={() => {
						setIsPressed(!isPressed);
					}}
				>
					<Text style={styles.id}>{id + 1}. </Text>
					<Text style={styles.skill}>{instruction}</Text>
					{/* <Text style={styles.score}>{MasteryIcons(1)}</Text> */}
					<Image
						style={[
							{
								width: 28,
								height: 28,
								alignSelf: "center",
								padding: 2,
							},
						]}
						source={icon}
					/>
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
								{handleDateVals(dateIntro)}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Mastered: `}
							<Text style={styles.dropDownItemDate}>
								{handleDateVals(dateMast)}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Booster training initiated: `}
							<Text style={styles.dropDownItemDate}>
								{handleDateVals(dateBoost)}
							</Text>
						</Text>
						<Text style={styles.dropDownLabel}>
							{`${"\u2022"} Date Mastered Booster training: `}
							<Text style={styles.dropDownItemDate}>
								{handleDateVals(dateBoostMast)}
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

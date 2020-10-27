import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Card } from "react-native-paper";

export default function SkillGrade(props) {
	console.log(props.data);

	return (
		<Card style={styles.container}>
			<Image
				source={require("../../assets/images/skill_icon.png")}
				style={styles.icon}
			/>
			<View style={styles.subcontainer}>
				<Text style={styles.skillGrade}>{props.name}</Text>
				<View style={styles}>
					{props.data.map((e, i) => {
						return (
							<Text key={i.toString()} style={styles.skillTitle}>
								{e.title}
							</Text>
						);
					})}
				</View>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		alignContent: "center",
		margin: 5,
		padding: 5,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 5,
	},
	icon: {
		width: 50,
		height: 50,
		borderWidth: 0,
		borderRadius: 3,
		backgroundColor: "#fff",
	},
	subcontainer: {
		padding: 5,
		display: "flex",
		flexDirection: "column",
	},
	skillTitle: {
		padding: 2,
	},
	skillGrade: {
		fontWeight: "600",
	},
});
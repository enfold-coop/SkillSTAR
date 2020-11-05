import React, { FC } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Card } from "react-native-paper";
import { RootNavProps } from "../../navigation/root_types";
import { MasteryIcons } from "../../styles/MasteryIcons";

type Props = {
	data: [];
	name: string;
};

function createSkillTitleString(data: []): string {
	let t = data.map((e) => e.title);
	let str = t.join(", ");
	return str;
}

const SkillGrade: FC<Props> = (props) => {
	// console.log(props);
	return (
		<Card style={styles.container}>
			{MasteryIcons(props.data[0].score)}
			<View style={styles.subcontainer}>
				<Text style={styles.skillGrade}>{props.name}: </Text>
				<View style={styles.skillList}>
					<Text style={styles.stepNames}>
						{createSkillTitleString(props.data)}
					</Text>
				</View>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 5,
	},
	icon: {
		width: 50,
		height: 50,
		margin: 5,
		borderWidth: 0,
		borderRadius: 3,
		backgroundColor: "#fff",
	},
	subcontainer: {
		padding: 5,
		display: "flex",
		flexDirection: "column",
	},
	skillList: {
		display: "flex",
		flexDirection: "row",
	},
	skillTitle: {
		padding: 2,
	},
	skillGrade: {
		fontWeight: "800",
	},
	stepNames: {
		fontSize: 14,
		fontWeight: "600",
	},
});

export default SkillGrade;

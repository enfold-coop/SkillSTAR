import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import { PREP_MATS } from "../data/prep_materials";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	const [data, setData] = useState(PREP_MATS);

	return (
		<View style={styles.container}>
			<Text style={styles.headline}>
				Have you gathered your materials?
			</Text>
			<View style={styles.listItem}>
				<Image
					style={styles.itemIcon}
					source={require("../assets/images/prep_materials_icon/toothbrush.png")}
				/>
			</View>
			<View style={styles.listItem}>
				<Image
					style={styles.itemIcon}
					source={require("../assets/images/prep_materials_icon/toothpaste.png")}
				/>
			</View>
			<View style={styles.listItem}>
				<Image
					style={styles.itemIcon}
					source={require("../assets/images/prep_materials_icon/towel.png")}
				/>
			</View>
			<View style={styles.listItem}>
				<Image
					style={styles.itemIcon}
					source={require("../assets/images/prep_materials_icon/toothbrush.png")}
				/>
			</View>
			<Button
				mode="contained"
				color={CustomColors.uva.blue}
				style={styles.nextBtn}
				onPress={() => {
					navigation.navigate("StepScreen");
				}}
			>
				Next
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		paddingTop: 30,
		alignContent: "center",
		justifyContent: "center",
	},
	headline: {
		fontSize: 20,
	},
	listItem: {
		margin: 10,
		padding: 10,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignContent: "space-around",
	},
	itemIcon: {
		width: 80,
		height: 80,
	},
	itemTitle: {
		width: 200,
		padding: 10,
	},
	nextBtn: {
		margin: 20,
		width: 122,
		alignSelf: "center",
	},
});

export default PrepareMaterialsScreen;

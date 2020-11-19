import React, { FC, useState } from "react";
import {StyleSheet, View, Image, ImageBackground} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Title } from "react-native-paper";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import AppHeader from "../components/Header/AppHeader";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	const navigation = useNavigation();

	return (
    <ImageBackground
      source={require("../assets/images/energy-burst-dark.jpg")}
      resizeMode={'cover'}
      style={styles.container}
    >
			<AppHeader name="Prepare Materials" />
			<Card style={styles.listItem}>
				<View style={styles.listItem}>
					<Image
						style={styles.itemIcon}
						source={require("../assets/images/prep_materials_icon/toothbrush.png")}
					/>
					<Title style={styles.itemTitle}>Tooth Brush</Title>
				</View>
			</Card>
			<Card style={styles.listItem}>
				<View style={styles.listItem}>
					<Image
						style={styles.itemIcon}
						source={require("../assets/images/prep_materials_icon/toothpaste.png")}
					/>
					<Title style={styles.itemTitle}>Tooth Paste</Title>
				</View>
			</Card>
			<Card style={styles.listItem}>
				<View style={styles.listItem}>
					<Image
						style={styles.itemIcon}
						source={require("../assets/images/prep_materials_icon/towel.png")}
					/>
					<Title style={styles.itemTitle}>Towel</Title>
				</View>
			</Card>
			<Card style={styles.listItem}>
				<View style={styles.listItem}>
					<Image
						style={styles.itemIcon}
						source={require("../assets/images/prep_materials_icon/water.png")}
					/>
					<Title style={styles.itemTitle}>Cup of Water</Title>
				</View>
			</Card>
			<Card style={styles.listItem}>
				<View style={styles.listItem}>
					<Image
						style={styles.itemIcon}
						source={require("../assets/images/prep_materials_icon/medicine.png")}
					/>
					<Title style={styles.itemTitle}>Cabinet</Title>
				</View>
			</Card>
			<Button
				mode="contained"
				color={CustomColors.uva.blue}
				style={styles.nextBtn}
				labelStyle={{ fontSize: 20 }}
				onPress={() => {
					navigation.navigate("StepScreen");
				}}
			>
				Next
			</Button>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 20,
		// paddingTop: 30,
		alignContent: "flex-start",
		justifyContent: "flex-start",
    padding: 0,
    height: '100%',
    width: '100%',
	},
	headline: {
		fontSize: 20,
	},
	listItem: {
		marginTop: 10,
		marginLeft: 10,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignContent: "stretch",
	},
	itemIcon: {
		width: 80,
		height: 80,
		margin: 20,
		marginLeft: 40,
		marginRight: 130,
	},
	itemTitle: {
		// width: 200,
		fontSize: 34,
		lineHeight: 34,
		alignSelf: "center",
		fontWeight: "400",
	},
	nextBtn: {
		padding: 10,
		fontSize: 24,
		margin: 10,
		marginRight: 0,
		width: 222,
		alignSelf: "flex-end",
	},
});

export default PrepareMaterialsScreen;

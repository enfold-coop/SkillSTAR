import React, { FC } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	// console.log(props);
	const navigation = useNavigation();
	/**
	 *
	 * Need to add
	 */
	return (
		<View style={styles.container}>
			{/* <Text style={styles.headline}>
				Have you gathered your materials?
			</Text> */}
			{/* 
                - have a list of required materials and their images
                -loop thru list, rendering View elem for each
            */}
			{/* <View style={styles.listContainer}>
				<Image
					style={styles.icon}
					source={require("../assets/images/materials/toothbrush.png")}
				/>
				<Text style={styles.itemName}>ToothBrush</Text>
			</View> */}
			<Image
				style={styles.underConstruction}
				source={require("../assets/images/errata/under_construction.png")}
			/>
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
		padding: 10,
		flexDirection: "column",
		justifyContent: "space-around",
		alignContent: "center",
	},
	headline: {},
	listContainer: {},
	underConstruction: {
		alignSelf: "center",
		padding: 100,
		paddingTop: 200,
		height: 600,
		width: 500,
	},
	icon: {
		width: 100,
		height: 100,
	},
	itemName: {},
	nextBtn: {
		margin: 20,
		width: 122,
		alignSelf: "center",
	},
});

export default PrepareMaterialsScreen;

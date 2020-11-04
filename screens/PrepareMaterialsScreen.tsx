import React, { FC } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { RootNavProps } from "../navigation/root_types";

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
			<Text style={styles.headline}>
				Have you gathered your materials?
			</Text>
			{/* 
                - have a list of required materials and their images
                -loop thru list, rendering View elem for each
            */}
			<View style={styles.listContainer}>
				<Image
					style={styles.icon}
					source={require("../assets/images/materials/toothbrush.png")}
				/>
				<Text style={styles.itemName}>ToothBrush</Text>
			</View>
			<Button
				mode="contained"
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
	container: {},
	headline: {},
	listContainer: {},
	icon: {
		width: 100,
		height: 100,
	},
	itemName: {},
	nextBtn: {},
});

export default PrepareMaterialsScreen;

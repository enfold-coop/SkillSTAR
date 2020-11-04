import React, { FC } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { RootNavProps } from "../navigation/root_types";

type Props = {
	route: RootNavProps<"PrepareMaterialsScreen">;
	navigation: RootNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	console.log(props);
	/**
	 *
	 * Need to add
	 */
	return (
		<View style={styles.container}>
			<Text style={styles.headline}>
				Have you gathered your materials?
			</Text>
			<View style={styles.listContainer}>
				<Image
					style={styles.icon}
					source={require("@expo/snack-static/react-native-logo.png")}
				/>
				<Text style={styles.itemName}>ToothPaste</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	headline: {},
	listContainer: {},
	icon: {},
	itemName: {},
});

export default PrepareMaterialsScreen;

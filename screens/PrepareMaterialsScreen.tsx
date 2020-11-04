import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChainNavProps } from "../navigation/ChainNavigation/types";

type Props = {
	route: ChainNavProps<"PrepareMaterialsScreen">;
	navigation: ChainNavProps<"PrepareMaterialsScreen">;
};

const PrepareMaterialsScreen: FC<Props> = (props) => {
	console.log(props);

	return (
		<View>
			<Text>PREPSCREEN</Text>
		</View>
	);
};

const styles = StyleSheet.create({});

export default PrepareMaterialsScreen;

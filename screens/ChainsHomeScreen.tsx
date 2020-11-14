import React, { FC, Fragment, useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import AppHeader from "../components/Header/AppHeader";

type Props = {
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	const { chainSteps } = props.route.params.steps;

	return (
		<View style={styles.container}>
			<AppHeader name="Chains Home" />
			{chainSteps && (
				<View>
					<Text style={styles.title}>Scorecard</Text>
					<FlatList
						style={styles.list}
						data={chainSteps}
						keyExtractor={(item) => item.step}
						renderItem={(item) => <ScorecardListItem item={item} />}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignContent: "flex-end",
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		paddingLeft: 20,
	},
	separator: {
		marginVertical: 30,
		height: 1,
	},
	list: {
		height: "60%",
		margin: 20,
	},
});

export default ChainsHomeScreen;

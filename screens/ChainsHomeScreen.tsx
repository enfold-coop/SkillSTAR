import React, { FC, Fragment, useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import AppHeader from "../components/Header/AppHeader";
import SessionDataAside from "../components/Chain/SessionDataAside";

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
			<Text style={styles.title}>Scorecard</Text>
			{chainSteps && (
				<View style={styles.listContainer}>
					<SessionDataAside name={"Moxy"} />

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
		flex: 1,
		padding: 10,
		paddingTop: 30,
		justifyContent: "flex-start",
		alignContent: "flex-end",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		paddingLeft: 20,
	},
	separator: {
		marginVertical: 30,
		height: 1,
	},
	listContainer: {
		flexDirection: "row",
		padding: 10,
	},
	list: {
		// width: 500,
		margin: 5,
		backgroundColor: "#aaa",
		padding: 5,
		borderRadius: 5,
	},
});

export default ChainsHomeScreen;

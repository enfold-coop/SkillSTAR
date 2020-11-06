import React, { FC, Fragment, useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AppHeader from "../components/Header/AppHeader";
import { RootNavProps } from "../navigation/root_types";
import { ScorecardListItem } from "../components/Chain/index";

type Props = {
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
	console.log(props);

	const { skill } = props.route.params;

	return (
		<View style={styles.container}>
			<AppHeader name={skill.name} />
			{skill.name && (
				<View>
					<Text style={styles.title}>Scorecard</Text>
					<FlatList
						style={styles.list}
						data={skill.subItems}
						keyExtractor={(item) => item.id}
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
		margin: 20,
	},
});

export default ChainsHomeScreen;

import React, { FC, Fragment, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ChainNavProps } from "../navigation/ChainNavigation/types";
import { ScorecardListItem } from "../components/Chain/index";
import { ChainContext } from "../context/ChainProvider";

type Props = {
	route: ChainNavProps<"ChainsHomeScreen">;
	navigation: ChainNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
	// const { skill } = props.route.params;
	console.log(props);

	return (
		<View style={styles.container}>
			{/* {skill.name && (
				<Fragment>
					<Text>{skill.name}</Text>
					<Text style={styles.title}>Scorecard</Text>
					<FlatList
						style={styles.list}
						data={skill.subItems}
						keyExtractor={(item) => item.id}
						renderItem={(item) => <ScorecardListItem item={item} />}
					/>
				</Fragment>
			)} */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 20,
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

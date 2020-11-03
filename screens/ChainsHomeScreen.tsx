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
	const context = useContext(ChainContext);

	return (
		// <ChainContext.Consumer>
		// 	{() => (

		<View style={styles.container}>
			{/* {currentSkill.item.name && ( */}
			<Fragment>
				{/* <Text>{skill.item.name}</Text> */}
				{/* <Text>{currentSkill.item.name}</Text>
                        <Text style={styles.title}>Scorecard</Text>
                        <FlatList
                            data={currentSkill.item.subItems}
                            keyExtractor={(item) => item.id}
                            renderItem={(item) => <ScorecardListItem item={item} />}
                        /> */}
			</Fragment>
			{/* )} */}
		</View>
		// }
		// 	)}
		// </ChainContext.Consumer>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});

export default ChainsHomeScreen;

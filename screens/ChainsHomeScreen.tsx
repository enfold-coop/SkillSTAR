import React, { FC, useContext, useEffect, useState, Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChainNavProps } from "../navigation/ChainNavigation/types";
import { ScorecardList } from "../components/Chain/index";
import { ChainContext } from "../context/ChainProvider";

type Props = {
	skill?: {};
	route: ChainNavProps<"ChainsHomeScreen">;
	navigation: ChainNavProps<"ChainsHomeScreen">;
};

const ChainsHomeScreen: FC<Props> = (props) => {
	const { item } = props.route.params.skill;
	const { currentSkill } = useContext(ChainContext);
	const [skill, setSkill] = useState({});
	useEffect(() => {
		if (currentSkill != null) {
			setSkill(currentSkill);
		}
	});
	console.log("skill in ChainsHomeScreen");
	console.log(skill);

	return (
		<View style={styles.container}>
			{skill && (
				<Fragment>
					<Text>CHAINS HOME</Text>
					<Text>SOME TEXT</Text>
					<Text style={styles.title}>Scorecard</Text>
					<ScorecardList item={item} />
				</Fragment>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
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

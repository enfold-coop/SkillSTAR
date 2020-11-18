import React, { FC, Fragment, useContext, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ImageBackground,
} from "react-native";
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
			<ImageBackground
				source={require("../assets/images/energy-burst-dark.jpg")}
				resizeMode={'cover'}
				style={styles.bgImage}
			>
				<AppHeader name="Chains Home" />
				<View style={styles.titleWrap}>
					<Text style={styles.title}>Today's Session</Text>
					<Text style={styles.title}>Steps</Text>
				</View>
				{chainSteps && (
					<View style={styles.listContainer}>
						<SessionDataAside historicalData={{}} name={"Moxy"} />

						<FlatList
							style={styles.list}
							data={chainSteps}
							keyExtractor={(item) => item.step}
							renderItem={(item) => (
								<ScorecardListItem itemProps={item} />
							)}
						/>
					</View>
				)}
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 10,
		// paddingTop: 30,
		margin: 0,
		justifyContent: "flex-start",
		alignContent: "flex-end",
	},
	bgImage: {
		flex: 1,
		padding: 0,
		resizeMode: 'cover',
	},
	titleWrap: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingRight: 50,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		paddingLeft: 20,
		alignSelf: "flex-start",
	},
	separator: {
		marginVertical: 30,
		height: 1,
	},
	listContainer: {
		height: "80%",
		flexDirection: "row",
		padding: 5,
	},
	list: {
		margin: 5,
		marginBottom: 4,
		padding: 5,
		paddingBottom: 30,
		borderRadius: 5,
	},
});

export default ChainsHomeScreen;

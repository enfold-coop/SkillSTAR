import React, { FC, useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ImageBackground,
	TouchableOpacity,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {RootNavProps} from "../navigation/root_types";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import AppHeader from "../components/Header/AppHeader";
import SessionDataAside from "../components/Chain/SessionDataAside";
import CustomColors from '../styles/Colors';
import {globalStyles} from '../styles/Global';

//
let url = "../data/chain_steps.json";

type Props = {
  route: RootNavProps<"ChainsHomeScreen">;
  navigation: RootNavProps<"ChainsHomeScreen">;
};

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = (props) => {
	const navigation = useNavigation();

	let [chainSteps, setStepList] = useState();

	const apiCall = () => {
		let { chainSteps, user } = require(url);

		setStepList(chainSteps);
	};

	const navToProbeOrTraining = () => {
		navigation.navigate("PrepareMaterialsScreen");
	};

	useEffect(() => {
		apiCall();
	});

	return (
    <ImageBackground
      source={require("../assets/images/energy-burst-dark.jpg")}
      resizeMode={'cover'}
      style={styles.container}
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
							keyExtractor={(item) => item.step.toString()}
							renderItem={(item) => (
								<ScorecardListItem itemProps={item} />
							)}
						/>
					</View>
				)}
				<TouchableOpacity
					style={styles.startSessionBtn}
					onPress={() => {
						navToProbeOrTraining();
					}}
				>
					<Text style={styles.btnText}>Start the Chain</Text>
				</TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    justifyContent: "flex-start",
    alignContent: "flex-end",
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
	startSessionBtn: {
		flex: 1,
		paddingBottom: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
	btnText: {
		textAlign: "center",
		fontSize: 32,
		fontWeight: "600",
	},
});

export default ChainsHomeScreen;

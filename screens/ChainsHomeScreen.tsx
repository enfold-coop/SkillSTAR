import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
	FlatList,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { ApiService } from "../services/ApiService";
import * as Animatable from "react-native-animatable";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import SessionDataAside from "../components/Chain/SessionDataAside";
import AppHeader from "../components/Header/AppHeader";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import { useDeviceOrientation } from "@react-native-community/hooks";

type Props = {
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
};

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	const { portrait } = useDeviceOrientation();
	const [orient, setOrient] = useState(false);
	let api = new ApiService();

	useEffect(() => {
		setOrient(portrait);
	}, [portrait]);

	/**
	 * TODO:
	 * - determine if Probe or Training,
	 * - set Probe or Training state,
	 * - navigate to Probe form OR chain step
	 * - supply Probe OR Training data to this screen
	 */
	let [chainSteps, setStepList] = useState();
	const apiCall = () => {
		let { chainSteps, user } = require("../data/chain_steps.json");
		setStepList(chainSteps);
	};

	const navToProbeOrTraining = () => {
		console.log("go to PrepareMaterialsScreen");
		navigation.navigate("PrepareMaterialsScreen");
	};

	useEffect(() => {
		apiCall();
	});

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.jpg")}
			resizeMode={"cover"}
			style={styles.container}
		>
			<View
				style={portrait ? styles.container : styles.landscapeContainer}
			>
				<AppHeader name="Chains Home" />
				{chainSteps && (
					<View style={styles.listContainer}>
						<SessionDataAside
							historicalData={{}}
							name={"Moxy"}
							sessionNumber={1}
						/>
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
					style={[styles.startSessionBtn, { marginBottom: 0 }]}
					onPress={() => {
						navToProbeOrTraining();
					}}
				>
					<Animatable.Text
						animation="bounceIn"
						duration={2000}
						style={styles.btnText}
					>
						Start the Chain
					</Animatable.Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 0,
		justifyContent: "flex-start",
		alignContent: "flex-start",
		padding: 10,
		paddingBottom: 80,
	},
	landscapeContainer: {
		flex: 1,
		margin: 0,
		justifyContent: "flex-start",
		alignContent: "flex-start",
		padding: 10,
		paddingBottom: 80,
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
		height: "90%",
		flexDirection: "row",
		padding: 5,
	},
	list: {
		// height: "90%",
		margin: 5,
		marginBottom: 4,
		padding: 5,
		paddingBottom: 30,
		borderRadius: 5,
	},
	startSessionBtn: {
		width: "90%",
		alignSelf: "center",
		margin: 10,
		// marginBottom: 20,
		borderRadius: 10,
		paddingVertical: 10,
		backgroundColor: CustomColors.uva.orange,
	},
	btnText: {
		textAlign: "center",
		color: CustomColors.uva.white,
		fontSize: 32,
		fontWeight: "500",
	},
});

export default ChainsHomeScreen;

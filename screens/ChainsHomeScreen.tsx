import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
	FlatList,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import SessionDataAside from "../components/Chain/SessionDataAside";
import AppHeader from "../components/Header/AppHeader";
import { RootNavProps } from "../navigation/root_types";
import CustomColors from "../styles/Colors";

type Props = {
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
};

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = (props) => {
	const navigation = useNavigation();

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
			source={require("../assets/images/sunrise-muted.png")}
			resizeMode={"cover"}
			style={styles.container}
		>
			<AppHeader name="Chains Home" />
			<View style={styles.titleWrap}>
				{/* <Text style={styles.title}>Today's Session</Text>
				<Text style={styles.title}>Steps</Text> */}
			</View>
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
				style={styles.startSessionBtn}
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
		resizeMode: "cover",
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
		// paddingBottom: 20,
		margin: 20,
		// borderWidth: 1,
		borderRadius: 10,
		// borderColor: CustomColors.uva.white,
		backgroundColor: CustomColors.uva.orange,
		justifyContent: "center",
		alignItems: "center",
	},
	btnText: {
		textAlign: "center",
		color: CustomColors.uva.white,
		fontSize: 32,
		fontWeight: "500",
	},
});

export default ChainsHomeScreen;

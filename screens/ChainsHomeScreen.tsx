import React, { FC, useEffect, useState, useContext } from "react";
import {
	FlatList,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../context/ChainProvider";
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
	const state = useContext(store);
	const { dispatch } = state;
	const navigation = useNavigation();
	let api = new ApiService();
	const { portrait } = useDeviceOrientation();
	const [orient, setOrient] = useState(false);
	let [chainSteps, setStepList] = useState();
	let [session, setSession] = useState();

	useEffect(() => {
		dispatch({ type: "addSession" });
		// setStepList()
		getSteps();
		apiCall();
	}, []);

	const getSteps = async () => {
		const s = await api.getChainSteps();
		// console.log(s);
		if (s != undefined) {
			setStepList(s);
		}
	};

	useEffect(() => {
		setOrient(portrait);
	}, [portrait]);

	const apiCall = async () => {
		const participantJson = await AsyncStorage.getItem(
			"selected_participant"
		);

		if (participantJson) {
			const participant = JSON.parse(participantJson);

			if (participant && participant.hasOwnProperty("id")) {
				const _id = await api.getChainQuestionnaireId(participant.id);
				const data = await api.getChainData(_id);

				setProbeOrTraining(data?.sessions);
			}
		}
		// let { chainSteps, user } = require("../data/chain_steps.json");
		// setStepList(chainSteps);
	};

	const setProbeOrTraining = (sessions: []) => {
		if (!sessions.length) {
			// set probe
		} else if (sessions.length && sessions[sessions.length - 1]) {
			if (sessions[sessions.length - 1].session_type === "probe") {
				// set probe
			} else if (
				sessions[sessions.length - 1].session_type === "training"
			) {
				// set training session
			} else {
				console.error("Issue with session data");
			}
		} else {
			console.error("Trouble getting session data");
		}
	};

	const setPromptLevels = (session: {}) => {
		//
	};

	const navToProbeOrTraining = () => {
		console.log("go to PrepareMaterialsScreen");
		navigation.navigate("PrepareMaterialsScreen");
	};

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
							keyExtractor={(item) => item.instruction.toString()}
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

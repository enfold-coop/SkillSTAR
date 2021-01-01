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
import {
	PROBE_INSTRUCTIONS,
	START_PROBE_SESSION_BTN,
	START_TRAINING_SESSION_BTN,
} from "../components/Chain/chainshome_text_assets/chainshome_text";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { LOGIN_ERROR } from "../constants/action_types";

type Props = {
	route: RootNavProps<"ChainsHomeScreen">;
	navigation: RootNavProps<"ChainsHomeScreen">;
};

// DEV USE ONLY (mock value)
const REQUIRED_PROBE_TOTAL = 3;
const COMPLETED_PROBE_SESSIONS = 2;

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = (props) => {
	const context = useContext(store);

	const { dispatch } = context;

	const navigation = useNavigation();
	let api = new ApiService();
	const { portrait } = useDeviceOrientation();
	const [orient, setOrient] = useState(false);
	const [btnText, setBtnText] = useState("Start Session");
	const [asideContent, setAsideContents] = useState("");
	const [chainSteps, setStepList] = useState();
	const [session, setSession] = useState();
	const [userData, setUserData] = useState();
	const [sessionNmbr, setSessionNmbr] = useState(0);
	const [type, setType] = useState("type");

	useEffect(() => {
		// setStepList()
		getSteps();
		apiCall();
	}, []);

	useEffect(() => {});

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
		// console.log(participantJson);
		if (participantJson) {
			const participant = JSON.parse(participantJson);
			// console.log(participant.id);

			if (participant && participant.hasOwnProperty("id")) {
				const _id = await api.getChainQuestionnaireId(participant.id);
				const data = await api.getChainData(_id);
				setUserData(data);

				setSession(data?.sessions[data.sessions.length - 1]);
				dispatch({ type: "addUserData", payload: data });
				dispatch({ type: "addSessionType", payload: data });
				setProbeOrTraining(data?.sessions);
				setType(data.sessions[data.sessions.length - 1].session_type);
				setSessionTypeAndNmbr(data);
				setElemsValues();
			}
		}
		// let { chainSteps, user } = require("../data/chain_steps.json");
		// setStepList(chainSteps);
	};

	/**
	 * UTIL function (can be moved to another file)
	 */
	const setSessionTypeAndNmbr = (d: any) => {
		let lastSess = d.sessions.length
			? d.sessions[d.sessions.length - 1]
			: null;
		let sessNmbr = 0;
		if (lastSess === null) {
			setType("probe");
			sessNmbr = 1;
		}
		if (lastSess) {
			if (lastSess.session_type === "training" && !lastSess.completed) {
				setType("training");
				sessNmbr = d.sessions.length + 1;
			}
			if (lastSess.session_type === "probe" && !lastSess.completed) {
				setType("probe");
				sessNmbr = d.sessions.length + 1;
			}
		}
		setSessionNmbr(sessNmbr);
	};

	const setElemsValues = () => {
		if (type === "probe") {
			setBtnText(START_PROBE_SESSION_BTN);
			setAsideContents(PROBE_INSTRUCTIONS);
		}
		if (type === "training") {
			setBtnText(START_TRAINING_SESSION_BTN);
		}
	};

	const setProbeOrTraining = (sessions: []) => {};

	const navToProbeOrTraining = () => {
		let t = () => type;
		navigation.navigate("PrepareMaterialsScreen", {
			sessionType: t(),
		});
	};

	const determineSessionStepData = (index: number) => {};

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
							asideContent={asideContent}
							sessionNumber={sessionNmbr}
						/>
						<FlatList
							style={styles.list}
							data={chainSteps}
							keyExtractor={(item) => item.instruction.toString()}
							renderItem={(item, index) => (
								<ScorecardListItem
									itemProps={item}
									sessionStepData={() => {
										return {};
									}}
								/>
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
						{btnText}
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

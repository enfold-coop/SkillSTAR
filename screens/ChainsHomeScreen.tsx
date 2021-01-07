import {useDeviceOrientation} from "@react-native-community/hooks";
import {useNavigation} from "@react-navigation/native";
import React, {FC, useContext, useEffect, useState} from "react";
import {FlatList, ImageBackground, StyleSheet, TouchableOpacity, View,} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  PROBE_INSTRUCTIONS,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
} from "../components/Chain/chainshome_text_assets/chainshome_text";
import ScorecardListItem from "../components/Chain/ScorecardListItem";
import SessionDataAside from "../components/Chain/SessionDataAside";
import AppHeader from "../components/Header/AppHeader";
import {store} from "../context/ChainProvider";
import {ADD_CURR_SESSION_NMBR, ADD_SESSION_TYPE, ADD_USER_DATA,} from "../context/constants/actions";
import {RootNavProps} from "../navigation/root_types";
import {ApiService} from "../services/ApiService";
import CustomColors from "../styles/Colors";
import {ChainQuestionnaire} from '../types/CHAIN/ChainQuestionnaire';
import {ChainSession, ChainSessionType} from '../types/CHAIN/ChainSession';
import {ChainStep} from '../types/CHAIN/ChainStep';

type Props = {
  route: RootNavProps<"ChainsHomeScreen">;
  navigation: RootNavProps<"ChainsHomeScreen">;
};

// DEV USE ONLY (mock value)
const REQUIRED_PROBE_TOTAL = 3;
const COMPLETED_PROBE_SESSIONS = 2;

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = (props) => {
  const [asideContent, setAsideContents] = useState("");
  const [btnText, setBtnText] = useState("Start Session");
  const [chainSteps, setStepList] = useState<ChainStep[]>();
  const [orient, setOrient] = useState(false);
  const [session, setSession] = useState<ChainSession>();
  const [sessionNmbr, setSessionNmbr] = useState<number>(0);
  const [type, setType] = useState<string>("type");
  const [userData, setUserData] = useState<ChainQuestionnaire>();
  const api = new ApiService();
  const context = useContext(store);
  const navigation = useNavigation();
  const {dispatch} = context;
  const {portrait} = useDeviceOrientation();

  useEffect(() => {
    getSteps();
    apiCall();
    setOrient(portrait);
  }, [portrait]);

  const getSteps = async () => {
    const s = await api.getChainSteps() as ChainStep[];
    if (s != undefined) {
      setStepList(s);
    }
  };

  const apiCall = async () => {
    const chainData = await api.getChainDataForSelectedParticipant() as ChainQuestionnaire;

    if (chainData && chainData.sessions && (chainData.sessions.length > 0)) {
      setUserData(chainData);
      dispatch({type: ADD_USER_DATA, payload: chainData});
      setType(chainData.sessions[chainData.sessions.length - 1].session_type as string);
      dispatch({
        type: ADD_SESSION_TYPE,
        payload: chainData.sessions[chainData.sessions.length - 1].session_type,
      });
      setSessionTypeAndNmbr(chainData);
      setSession(chainData?.sessions[chainData.sessions.length - 1]);
      setElemsValues();
    } else {
      // Create chain data for current participant.
      const participant = await api.getSelectedParticipant();
      if (participant) {
        const newData: ChainQuestionnaire = {
          participant_id: participant.id, sessions: [{
            session_type: ChainSessionType.probe,
            step_attempts: [],
          }]
        };
        const newDbData = await api.addChainData(newData);
        if (newDbData) {
          setUserData(newDbData);
        }
      }
    }

    // let { chainSteps, user } = require("../data/chain_steps.json");
    // setStepList(chainSteps);
  };

  /**
   * Mastery Algorithm
   * UTIL function (can be moved to another file)
   *
   * Params: chainData = the entire ChainQuestionnaire
   * Returns one of the following:
   * - An empty probe session, if the user has no attempted sessions yet
   * - The next session the participant should be attempting, if there is one.
   * - An empty probe session, if there are none left to attempt (???)
   */
  const setSessionTypeAndNmbr = (chainData: ChainQuestionnaire) => {
    // Some of the sessions will be future/not attempted sessions.
    // We want the next session the participant should be attempting.
    const numSessions = chainData.sessions ? chainData.sessions.length : 0;

    // If there are no sessions, return a probe session.

    // Otherwise, return the first un-attempted session OR the last attempted session, if there are no un-attempted sessions?

    const lastSess = (numSessions > 0) ? chainData.sessions[numSessions - 1] : null;

    // !! overriding type for dev purposes
    // lastSess.session_type = ChainSessionType.training;

    if (lastSess === null) {
      setSessionNmbr(1);
      setType("probe");

      // Session count (how many sessions attempted)
      // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
      dispatch({type: ADD_CURR_SESSION_NMBR, payload: 1});

      // chainData.sessions[i].session_type
      dispatch({type: ADD_SESSION_TYPE, payload: "probe"});
    }
    if (lastSess) {
      if (lastSess.session_type === ChainSessionType.training && !lastSess.completed) {
        setType("training");
        setSessionNmbr(chainData.sessions.length + 1);
        dispatch({type: ADD_CURR_SESSION_NMBR, payload: sessionNmbr});
        dispatch({type: ADD_SESSION_TYPE, payload: "training"});
        setBtnText(START_TRAINING_SESSION_BTN);
      }
      if (lastSess.session_type === ChainSessionType.probe && !lastSess.completed) {
        setType("probe");
        setSessionNmbr(chainData.sessions.length + 1);
        dispatch({type: ADD_CURR_SESSION_NMBR, payload: sessionNmbr});
        dispatch({type: ADD_SESSION_TYPE, payload: "probe"});
        setBtnText(START_PROBE_SESSION_BTN);
        setAsideContents(PROBE_INSTRUCTIONS);
      }
    }
  };

  const setElemsValues = () => {
    if (type === "probe") {
    }
    if (type === "training") {
    }
  };

  const navToProbeOrTraining = () => {
    let t = () => type;
    navigation.navigate("PrepareMaterialsScreen", {
      sessionType: t(),
    });
  };

  const determineSessionStepData = (index: number) => {
  };

  const key = userData ? userData.participant_id : Math.floor(Math.random() * 10000);

  return (
    <ImageBackground
      key={"chains_home_sreen_" + key}
      source={require("../assets/images/sunrise-muted.jpg")}
      resizeMode={"cover"}
      style={styles.bkgrdImage}
    >
      <View
        style={portrait ? styles.container : styles.landscapeContainer}
      >
        <AppHeader name="Chains Home"/>
        {chainSteps && (
          <View style={styles.listContainer}>
            <SessionDataAside
              asideContent={asideContent}
              sessionNumber={sessionNmbr}
              sessionSteps={chainSteps}
            />
            <FlatList
              style={styles.list}
              data={chainSteps}
              keyExtractor={(item) => item.instruction.toString()}
              renderItem={item => (
                <ScorecardListItem itemProps={item}/>
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.startSessionBtn, {marginBottom: 0}]}
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
  bkgrdImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 0,
    justifyContent: "space-between",
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
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255,0.4)",
    padding: 5,
    margin: 5,
    marginTop: 12,
  },
  list: {
    margin: 5,
    marginBottom: 4,
    padding: 5,
    paddingBottom: 30,
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

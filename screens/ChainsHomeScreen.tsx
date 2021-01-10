import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  PROBE_INSTRUCTIONS,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
} from '../components/Chain/chainshome_text_assets/chainshome_text';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import SessionDataAside from '../components/Chain/SessionDataAside';
import AppHeader from '../components/Header/AppHeader';
import { useChainContext } from '../context/ChainProvider';
import { RootNavProps } from '../navigation/root_types';
import { ApiService } from '../services/ApiService';
import { MasteryAlgo } from '../services/MasteryAlgo';
import { MasteryService } from '../services/MasteryService';
import CustomColors from '../styles/Colors';
import { ChainSession, ChainSessionType } from '../types/CHAIN/ChainSession';
import { ChainData, SkillstarChain } from '../types/CHAIN/SkillstarChain';
import { ChainStepStatus, StepAttempt } from '../types/CHAIN/StepAttempt';

type Props = {
  route: RootNavProps<'ChainsHomeScreen'>;
  navigation: RootNavProps<'ChainsHomeScreen'>;
};

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = props => {
  const [asideContent, setAsideContents] = useState('');
  const [btnText, setBtnText] = useState('Start Session');
  const [orient, setOrient] = useState(false);
  const [sessionNmbr, setSessionNmbr] = useState<number>(0);
  const [type, setType] = useState<string>('type');
  const api = new ApiService();
  const [contextState, contextDispatch] = useChainContext();
  const navigation = useNavigation();
  const { portrait } = useDeviceOrientation();

  const callAlgo = (chainData: SkillstarChain) => {
    console.log('*** callAlgo ***');
    MasteryAlgo.determineStepAttemptPromptLevel(chainData);
  };

  useEffect(() => {
    console.log('*** useEffect 1 ***');
    let isCancelled = false;

    if (contextState.chainData != undefined && !isCancelled) {
      // callAlgo(chainData);
      // TODO: Ask the Mastery Service for...
      //  - the current session
      //  - MasteryInfo for each step

      // For now, just use the last ChainSession available in the ChainData.
      if (contextState.chainData.sessions && contextState.chainData.sessions.length > 0) {
        contextDispatch({
          type: 'session',
          payload: contextState.chainData.sessions[contextState.chainData.sessions.length],
        });
        setSessionNmbr(contextState.chainData.sessions.length);
      } else if (contextState.chainSteps && contextState.chainSteps.length > 0) {
        const newChainSession: ChainSession = {
          step_attempts: contextState.chainSteps.map(s => {
            return {
              chain_step_id: s.id,
              chain_step: s,
              completed: false,
              status: ChainStepStatus.not_complete,
            } as StepAttempt;
          }),
        };
        contextDispatch({ type: 'session', payload: newChainSession });
        setSessionNmbr(1);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [contextState.chainData]);

  useEffect(() => {
    console.log('*** useEffect 2 ***');
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true; // Block while loading

      if (contextState.participant) {
        console.log('contextState.participant =', contextState.participant.name);
        const newData: SkillstarChain = {
          participant_id: contextState.participant.id,
          sessions: [
            {
              session_type: ChainSessionType.probe,
              step_attempts: [],
            },
          ],
        };
        const newDbData = await api.addChainData(newData);
        if (!isCancelled && newDbData) {
          const newChainData = new ChainData(newDbData);
          contextDispatch({ type: 'chainData', payload: newChainData });
        }
      }
    };

    if (!isLoading) {
      _load().then(() => {
        isLoading = false;
        if (!isCancelled) {
          setOrient(portrait);
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [portrait]);

  /**
   * Mastery Algorithm
   * UTIL function (can be moved to another file)
   *
   * Params: chainData = the entire SkillstarChain
   * Returns one of the following:
   * - An empty probe session, if the user has no attempted sessions yet
   * - The next session the participant should be attempting, if there is one.
   * - An empty probe session, if there are none left to attempt (???)
   */
  const setSessionTypeAndNmbr = (chainData: SkillstarChain) => {
    console.log('*** setSessionTypeAndNmbr ***');
    console.log(chainData.sessions.length);

    // Some of the sessions will be future/not attempted sessions.
    // We want the next session the participant should be attempting.
    const numSessions = chainData.sessions ? chainData.sessions.length : 0;

    // If there are no sessions, return a probe session.

    // Otherwise, return the first un-attempted session OR the last attempted session, if there are no un-attempted sessions?

    const lastSess = numSessions > 0 ? chainData.sessions[numSessions - 1] : null;
    // console.log(lastSess);

    // !! overriding type for dev purposes
    // lastSess.session_type = ChainSessionType.training;

    if (lastSess === null) {
      setSessionNmbr(1);
      setType('probe');

      // Session count (how many sessions attempted)
      // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
      contextDispatch({ type: 'sessionNumber', payload: 1 });

      // chainData.sessions[i].session_type
      contextDispatch({ type: 'sessionType', payload: 'probe' });
    }
    if (lastSess) {
      if (lastSess.session_type === ChainSessionType.training) {
        setType('training');
        // console.log(chainData.sessions.length + 1);

        setSessionNmbr(chainData.sessions.length + 1);
        contextDispatch({ type: 'sessionNumber', payload: sessionNmbr });
        contextDispatch({ type: 'sessionType', payload: 'training' });
        setBtnText(START_TRAINING_SESSION_BTN);
      }
      if (lastSess.session_type === ChainSessionType.probe) {
        // console.log(chainData.sessions.length + 1);
        setType('probe');
        setSessionNmbr(chainData.sessions.length + 1);
        contextDispatch({ type: 'sessionNumber', payload: sessionNmbr });
        contextDispatch({ type: 'sessionType', payload: 'probe' });
        setBtnText(START_PROBE_SESSION_BTN);
        setAsideContents(PROBE_INSTRUCTIONS);
      }
    }
  };

  const navToProbeOrTraining = () => {
    navigation.navigate('PrepareMaterialsScreen', { chainSession: contextState.session });
  };

  const key = contextState.chainData ? contextState.chainData.participant_id : -1;
  const { chainData, chainSteps, session } = contextState;
  const chainSessionId = session && session.id !== undefined ? session.id : -1;

  return (
    <ImageBackground
      key={'chains_home_sreen_' + key}
      source={require('../assets/images/sunrise-muted.jpg')}
      resizeMode={'cover'}
      style={styles.bkgrdImage}
    >
      <View style={portrait ? styles.container : styles.landscapeContainer}>
        <AppHeader name='Chains Home' />
        {chainSteps && chainData !== undefined && (
          <View style={styles.listContainer}>
            <SessionDataAside asideContent={asideContent} />
            <FlatList
              style={styles.list}
              data={chainSteps}
              keyExtractor={chainStep => 'scorecard_chain_step_' + chainStep.id.toString()}
              renderItem={({ item, index, separators }) => (
                <ScorecardListItem
                  chainStep={item}
                  stepAttempt={chainData.getStep(chainSessionId, item.id)}
                  masteryInfo={MasteryService.getMasteryInfoForStep(chainData, item.id)}
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
          <Animatable.Text animation='bounceIn' duration={2000} style={styles.btnText}>
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
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    padding: 10,
    paddingBottom: 80,
  },
  landscapeContainer: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 10,
    paddingBottom: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
  listContainer: {
    height: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255,0.4)',
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
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    // marginBottom: 20,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: CustomColors.uva.orange,
  },
  btnText: {
    textAlign: 'center',
    color: CustomColors.uva.white,
    fontSize: 32,
    fontWeight: '500',
  },
});

export default ChainsHomeScreen;

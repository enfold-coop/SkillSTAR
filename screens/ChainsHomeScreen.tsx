import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, Text } from 'react-native-paper';
import {
  PROBE_INSTRUCTIONS,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
} from '../components/Chain/chainshome_text_assets/chainshome_text';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import SessionDataAside from '../components/Chain/SessionDataAside';
import AppHeader from '../components/Header/AppHeader';
import { BackgroundImages } from '../data/images';
import { ApiService } from '../services/ApiService';
import { MasteryAlgo } from '../services/MasteryAlgo';
import CustomColors from '../styles/Colors';
import {
  ChainSession,
  ChainSessionType,
  ChainSessionTypeLabels,
} from '../types/CHAIN/ChainSession';
import { ChainStep } from '../types/CHAIN/ChainStep';
import { MasteryInfo } from '../types/CHAIN/MasteryLevel';
import { ChainData, SkillstarChain } from '../types/CHAIN/SkillstarChain';
import { ChainStepStatus, StepAttempt } from '../types/CHAIN/StepAttempt';
import { Participant } from '../types/User';

// Chain Home Screen
const ChainsHomeScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const [asideContent, setAsideContents] = useState('');
  const [btnText, setBtnText] = useState<string>();
  const [orient, setOrient] = useState(false);
  const [sessionNumber, setSessionNumber] = useState<number>(0);
  const [type, setType] = useState<ChainSessionType>();
  const [typeLabel, setTypeLabel] = useState<ChainSessionTypeLabels>();
  const { portrait } = useDeviceOrientation();
  const [participant, setParticipant] = useState<Participant>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainData, setChainData] = useState<ChainData>();
  const [session, setSession] = useState<ChainSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const callAlgo = (chainData: SkillstarChain) => {
    MasteryAlgo.init(chainData);
  };

  /** LIFECYCLE METHODS */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (!participant) {
          console.log('*** ChainsHomeScreen.tsx > useEffect > _load > loading participant... ***');
          const contextParticipant = await ApiService.contextState('participant');
          if (!isCancelled && contextParticipant) {
            setParticipant(contextParticipant as Participant);
          } else {
            const dbParticipant = await ApiService.getSelectedParticipant();
            if (!isCancelled && dbParticipant) {
              setParticipant(dbParticipant as Participant);
            }
          }
        }

        if (!chainSteps) {
          console.log('*** ChainsHomeScreen.tsx > useEffect > _load > loading chainSteps... ***');
          const contextChainSteps = await ApiService.contextState('chainSteps');
          if (!isCancelled && contextChainSteps) {
            setChainSteps(contextChainSteps as ChainStep[]);
          } else {
            const dbChainSteps = await ApiService.getChainSteps();
            if (!isCancelled && dbChainSteps) {
              setChainSteps(dbChainSteps);
            }
          }
        }

        if (!chainData) {
          console.log('*** ChainsHomeScreen.tsx > useEffect > _load > loading chainSteps... ***');
          const contextChainData = await ApiService.contextState('chainData');
          if (!isCancelled && contextChainData) {
            setChainData(contextChainData as ChainData);
          } else {
            const dbChainData = await ApiService.getChainDataForSelectedParticipant();
            if (!isCancelled && dbChainData) {
              setChainData(new ChainData(dbChainData));
            }
          }
        }
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    // TODO: Replace this with the real mastery algorithm
    const _setSessionTypeAndNmbr = async () => {
      console.log('*** _setSessionTypeAndNmbr ***');
      if (!chainData) {
        return;
      }

      console.log('chainData.sessions.length', chainData.sessions.length);

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
        setSessionNumber(1);
        setType(ChainSessionType.probe);
        setTypeLabel(ChainSessionTypeLabels.probe);

        // Session count (how many sessions attempted)
        // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
        await ApiService.contextDispatch({ type: 'sessionNumber', payload: 1 });

        // chainData.sessions[i].session_type
        await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
      }
      if (lastSess) {
        // TODO: Hook this up to the real session type
        // if (lastSess.session_type === ChainSessionType.training) {
        // For now, just base the session type on whether the session number is even or odd.
        const isOdd = sessionNumber % 2 === 1;
        if (isOdd) {
          setType(ChainSessionType.training);
          setTypeLabel(ChainSessionTypeLabels.training);
          // console.log(chainData.sessions.length + 1);

          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'training' });
          setBtnText(START_TRAINING_SESSION_BTN);
        } else {
          // console.log(chainData.sessions.length + 1);
          setType(ChainSessionType.probe);
          setTypeLabel(ChainSessionTypeLabels.probe);
          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
          setBtnText(START_PROBE_SESSION_BTN);
          setAsideContents(PROBE_INSTRUCTIONS);
        }
      }
    };

    _load().then(() => {
      _setSessionTypeAndNmbr();
    });

    return () => {
      isCancelled = true;
    };
  }, [isLoading]);

  useEffect(() => {
    let isCancelled = false;
    const _load = async () => {
      if (chainData != undefined && !isCancelled) {
        callAlgo(chainData);

        if (chainData.sessions && chainData.sessions.length > 0) {
          const lastSession = chainData.sessions[chainData.sessions.length - 1];
          await ApiService.contextDispatch({
            type: 'session',
            payload: lastSession,
          });

          if (!isCancelled) {
            setSession(lastSession);
            setSessionNumber(chainData.sessions.length);
          }
        } else if (chainSteps && chainSteps.length > 0) {
          //   console.log('Creating a new session.');
          const newChainSession: ChainSession = {
            session_type: ChainSessionType.training,
            date: new Date(),
            completed: false,
            step_attempts: chainSteps.map(s => {
              return {
                chain_step_id: s.id,
                chain_step: s,
                completed: false,
                status: ChainStepStatus.not_complete,
              } as StepAttempt;
            }),
          };

          if (!isCancelled) {
            setSession(newChainSession);
          }
          const newChainData = new ChainData(chainData);
          newChainData.sessions.push(newChainSession);
          const dbChainData = await ApiService.upsertChainData(newChainData);

          if (dbChainData && !isCancelled) {
            setChainData(new ChainData(dbChainData));
          }
          setSessionNumber(1);
        }
      }
    };

    _load();
    return () => {
      isCancelled = true;
    };
  }, [chainData]);

  useEffect(() => {
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true; // Block while loading

      if (participant && (!chainData || (chainData && chainData.id === undefined))) {
        // Check that the current participant has chain data. If not, add it.
        const dbData = await ApiService.getChainDataForSelectedParticipant();

        if (!dbData || (dbData && dbData.id === undefined)) {
          const newData: SkillstarChain = {
            participant_id: participant.id,
            sessions: [
              {
                session_type: ChainSessionType.probe,
                step_attempts: [],
              },
            ],
          };

          try {
            const newDbData = await ApiService.addChainData(newData);
            if (!isCancelled && newDbData) {
              const newChainData = new ChainData(newDbData);
              console.log('newChainData added for participant');
              await ApiService.contextDispatch({ type: 'chainData', payload: newChainData });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    // TODO: Replace this with the real mastery algorithm
    const _setSessionTypeAndNmbr = async () => {
      console.log('*** _setSessionTypeAndNmbr ***');
      if (!chainData) {
        return;
      }
      const numSessions = chainData.sessions ? chainData.sessions.length : 0;
      const lastSess = numSessions > 0 ? chainData.sessions[numSessions - 1] : null;

      if (lastSess === null) {
        setSessionNumber(1);
        setType(ChainSessionType.probe);

        // Session count (how many sessions attempted)
        // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
        await ApiService.contextDispatch({ type: 'sessionNumber', payload: 1 });

        // chainData.sessions[i].session_type
        await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
      }
      if (lastSess) {
        if (MasteryAlgo.prevSessionType === ChainSessionType.training) {
          setType(ChainSessionType.training);
          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'training' });
          setBtnText(START_TRAINING_SESSION_BTN);
        }
        if (MasteryAlgo.prevSessionType === ChainSessionType.probe) {
          setType(ChainSessionType.probe);
          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
          setBtnText(START_PROBE_SESSION_BTN);
          setAsideContents(PROBE_INSTRUCTIONS);
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
  /** END LIFECYCLE METHODS */

  const navToProbeOrTraining = () => {
    navigation.navigate('PrepareMaterialsScreen', { chainSession: session });
  };

  const key = chainData ? chainData.participant_id : -1;
  const chainSessionId = session && session.id !== undefined ? session.id : -1;

  function _getMasteryInfo(chainData: ChainData, chainStepId: number) {
    // return MasteryService.getMasteryInfoForStep(chainData, chainStepId);
    return { chainStepId: chainStepId, stepStatus: ChainStepStatus.not_complete } as MasteryInfo;
  }

  return (
    <ImageBackground
      key={'chains_home_sreen_' + key}
      source={BackgroundImages.sunrise_muted}
      resizeMode={'cover'}
      style={styles.bkgrdImage}
    >
      <View style={portrait ? styles.container : styles.landscapeContainer}>
        <AppHeader
          name='Chains Home'
          onParticipantChange={() => {
            setIsLoading(true);
          }}
        />
        {!isLoading && chainSteps && chainData ? (
          <View style={styles.listContainer}>
            <SessionDataAside asideContent={asideContent} />
            {chainSteps && (
              <ScrollView style={styles.list}>
                {chainSteps.map(chainStep => {
                  return chainData ? (
                    <ScorecardListItem
                      key={'scorecard_list_chain_step_' + chainStep.id}
                      chainStep={chainStep}
                      stepAttempt={chainData.getStep(chainSessionId, chainStep.id)}
                      masteryInfo={_getMasteryInfo(chainData, chainStep.id)}
                    />
                  ) : (
                    <Text>Error</Text>
                  );
                })}
              </ScrollView>
            )}
          </View>
        ) : (
          <View>
            <ActivityIndicator animating={true} color={CustomColors.uva.mountain} />
          </View>
        )}
        <TouchableOpacity
          style={[styles.startSessionBtn, { marginBottom: 0 }]}
          onPress={navToProbeOrTraining}
        >
          <Animatable.Text animation='bounceIn' duration={2000} style={styles.btnText}>
            Start {typeLabel} Session
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
  listItem: {
    height: 60,
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

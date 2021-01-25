import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text } from 'react-native-paper';
import {
  BOOSTER_INSTRUCTIONS,
  PROBE_INSTRUCTIONS,
  START_BOOSTER_SESSION_BTN,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
  TRAINING_INSTRUCTIONS,
} from '../components/Chain/chainshome_text_assets/chainshome_text';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import SessionDataAside from '../components/Chain/SessionDataAside';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { useChainMasteryDispatch } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import { ChainMastery } from '../services/ChainMastery';
import CustomColors from '../styles/Colors';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { Participant } from '../types/User';

// Chain Home Screen
const ChainsHomeScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [asideContent, setAsideContents] = useState('');
  const [btnText, setBtnText] = useState<string>('');
  const { portrait } = useDeviceOrientation();
  const [participant, setParticipant] = useState<Participant>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainData, setChainData] = useState<ChainData>();
  const [draftChainSession, setDraftChainSession] = useState<ChainSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chainMastery, setChainMastery] = useState<ChainMastery>();
  const chainMasteryDispatch = useChainMasteryDispatch();

  /** LIFECYCLE METHODS */
  // Runs on load.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        // Load selected participant
        if (!participant) {
          await ApiService.load<Participant>(
            'participant',
            ApiService.getSelectedParticipant,
            setParticipant,
            isCancelled,
          );
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Runs when participant is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        // Load chain steps
        if (!chainSteps) {
          await ApiService.load<ChainStep[]>('chainSteps', ApiService.getChainSteps, setChainSteps, isCancelled);
        }

        // Load chain data
        if (!chainData) {
          await ApiService.load<ChainData>(
            'chainData',
            ApiService.getChainDataForSelectedParticipant,
            setChainData,
            isCancelled,
          );
        }
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [participant]);

  // Runs when chainData is updated.
  useEffect(() => {
    let isCancelled = false;
    const _load = async () => {
      if (chainSteps && chainSteps.length > 0 && chainData && !isCancelled) {
        const mastery = new ChainMastery(chainSteps, chainData);
        setChainMastery(mastery);
        chainMasteryDispatch({ type: 'chainMastery', payload: mastery });
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [chainData]);

  // Runs when chainMastery is updated.
  useEffect(() => {
    let isCancelled = false;
    const _load = async () => {
      if (!isCancelled && chainMastery && chainMastery.chainData && chainMastery.draftSession) {
        setDraftChainSession(chainMastery.draftSession);

        await ApiService.contextDispatch({
          type: 'sessionNumber',
          payload: chainMastery.chainData.sessions.length,
        });

        await ApiService.contextDispatch({
          type: 'session',
          payload: chainMastery.draftSession,
        });

        await ApiService.contextDispatch({
          type: 'chainData',
          payload: chainMastery.chainData,
        });
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [chainMastery]);

  // Runs when draft chain session is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && draftChainSession && draftChainSession.session_type) {
        console.log('draftChainSession.session_type', draftChainSession.session_type);
        await ApiService.contextDispatch({ type: 'sessionType', payload: draftChainSession.session_type });

        if (!isCancelled) {
          if (draftChainSession.session_type === ChainSessionType.training) {
            setBtnText(START_TRAINING_SESSION_BTN);
            setAsideContents(TRAINING_INSTRUCTIONS);
          } else if (draftChainSession.session_type === ChainSessionType.probe) {
            setBtnText(START_PROBE_SESSION_BTN);
            setAsideContents(PROBE_INSTRUCTIONS);
          } else if (draftChainSession.session_type === ChainSessionType.booster) {
            setBtnText(START_BOOSTER_SESSION_BTN);
            setAsideContents(BOOSTER_INSTRUCTIONS);
          }
        }
      } else {
        console.log('draftChainSession', draftChainSession);
        if (draftChainSession) {
          console.log('draftChainSession.session_type', draftChainSession.session_type);
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [draftChainSession]);

  // Runs when participant and/or device orientation is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (participant) {
        // Check that the current participant has chain data. If not, add it.
        const dbData = await ApiService.getChainDataForSelectedParticipant();

        if (!dbData || (dbData && dbData.id === undefined)) {
          const newData: SkillstarChain = {
            participant_id: participant.id,
            sessions: [],
          };

          try {
            const newDbData = await ApiService.addChainData(newData);
            if (!isCancelled && newDbData) {
              const newChainData = new ChainData(newDbData);
              await ApiService.contextDispatch({ type: 'chainData', payload: newChainData });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    if (!isCancelled && !isLoading) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [participant, portrait]);
  /** END LIFECYCLE METHODS */

  const navToProbeOrTraining = () => {
    navigation.navigate('PrepareMaterialsScreen');
  };

  const key = chainData ? chainData.participant_id : -1;
  const chainSessionId = draftChainSession && draftChainSession.id !== undefined ? draftChainSession.id : -1;

  return (
    <ImageBackground
      key={'chains_home_sreen_' + key}
      source={ImageAssets.sunrise_muted}
      resizeMode={'cover'}
      style={styles.bkgrdImage}
    >
      <View style={portrait ? styles.container : styles.landscapeContainer}>
        <AppHeader
          name={'Chains Home'}
          onParticipantChange={selectedParticipant => {
            setIsLoading(true);
            setParticipant(selectedParticipant);
          }}
        />
        {!isLoading && chainSteps && chainData && chainMastery && chainMastery.draftSession ? (
          <View style={styles.listContainer}>
            <SessionDataAside asideContent={asideContent} />
            {chainSteps && (
              <ScrollView style={styles.list}>
                {chainMastery.draftSession.step_attempts.map(stepAttempt => {
                  const chainStep = stepAttempt.chain_step || chainSteps.find(s => s.id === stepAttempt.chain_step_id);
                  return chainMastery && chainStep ? (
                    <ScorecardListItem
                      key={'scorecard_list_chain_step_' + stepAttempt.chain_step_id}
                      chainStep={chainStep}
                      stepAttempt={stepAttempt}
                      masteryInfo={chainMastery.masteryInfoMap[stepAttempt.chain_step_id]}
                    />
                  ) : (
                    <Text>{`Error`}</Text>
                  );
                })}
              </ScrollView>
            )}
          </View>
        ) : (
          <Loading />
        )}
        {btnText ? (
          <TouchableOpacity style={[styles.startSessionBtn, { marginBottom: 0 }]} onPress={navToProbeOrTraining}>
            <Animatable.Text animation={'bounceIn'} duration={2000} style={styles.btnText}>
              {btnText}
            </Animatable.Text>
          </TouchableOpacity>
        ) : (
          <Loading />
        )}
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

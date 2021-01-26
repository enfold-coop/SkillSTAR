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
import { useChainMasteryDispatch, useChainMasteryState } from '../context/ChainMasteryProvider';
import { useParticipantState } from '../context/ParticipantProvider';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSessionType } from '../types/chain/ChainSession';

// Chain Home Screen
const ChainsHomeScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [asideContent, setAsideContents] = useState('');
  const [btnText, setBtnText] = useState<string>('');
  const { portrait } = useDeviceOrientation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const participantState = useParticipantState();
  const chainMasteryState = useChainMasteryState();
  const chainMasteryDispatch = useChainMasteryDispatch();

  /** LIFECYCLE METHODS */
  // Runs when draft chain session is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (
        !isCancelled &&
        chainMasteryState &&
        chainMasteryState.chainMastery &&
        chainMasteryState.chainMastery.draftSession &&
        chainMasteryState.chainMastery.draftSession.session_type
      ) {
        console.log(
          'chainMasteryState.chainMastery.draftSession.session_type',
          chainMasteryState.chainMastery.draftSession.session_type,
        );
        const draftSessionType = chainMasteryState.chainMastery.draftSession.session_type;

        if (!isCancelled) {
          if (draftSessionType === ChainSessionType.training) {
            setBtnText(START_TRAINING_SESSION_BTN);
            setAsideContents(TRAINING_INSTRUCTIONS);
          } else if (draftSessionType === ChainSessionType.probe) {
            setBtnText(START_PROBE_SESSION_BTN);
            setAsideContents(PROBE_INSTRUCTIONS);
          } else if (draftSessionType === ChainSessionType.booster) {
            setBtnText(START_BOOSTER_SESSION_BTN);
            setAsideContents(BOOSTER_INSTRUCTIONS);
          }
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [chainMasteryState.chainMastery]);

  // Runs when participant and/or device orientation is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (participantState.participant) {
        // Check that the current participant has chain data. If not, add it.
        const dbData = await ApiService.getChainDataForSelectedParticipant();

        if (!dbData || (dbData && dbData.id === undefined)) {
          const newData: SkillstarChain = {
            participant_id: participantState.participant.id,
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
  }, [participantState.participant, portrait]);
  /** END LIFECYCLE METHODS */

  const navToProbeOrTraining = () => {
    navigation.navigate('PrepareMaterialsScreen');
  };

  const key =
    chainMasteryState && chainMasteryState.chainMastery && chainMasteryState.chainMastery.chainData
      ? chainMasteryState.chainMastery.chainData.participant_id
      : -1;

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
          }}
        />
        {!isLoading &&
        chainMasteryState &&
        chainMasteryState.chainMastery &&
        chainMasteryState.chainMastery.chainSteps &&
        chainMasteryState.chainMastery.chainData &&
        chainMasteryState.chainMastery.draftSession ? (
          <View style={styles.listContainer}>
            <SessionDataAside asideContent={asideContent} />
            {chainMasteryState.chainMastery.chainSteps && (
              <ScrollView style={styles.list}>
                {chainMasteryState.chainMastery.draftSession.step_attempts.map(stepAttempt => {
                  const chainStep =
                    stepAttempt.chain_step ||
                    (chainMasteryState &&
                      chainMasteryState.chainMastery &&
                      chainMasteryState.chainMastery.chainSteps.find(s => s.id === stepAttempt.chain_step_id));
                  return chainMasteryState.chainMastery && chainStep ? (
                    <ScorecardListItem
                      key={'scorecard_list_chain_step_' + stepAttempt.chain_step_id}
                      chainStep={chainStep}
                      stepAttempt={stepAttempt}
                      masteryInfo={chainMasteryState.chainMastery.masteryInfoMap[stepAttempt.chain_step_id]}
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

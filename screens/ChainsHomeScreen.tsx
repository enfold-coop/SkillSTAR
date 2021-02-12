import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text } from 'react-native-paper';
import {
  START_BOOSTER_SESSION_BTN,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
} from '../components/Chain/chainshome_text_assets/chainshome_text';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import SessionDataAside from '../components/Chain/SessionDataAside';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import CustomColors from '../styles/Colors';
import { ChainSessionType } from '../types/chain/ChainSession';

// Chain Home Screen
const ChainsHomeScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const { portrait } = useDeviceOrientation();
  const chainMasteryState = useChainMasteryState();

  const key =
    chainMasteryState && chainMasteryState.chainMastery?.chainData
      ? chainMasteryState.chainMastery.chainData.participant_id
      : -1;

  const SessionButtons = (): JSX.Element => {
    if (!chainMasteryState || !chainMasteryState.chainMastery) {
      return <Loading />;
    }
    const showProbeButton = chainMasteryState.chainMastery.canStartProbeSession();
    const showTrainingButton = chainMasteryState.chainMastery.canStartTrainingSession();
    const btnWidth = showTrainingButton && showProbeButton ? '45%' : '90%';

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {showProbeButton && (
          <TouchableOpacity
            style={{ ...styles.startSessionBtn, width: btnWidth }}
            onPress={() => {
              // Set the draft session type to probe and go to Prepare Materials
              if (chainMasteryState.chainMastery) {
                chainMasteryState.chainMastery.setDraftSessionType(ChainSessionType.probe);
                navigation.navigate('PrepareMaterialsScreen', {});
              }
            }}
          >
            <Animatable.Text animation={'bounceIn'} duration={2000} style={styles.btnText}>
              {START_PROBE_SESSION_BTN}
            </Animatable.Text>
          </TouchableOpacity>
        )}
        {showTrainingButton && (
          <TouchableOpacity
            style={{ ...styles.startSessionBtn, width: btnWidth }}
            onPress={() => {
              // Set the draft session type to training and go to Prepare Materials
              if (chainMasteryState.chainMastery) {
                chainMasteryState.chainMastery.setDraftSessionType(ChainSessionType.training);
                navigation.navigate('PrepareMaterialsScreen', {});
              }
            }}
          >
            <Animatable.Text animation={'bounceIn'} duration={2000} style={styles.btnText}>
              {chainMasteryState.chainMastery.draftSession.session_type === ChainSessionType.booster
                ? START_BOOSTER_SESSION_BTN
                : START_TRAINING_SESSION_BTN}
            </Animatable.Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
          onParticipantChange={(selectedParticipant) => {
            // TODO: Do we need this anymore?
          }}
        />
        {chainMasteryState.chainMastery?.draftSession && chainMasteryState.chainMastery.chainData.sessions ? (
          <View style={styles.listContainer}>
            <SessionDataAside
              currentSession={chainMasteryState.chainMastery.draftSession}
              sessionData={chainMasteryState.chainMastery.chainData.sessions}
            />
            {chainMasteryState.chainMastery.chainSteps && chainMasteryState.chainMastery.draftSession && (
              <ScrollView style={styles.list}>
                {chainMasteryState.chainMastery.draftSession.step_attempts.map((stepAttempt) => {
                  return chainMasteryState.chainMastery && stepAttempt.chain_step ? (
                    <ScorecardListItem
                      key={'scorecard_list_chain_step_' + stepAttempt.chain_step_id}
                      chainStep={stepAttempt.chain_step}
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
        <SessionButtons />
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
    width: '50%',
    // alignSelf: 'center',
    margin: 10,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: CustomColors.uva.orange,
    marginBottom: 0,
  },
  btnText: {
    textAlign: 'center',
    color: CustomColors.uva.white,
    fontSize: 32,
    fontWeight: '500',
  },
});

export default ChainsHomeScreen;

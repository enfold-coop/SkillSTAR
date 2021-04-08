import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { PROBE_INSTRUCTIONS } from '../constants/chainshome_text';
import { useChainMasteryContext } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSessionTypeMap } from '../types/chain/ChainSession';
import { StepAttemptField, StepAttemptFieldName } from '../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../types/DataVerificationControlCallback';

const BaselineAssessmentScreen = (): JSX.Element => {
  /**
   * Set session type: Probe or Training
   */
  const navigation = useNavigation();
  const [chainMasteryState, chainMasteryDispatch] = useChainMasteryContext();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const showModal = () => {
    // Display the modal
    setShouldShowModal(true);
  };

  const cancel = () => {
    // Just hide the modal
    setShouldShowModal(false);
  };

  const updateChainData: DataVerificationControlCallback = async (
    chainStepId: number,
    fieldName: StepAttemptFieldName,
    fieldValue: StepAttemptField,
  ): Promise<void> => {
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, fieldName, fieldValue);

      if (fieldName === 'completed') {
        chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'was_prompted', !fieldValue);
      }
    }
  };

  const updateSession = async (): Promise<void> => {
    // Hide the modal
    setShouldShowModal(false);

    setIsSubmitted(true);
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      chainMasteryState.chainMastery.draftSession.completed = true;
      chainMasteryState.chainMastery.saveDraftSession();
      const dbChainData = await ApiService.upsertChainData(chainMasteryState.chainMastery.chainData);
      if (dbChainData) {
        chainMasteryState.chainMastery.updateChainData(dbChainData);
        chainMasteryDispatch({ type: 'chainMastery', payload: chainMasteryState.chainMastery });
        navigation.navigate('ChainsHomeScreen', {});
      } else {
        console.error('Something went wrong with saving the chain data.');
      }
    }
  };

  const DataConfirmationModal = (): JSX.Element => {
    return (
      <Modal visible={shouldShowModal} animationType={'slide'} presentationStyle={'fullScreen'}>
        <View style={styles.modalContainer}>
          <Text style={styles.headline}>
            {'Please confirm that your probe session data has been entered correctly.'}
          </Text>
          <View style={styles.confirmStepAttemptRow} key={'confirm_step_attempt_heading'}>
            <Text style={{ ...styles.confirmRowNum, fontWeight: 'bold', color: 'black' }}>{'#'}</Text>
            <Text style={{ ...styles.confirmRowTitle, fontWeight: 'bold', color: 'black' }}>{'Step'}</Text>
            <Text style={{ ...styles.confirmRowData, fontWeight: 'bold', color: 'black' }}>{'Complete'}</Text>
            <Text style={{ ...styles.confirmRowData, fontWeight: 'bold', color: 'black' }}>
              {'Challenging Behavior'}
            </Text>
          </View>
          {chainMasteryState.chainMastery?.draftSession.step_attempts.map((stepAttempt) => {
            let bgColor: string;

            if (stepAttempt.completed) {
              if (stepAttempt.had_challenging_behavior) {
                bgColor = CustomColors.uva.greenSofter;
              } else {
                bgColor = CustomColors.uva.greenSoft;
              }
            } else {
              if (stepAttempt.had_challenging_behavior) {
                bgColor = CustomColors.uva.warningSoft;
              } else {
                bgColor = CustomColors.uva.warningSofter;
              }
            }

            return (
              <View
                style={{ ...styles.confirmStepAttemptRow, backgroundColor: bgColor }}
                key={'confirm_step_attempt_' + stepAttempt.chain_step_id}
              >
                <Text style={styles.confirmRowNum}>{`${stepAttempt.chain_step_id + 1}.`}</Text>
                <Text style={styles.confirmRowTitle}>{stepAttempt.chain_step?.instruction}</Text>
                <View style={styles.confirmRowData}>
                  <MaterialIcons
                    name={stepAttempt.completed ? 'check' : 'close'}
                    size={36}
                    style={{ color: stepAttempt.completed ? 'black' : CustomColors.uva.warning }}
                  />
                </View>
                <View style={styles.confirmRowData}>
                  <Image
                    source={ImageAssets.flag_icon}
                    style={{ ...styles.confirmRowDataIcon, opacity: stepAttempt.had_challenging_behavior ? 1 : 0 }}
                  />
                </View>
              </View>
            );
          })}
          <View style={styles.btnContainer}>
            <Button
              style={styles.closeBtn}
              labelStyle={{ fontSize: 16, color: 'white' }}
              color={CustomColors.uva.orange}
              mode={'contained'}
              onPress={updateSession}
            >{`Confirm`}</Button>
            <Button
              style={styles.closeBtn}
              labelStyle={{ fontSize: 16 }}
              color={CustomColors.uva.gray}
              mode={'outlined'}
              onPress={cancel}
            >{`Cancel`}</Button>
          </View>
        </View>
      </Modal>
    );
  };

  return chainMasteryState &&
    chainMasteryState.chainMastery &&
    chainMasteryState.chainMastery.chainData &&
    chainMasteryState.chainMastery.draftSession &&
    !isSubmitted ? (
    <View style={styles.image}>
      <View style={styles.container}>
        {shouldShowModal && <DataConfirmationModal />}
        <AppHeader name={'Brushing Teeth'} />
        <View style={styles.instructionContainer}>
          <Text style={styles.screenHeader}>
            {(ChainSessionTypeMap[chainMasteryState.chainMastery.draftSession.session_type as string].value ||
              'Baseline Assessment') + ' Session'}
          </Text>
          <Text style={styles.instruction}>{PROBE_INSTRUCTIONS}</Text>
        </View>
        <View style={styles.formContainer}>
          <DataVerificationList onChange={updateChainData} />
        </View>
        <View style={styles.nextBackBtnsContainer}>
          <Button
            style={styles.nextButton}
            color={CustomColors.uva.orange}
            labelStyle={{
              fontSize: 24,
              fontWeight: '600',
              color: CustomColors.uva.white,
            }}
            mode={'contained'}
            onPress={showModal}
          >{`Submit`}</Button>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.middle}>{!isSubmitted ? <Loading /> : <Text>{`Saving data...`}</Text>}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 0,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  instructionContainer: {
    marginLeft: 40,
    marginRight: 40,
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  screenHeader: {
    marginLeft: 10,
    marginTop: 0,
    paddingBottom: 10,
    fontSize: 22,
    fontWeight: '600',
  },
  instruction: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  formContainer: {
    height: '65%',
    paddingBottom: 10,
  },
  nextBackBtnsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 400,
  },
  nextButton: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: '600',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 100,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 48,
    marginBottom: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  headline: {
    fontSize: 24,
    marginBottom: 40,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  closeBtn: {
    width: 200,
    margin: 10,
    alignSelf: 'center',
  },
  confirmStepAttemptRow: {
    flexDirection: 'row',
    margin: 4,
  },
  confirmRowNum: {
    flex: 1,
    margin: 4,
  },
  confirmRowTitle: {
    flex: 10,
    margin: 4,
    textAlign: 'left',
  },
  confirmRowData: {
    flex: 3,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  confirmRowDataIcon: {
    height: 24,
    width: 24,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default BaselineAssessmentScreen;

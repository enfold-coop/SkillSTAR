import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import { ApiService } from '../services/ApiService';
import { ChainMastery } from '../services/ChainMastery';
import CustomColors from '../styles/Colors';
import { ChainData } from '../types/chain/ChainData';
import { ChainSession, ChainSessionTypeMap } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { StepAttempt, StepAttemptField } from '../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../types/DataVerificationControlCallback';

const BaselineAssessmentScreen = (): JSX.Element => {
  /**
   * Set session type: Probe or Training
   */
  const navigation = useNavigation();
  const chainMasteryState = useChainMasteryState();

  const updateChainData: DataVerificationControlCallback = async (
    chainStepId: number,
    fieldName: string,
    fieldValue: StepAttemptField,
  ): Promise<void> => {
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      //  Get the step
      chainMasteryState.chainMastery.draftSession.step_attempts.forEach((stepAttempt, i) => {
        if (stepAttempt.chain_step_id === chainStepId) {
          // Set the value of the fieldName for a specific step
          // @ts-ignore-next-line
          console.log('old value', chainMasteryState.chainMastery.draftSession.step_attempts[i][fieldName]);
          // @ts-ignore-next-line
          chainMasteryState.chainMastery.draftSession.step_attempts[i][fieldName] = fieldValue;
          // @ts-ignore-next-line
          console.log('new value', chainMasteryState.chainMastery.draftSession.step_attempts[i][fieldName]);
        }
      });
    }
  };

  const updateSession = async (): Promise<void> => {
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      chainMasteryState.chainMastery.chainData.upsertSession(chainMasteryState.chainMastery.draftSession);

      console.log('chainMasteryState.chainMastery.chainData.id', chainMasteryState.chainMastery.chainData.id);

      const dbChainData = await ApiService.upsertChainData(chainMasteryState.chainMastery.chainData);
      if (dbChainData) {
        console.log('dbChainData loaded', !!dbChainData);
        chainMasteryState.chainMastery.updateChainData(dbChainData);
        navigation.navigate('ChainsHomeScreen');
      } else {
        console.error('Something went wrong with saving the chain data.');
      }
    }
  };

  return chainMasteryState &&
    chainMasteryState.chainMastery &&
    chainMasteryState.chainMastery.chainData &&
    chainMasteryState.chainMastery.draftSession ? (
    <View style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brushing Teeth'} />
        <View style={styles.instructionContainer}>
          <Text style={styles.screenHeader}>
            {(ChainSessionTypeMap[chainMasteryState.chainMastery.draftSession.session_type as string].value ||
              'Baseline Assessment') + ' Session'}
          </Text>
          <Text style={styles.instruction}>
            {`Please instruct the child to brush their teeth. As they do, please complete this survey for each step.`}
          </Text>
        </View>
        <View style={styles.formContainer}>
          <DataVerificationList
            stepAttempts={chainMasteryState.chainMastery.draftSession.step_attempts}
            onChange={updateChainData}
          />
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
            onPress={() => {
              updateSession();
            }}
          >{`NEXT`}</Button>
        </View>
      </View>
    </View>
  ) : (
    <Loading />
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
    fontSize: 22,
  },
  formContainer: {
    height: '75%',
    paddingBottom: 10,
  },
  nextBackBtnsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 100,
  },
  nextButton: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: '600',
  },
});

export default BaselineAssessmentScreen;

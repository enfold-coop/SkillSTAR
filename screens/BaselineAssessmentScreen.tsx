import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { ApiService } from '../services/ApiService';
import { ChainMastery } from '../services/ChainMastery';
import CustomColors from '../styles/Colors';
import { ChainSession, ChainSessionType, ChainSessionTypeMap } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { ChainData } from '../types/chain/ChainData';
import { ChainStepStatus, StepAttempt, StepAttemptField } from '../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../types/DataVerificationControlCallback';

const BaselineAssessmentScreen = (): JSX.Element => {
  /**
   * Set session type: Probe or Training
   */
  const navigation = useNavigation();
  const [sessionReady, setSessionReady] = useState(false);
  const [chainData, setChainData] = useState<ChainData>();
  const [chainMastery, setChainMastery] = useState<ChainMastery>();
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();

  /** START: Lifecycle calls */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      const contextChainData = await ApiService.contextState('chainData');
      if (!isCancelled && !chainData && contextChainData) {
        const newChainData = new ChainData(contextChainData);
        setChainData(newChainData);
      }

      const contextChainSteps = await ApiService.contextState('chainSteps');
      if (!isCancelled && !chainSteps && contextChainSteps) {
        setChainSteps(contextChainSteps as ChainStep[]);
      }

      if (!isCancelled && chainSteps && chainData) {
        if (!isCancelled && !chainSession) {
          const newChainMastery = new ChainMastery(chainSteps, chainData);

          if (newChainMastery && newChainMastery.draftSession && !isCancelled) {
            setChainMastery(newChainMastery);
            setChainSession(newChainMastery.draftSession);
            setSessionReady(true);
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
  }, []);
  /** END: Lifecycle calls */

  const updateChainData: DataVerificationControlCallback = async (
    chainStepId: number,
    fieldName: string,
    fieldValue: StepAttemptField,
  ): Promise<void> => {
    if (chainData && chainSession && chainSession.id !== undefined) {
      //  Get the step
      const newStep: StepAttempt | undefined = chainData.getStep(chainSession.id, chainStepId);

      if (newStep !== undefined && newStep.hasOwnProperty && newStep.hasOwnProperty(fieldName)) {
        // Modify the value
        // @ts-ignore-next-line
        newStep[fieldName] = fieldValue;

        //  Set the value of the fieldName for a specific step
        if (chainData && chainData.id !== undefined) {
          chainData.updateStep(chainSession.id, chainStepId, newStep);
        }
      }
    }
  };

  const updateSession = async (): Promise<void> => {
    if (chainData && chainSession) {
      if (!chainData.sessions) {
        chainData.sessions = [];
      }

      chainData.sessions.push(chainSession);

      const dbChainData = await ApiService.upsertChainData(chainData);
      if (dbChainData) {
        navigation.navigate('ChainsHomeScreen');
      } else {
        console.error('Something went wrong with saving the chain data.');
      }
    }
  };

  return (
    <View style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brushing Teeth'} />
        {sessionReady && chainSession ? (
          <View style={styles.instructionContainer}>
            <Text style={styles.screenHeader}>
              {(ChainSessionTypeMap[chainSession.session_type as string].value || 'Baseline Assessment') + ' Session'}
            </Text>
            <Text style={styles.instruction}>
              {`Please instruct the child to brush their teeth. As they do, please complete this survey for each step.`}
            </Text>
          </View>
        ) : (
          <Loading />
        )}
        <View style={styles.formContainer}>
          {
            <DataVerificationList
              stepAttempts={chainSession ? chainSession.step_attempts : []}
              onChange={updateChainData}
            />
          }
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

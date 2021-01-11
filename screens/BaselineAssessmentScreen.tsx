import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { useChainContext, useChainDispatch } from '../context/ChainProvider';
import { RootNavProps } from '../navigation/root_types';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSession } from '../types/CHAIN/ChainSession';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import { ChainStepStatus, StepAttempt, StepAttemptField } from '../types/CHAIN/StepAttempt';
import { DataVerificationControlCallback } from '../types/DataVerificationControlCallback';

type Props = {
  route: RootNavProps<'BaselineAssessmentScreen'>;
  navigation: RootNavProps<'BaselineAssessmentScreen'>;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/**
 *
 */
const BaselineAssessmentScreen: FC<Props> = props => {
  /**
   * Set session type: Probe or Training
   */
  const api = new ApiService();
  const [contextState, contextDispatch] = useChainContext();
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [questionnaireId, setQuestionnaireId] = useState<number>();
  const [sessionReady, setSessionReady] = useState(false);
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [text, setText] = useState('');
  const { chainSteps, chainData } = contextState;
  const [contextIsLoading, setContextIsLoading] = useState<boolean>(contextState.isLoading);
  const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);

  /** START: Lifecycle calls */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (chainSteps) {
        const stepAttempts: StepAttempt[] = chainSteps.map(chainStep => {
          return {
            chain_step_id: chainStep.id,
            chain_step: chainStep,
            status: ChainStepStatus.not_complete,
            completed: false,
          };
        });

        const newChainSession: ChainSession = {
          step_attempts: stepAttempts,
        };

        if (!isCancelled) {
          setChainSession(newChainSession);
        }
      }

      if (!isCancelled) {
        setSessionReady(true);
      }
    };

    if (!chainSession) {
      _load().then(() => {
        contextDispatch({ type: 'isLoading', payload: false });
      });
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) {
      console.log('contextState.isLoading = ', contextState.isLoading);
      const shouldLoad =
        !contextState.isLoading || !contextState.chainSteps || !contextState.chainData;

      setContextIsLoading(!shouldLoad);

      if (shouldNavigate) {
        navigation.navigate('ChainsHomeScreen');
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [contextState.isLoading]);
  /** END: Lifecycle calls */

  const updateChainData: DataVerificationControlCallback = async (
    chainStepId: number,
    fieldName: string,
    fieldValue: StepAttemptField,
  ) => {
    if (chainData && chainSession && chainSession.id !== undefined) {
      //  Get the step
      const newStep: StepAttempt = chainData.getStep(chainSession.id, chainStepId);

      //  Modify the value
      newStep[fieldName] = fieldValue;

      //  Set the value of the fieldName for a specific step
      if (chainData && chainData.id !== undefined) {
        chainData.updateStep(chainSession.id, chainStepId, newStep);
      }
    }
  };

  const setSessionData = async () => {
    console.log('*** setSessionData ***');
    contextDispatch({ type: 'isLoading', payload: true });

    if (chainData && chainData.id !== undefined && chainSession) {
      chainData.sessions.push(chainSession);
      const dbChainData = await api.upsertChainData(chainData);
      if (dbChainData) {
        const newChainData = new ChainData(dbChainData);
        contextDispatch({ type: 'chainData', payload: newChainData });

        // Stupid hack to prevent navigation until all the context dispatch calls finish updating.
        setShouldNavigate(true);
        contextDispatch({ type: 'isLoading', payload: false });
      }
    }
  };

  return (
    <View style={styles.image}>
      {sessionReady && !contextState.isLoading ? (
        <View style={styles.container}>
          <AppHeader name='Brushing Teeth' />
          <View style={styles.instructionContainer}>
            {/* <Text style={styles.screenHeader}>Probe Session</Text> */}
            <Text style={styles.instruction}>
              Please instruct the child to brush their teeth. As they do, please complete this
              survey for each step.
            </Text>
          </View>
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
                fontSize: 16,
                fontWeight: '600',
                color: CustomColors.uva.blue,
              }}
              mode='contained'
              onPress={() => {
                setSessionData();
              }}
            >
              NEXT
            </Button>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
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

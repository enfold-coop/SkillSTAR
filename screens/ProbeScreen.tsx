import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { DataVerificationListItem } from '../components/Probe/';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { ChainData } from '../types/chain/ChainData';
import { ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';

const ProbeScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainData, setChainData] = useState<ChainData>();

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
        const stepAttempts: StepAttempt[] = chainSteps.map((chainStep) => {
          return {
            chain_step_id: chainStep.id,
            chain_step: chainStep,
            status: ChainStepStatus.not_complete,
            completed: false,
          };
        });

        const newChainSession: ChainSession = {
          date: new Date(),
          completed: false,
          session_type: ChainSessionType.probe,
          step_attempts: stepAttempts,
        };

        if (!isCancelled && !chainSession) {
          setChainSession(newChainSession);
          setSessionReady(true);
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  });
  /** END: Lifecycle calls */

  const incrIndex = () => {
    setStepIndex(stepIndex + 1);
  };

  const decIndex = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  /**
   * 1. get attempts array
   * 2. load first attempt into DOM
   * 3. increment array logic
   * 4. functionality to write changes to attempt items
   * 5.
   */

  /**
   * <header></header>
   * title
   * data verification components:
   * -- table header: "step", "Task completion?", "Challenging behavior?"
   * -- table row: step name, "yes/no", "yes/no"
   */

  const onChange = async () => {
    console.log('ProbeScreen onChange');
  };

  return chainSession && chainSteps ? (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Probe'} />
        <View style={styles.formContainer}>
          <DataVerificationListItem stepAttempt={chainSession.step_attempts[stepIndex]} onChange={onChange} />
        </View>

        <View style={styles.nextBackBtnsContainer}>
          <Button
            style={styles.backButton}
            color={CustomColors.uva.blue}
            labelStyle={{ fontSize: 24, paddingVertical: 5 }}
            mode={'contained'}
            onPress={() => {
              decIndex();
            }}
          >{`BACK`}</Button>
          <Button
            style={styles.nextButton}
            color={CustomColors.uva.blue}
            labelStyle={{ fontSize: 24, paddingVertical: 5 }}
            mode={'contained'}
            onPress={() => {
              if (stepIndex + 1 <= chainSteps.length - 1) {
                incrIndex();
              } else {
                setReadyToSubmit(true);
                navigation.navigate('ProbeScreen');
              }
            }}
          >{`NEXT`}</Button>
        </View>
        {readyToSubmit && (
          <Button
            mode={'contained'}
            labelStyle={{ fontSize: 24, paddingVertical: 5 }}
            onPress={() => {
              navigation.navigate('ChainsHomeScreen');
            }}
          >{`Submit`}</Button>
        )}
      </View>
    </ImageBackground>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  formContainer: {},
  formItemContainer: {},
  formItemLabel: {},
  btnContainer: {},
  formItemButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 100,
  },
  nextButton: {
    width: 144,
    margin: 15,
  },
  backButton: {
    width: 144,
    margin: 15,
  },
  inputField: {},
});

export default ProbeScreen;

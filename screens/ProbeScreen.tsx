import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View, LogBox } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { DataVerificationListItem } from '../components/Probe/';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSession, ChainSessionType } from '../types/CHAIN/ChainSession';
import { ChainStep } from '../types/CHAIN/ChainStep';
import { Session } from '../types/CHAIN/Session';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import { ChainStepStatus, StepAttempt } from '../types/CHAIN/StepAttempt';
import { RootNavProps } from '../types/NavigationOptions';

type Props = {
  route: RootNavProps<'ProbeScreen'>;
  navigation: RootNavProps<'ProbeScreen'>;
  session: Session;
};

const ProbeScreen: FC<Props> = props => {
    LogBox.ignoreAllLogs();
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [text, setText] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainData, setChainData] = useState<ChainData>();

  /** START: Lifecycle calls */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      console.log('ProbeScreen > useEffect 1 > _load');
      const contextChainData = await ApiService.contextState('chainData');
      if (!isCancelled && !chainData && contextChainData) {
        console.log('ProbeScreen.tsx > useEffect > _load > Setting chainData.');
        const newChainData = new ChainData(contextChainData);
        setChainData(newChainData);
      }

      const contextChainSteps = await ApiService.contextState('chainSteps');
      if (!isCancelled && !chainSteps && contextChainSteps) {
        console.log('ProbeScreen.tsx > useEffect 1 > _load > Setting chainSteps.');
        setChainSteps(contextChainSteps as ChainStep[]);
      }

      if (!isCancelled && chainSteps && chainData) {
        console.log('ProbeScreen > useEffect 1 > _load > Setting session...');
        const stepAttempts: StepAttempt[] = chainSteps.map(chainStep => {
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
    <ImageBackground
      source={require('../assets/images/sunrise-muted.png')}
      resizeMode={'cover'}
      style={styles.image}
    >
      <View style={styles.container}>
        <AppHeader name='Probe' />
        <View style={styles.formContainer}>
          <DataVerificationListItem
            stepAttempt={chainSession.step_attempts[stepIndex]}
            onChange={onChange}
          />
        </View>

        <View style={styles.nextBackBtnsContainer}>
          <Button
            style={styles.backButton}
            color={CustomColors.uva.blue}
            labelStyle={{ fontSize: 24, paddingVertical:5 }}
            mode='contained'
            onPress={() => {
              decIndex();
            }}
          >
            BACK
          </Button>
          <Button
            style={styles.nextButton}
            color={CustomColors.uva.blue}
            labelStyle={{ fontSize: 24, paddingVertical:5 }}
            mode='contained'
            onPress={() => {
              if (stepIndex + 1 <= chainSteps.length - 1) {
                incrIndex();
              } else {
                setReadyToSubmit(true);
                navigation.navigate('ProbeScreen');
              }
            }}
          >
            NEXT
          </Button>
        </View>
        {readyToSubmit && (
          <Button
            mode='contained'
            labelStyle={{ fontSize: 24, paddingVertical:5 }}
            onPress={() => {
              navigation.navigate('ChainsHomeScreen');
            }}
          >
            Submit
          </Button>
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

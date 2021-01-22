import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, LogBox } from 'react-native';
import * as Animatable from 'react-native-animatable';
import 'react-native-get-random-values';
import { ActivityIndicator, Button } from 'react-native-paper';
import { DataVerifItem } from '../components/DataVerification';
import ColumnLabels from '../components/DataVerification/ColumnLabels';
import AppHeader from '../components/Header/AppHeader';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSession } from '../types/CHAIN/ChainSession';
import { ChainStep } from '../types/CHAIN/ChainStep';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import { StepAttempt } from '../types/CHAIN/StepAttempt';

type Props = {};

/**
 *
 */
const DataVerificationScreen: FC<Props> = props => {
    LogBox.ignoreAllLogs();
  const navigation = useNavigation();
  const [chainData, setChainData] = useState<ChainData>();
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [stepAttempts, setStepAttempts] = useState<StepAttempt[]>();
  const [scrolling, setScrolling] = useState(false);

  // Called on 2nd press of Submit button
  const submitAndNavigate = () => {
    setConfirmSubmit(false);
    postData();
    navigation.navigate('ChainsHomeScreen');
  };

  // Post state data to API
  const postData = () => {
    console.log('POSTING DATA');
  };

  /** START: Lifecycle calls */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (!chainData) {
          const contextChainData = await ApiService.contextState('chainData');
          if (!isCancelled && contextChainData) {
            setChainData(contextChainData as ChainData);
          }
        }

        if (!chainSession) {
          const contextSession = await ApiService.contextState('session');
          if (!isCancelled && contextSession) {
            setChainSession(contextSession as ChainSession);
          }
        }

        if (!chainSteps) {
          const contextChainSteps = await ApiService.contextState('chainSteps');
          if (!isCancelled && contextChainSteps) {
            setChainSteps(contextChainSteps as ChainStep[]);
          }
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Runs when session is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && chainSession && !stepAttempts) {
        setStepAttempts(chainSession.step_attempts);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [chainSession]);
  /** END: Lifecycle calls */

  return (
    <View style={styles.container}>
      <AppHeader name='Brushing Teeth' />
      <View style={styles.instructionContainer}>
        <Text style={[scrolling ? styles.smallHeader : styles.screenHeader]}>Probe Session</Text>
        <Animatable.Text
          transition='fontSize'
          duration={1000}
          style={[scrolling ? styles.smallInstruction : styles.instruction]}
        >
          Please instruct the child to brush their teeth. As they do, please complete this survey
          for each step.
        </Animatable.Text>
      </View>
      <View style={styles.formContainer}>
        <ColumnLabels />
        {chainSteps && chainData && chainSession && stepAttempts ? (
          <FlatList
            onScrollBeginDrag={() => {
              setScrolling(true);
              setReadyToSubmit(true);
            }}
            data={stepAttempts}
            renderItem={item => {
              return <DataVerifItem stepAttempt={item.item} chainSteps={chainSteps} />;
            }}
            keyExtractor={() => `${Math.floor(Math.random() * 10000)}`}
          />
        ) : (
          <View>
            <ActivityIndicator animating={true} color={CustomColors.uva.mountain} />
          </View>
        )}
      </View>

      {readyToSubmit && (
        <View style={styles.btnContainer}>
          <Text style={styles.btnContainerText}>
            Please confirm your selections, then press Submit.
          </Text>
          <Button
            mode='contained'
            color={CustomColors.uva.orange}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: CustomColors.uva.blue,
            }}
            style={styles.nextButton}
            onPress={() => {
              if (confirmSubmit) {
                submitAndNavigate();
              } else {
                setConfirmSubmit(true);
              }
            }}
          >
            {confirmSubmit ? 'Confirm and Submit' : 'Submit'}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 100,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  instructionContainer: {
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  smallinstructionContainer: {
    margin: 20,
    marginBottom: 1,
    marginTop: 1,
    fontSize: 16,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  screenHeader: {
    marginTop: 20,
    paddingBottom: 20,
    fontSize: 22,
    fontWeight: '600',
  },
  smallHeader: {
    display: 'none',
  },

  instruction: {
    padding: 40,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 22,
  },
  smallInstruction: {
    padding: 20,
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 18,
  },
  formContainer: {
    height: '80%',
  },
  formItemContainer: {},
  formItemLabel: {},
  btnContainer: {},
  formItemButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 100,
    marginRight: 20,
    marginTop: 100,
  },
  btnContainerText: {
    display: 'none',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
  nextButton: {
    width: '90%',
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: '600',
  },
});

export default DataVerificationScreen;

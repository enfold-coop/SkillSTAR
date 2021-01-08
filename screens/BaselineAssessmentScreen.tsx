import { useNavigation } from '@react-navigation/native';
import React, { ReactNode, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { RootNavProps } from '../navigation/root_types';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { SkillstarChain } from '../types/CHAIN/SkillstarChain';
import { ChainSession } from '../types/CHAIN/ChainSession';
import { ChainStepStatus, StepAttempt } from '../types/CHAIN/StepAttempt';

type Props = {
  route: RootNavProps<'BaselineAssessmentScreen'>;
  navigation: RootNavProps<'BaselineAssessmentScreen'>;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/**
 *
 */
function BaselineAssessmentScreen({ route }: Props): ReactNode {
  /**
   * Set session type: Probe or Training
   */
  const api = new ApiService();
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [questionnaireId, setQuestionnaireId] = useState<number>();
  const [sessionReady, setSessionReady] = useState(false);
  const [chainData, setChainData] = useState<SkillstarChain>();
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [text, setText] = useState('');

  /** START: Lifecycle calls */
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      const chainSteps = await api.getChainSteps();
      const qId = await api.getChainQuestionnaireId();

      if (qId !== undefined && !isCancelled) {
        setQuestionnaireId(qId);
        const dbChainData = await api.getChainData(qId);
        if (dbChainData) {
          setChainData(dbChainData);
        }
      }

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
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, []);
  /** END: Lifecycle calls */

  const updateChainData = async (stepId: number, value: boolean, fieldName: string) => {

    //  Find the step that matches the stepId
    //  Set the value of the fieldName for that step
    if (questionnaireId !== undefined && chainData && chainSession) {
      chainData.sessions.push(chainSession);
      await api.upsertChainData(chainData);
    }
  };

  const setSessionData = async () => {
    // Context API set session data
    if (questionnaireId !== undefined && chainData && chainSession) {
      chainData.sessions.push(chainSession);
      await api.upsertChainData(chainData);

      // navigate to chainshomescreen
      navigation.navigate('ChainsHomeScreen');
    }
  };

  return (
    // <ImageBackground
    // 	source={require("../assets/images/sunrise-muted.png")}
    // 	resizeMode={"cover"}
    // 	style={styles.image}
    // >
    <View style={styles.image}>
      {sessionReady && (
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
      )}
    </View>
    // </ImageBackground>
  );
}

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

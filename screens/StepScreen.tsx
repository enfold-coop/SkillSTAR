import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { AVPlaybackSource } from 'expo-av/build/AV';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { MasteryIconContainer, ProgressBar, StarsNIconsContainer } from '../components/Steps/index';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import { videos } from '../data/videos';
import CustomColors from '../styles/Colors';
import { ChainStep } from '../types/chain/ChainStep';
import { StepAttempt } from '../types/chain/StepAttempt';

const StepScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState<number>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainStep, setChainStep] = useState<ChainStep>();
  const [stepAttempt, setStepAttempt] = useState<StepAttempt>();
  const [video, setVideo] = useState<AVPlaybackSource>();
  const chainMasteryState = useChainMasteryState();

  /**
   * BEGIN: LIFECYCLE CALLS
   */
  useEffect(() => {
    let isCancelled = false;
    const _load = async () => {
      if (chainMasteryState.chainMastery) {
        if (!isCancelled && !chainSteps) {
          setChainSteps(chainMasteryState.chainMastery.chainSteps);
          setStepIndex(0);
          setChainStep(chainMasteryState.chainMastery.chainSteps[0]);
          setStepAttempt(chainMasteryState.chainMastery.draftSession.step_attempts[0]);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Runs when stepIndex is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && stepIndex !== undefined) {
        // Solves issue of videos not start play at beginning
        setVideo(videos[`step_${stepIndex + 1}`]);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [stepIndex]);
  /**
   * END: LIFECYCLE CALLS
   */

  const goToStep = (i: number) => {
    if (chainMasteryState.chainMastery) {
      setVideo(undefined);
      setStepIndex(i);
      setChainStep(chainMasteryState.chainMastery.chainSteps[i]);
      setStepAttempt(chainMasteryState.chainMastery.draftSession.step_attempts[i]);
    }
  };

  const ReturnVideoComponent = () => {
    return video && stepIndex !== undefined ? (
      <Video
        source={video}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode={'cover'}
        isLooping={false}
        useNativeControls={true}
        style={styles.video}
      />
    ) : (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={CustomColors.uva.mountain} />
      </View>
    );
  };

  const prevStep = () => {
    if (!chainSteps || stepIndex === undefined) {
      console.error('chainSteps and/or stepIndex not loaded.');
      return;
    }

    if (stepIndex > 0) {
      goToStep(stepIndex - 1);
    }
  };

  const nextStep = () => {
    if (!chainSteps || stepIndex === undefined) {
      console.error('chainSteps and/or stepIndex not loaded.');
      return;
    }

    if (stepIndex + 1 <= chainSteps.length - 1) {
      goToStep(stepIndex + 1);
    } else {
      navigation.navigate('RewardsScreens');
    }
  };

  // Set was_prompted to true for current step attempt
  const onNeededPrompting = () => {
    if (chainStep && chainMasteryState.chainMastery) {
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'was_prompted', true);

      // TODO: Verify that we should navigate to next step here?
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'completed', false);
    }

    nextStep();
  };

  // Set completed to true for this step attempt
  const onStepComplete = () => {
    if (chainStep && chainMasteryState.chainMastery) {
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'completed', true);
    }

    nextStep();
  };

  return chainSteps && chainStep && stepIndex !== undefined ? (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brush Teeth'} />
        <View style={styles.progress}>
          <Text style={styles.headline}>{`Step ${chainStep.id + 1}: ${chainStep.instruction}`}</Text>
          <View style={styles.progressContainer}>
            <MasteryIconContainer masteryLevel={'focus_step'} />
            <ProgressBar
              currentStepIndex={stepIndex}
              totalSteps={chainSteps.length}
              masteryLevel={'focus'}
              chainSteps={chainSteps}
            />
          </View>
        </View>
        <StarsNIconsContainer chainStepId={chainStep.id} />
        <View style={styles.subContainer}>
          <Animatable.View style={styles.subVideoContainer} duration={2000} animation={'fadeIn'}>
            {<ReturnVideoComponent />}
          </Animatable.View>
        </View>
        <View style={styles.bottomContainer}>
          {/* <Button
						style={styles.exitButton}
						color={CustomColors.uva.blue}
						mode={'outlined'}
						onPress={() => {
							console.log("exit");
							navigation.navigate("ChainsHomeScreen");
						}}
					>
						Exit
					</Button> */}
        </View>
        <View style={styles.nextBackBtnsContainer}>
          <Button
            style={styles.backButton}
            labelStyle={{ alignSelf: 'flex-start', fontSize: 24, paddingVertical: 5 }}
            disabled={!stepIndex}
            color={CustomColors.uva.blue}
            mode={'outlined'}
            onPress={prevStep}
          >{`Previous Step`}</Button>
          <View style={styles.nextBackSubContainer}>
            <Text style={styles.needAddlPrompt}>{`Needed Add'l Prompting`}</Text>
            <Button
              style={styles.neededPromptingBtn}
              labelStyle={{ fontSize: 28, paddingVertical: 5, color: CustomColors.uva.white }}
              color={CustomColors.uva.orange}
              mode={'contained'}
              onPress={onNeededPrompting}
            >{`+`}</Button>
            <Button
              style={styles.nextButton}
              labelStyle={{ fontSize: 24, paddingTop: 5, paddingBottom: 0 }}
              color={CustomColors.uva.blue}
              mode={'contained'}
              onPress={onStepComplete}
            >{`Step Complete`}</Button>
          </View>
        </View>
      </View>
    </ImageBackground>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 0,
    marginTop: 20,
    height: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  instructionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  headline: {
    width: '60%',
    fontSize: 22,
    fontWeight: '600',
    padding: 10,
    height: 100,
  },
  subContainer: {
    flexDirection: 'column',
  },
  challengingBehavior: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 80,
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    padding: 10,
  },
  itemName: {},
  subVideoContainer: {
    padding: 10,
    height: 400,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  video: {
    height: 400,
    width: '100%',
  },
  progressBar: {
    width: 200,
    height: 40,
    borderWidth: 0,
    borderRadius: 5,
  },
  focusStepIcon: {
    height: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 15,
    margin: 15,
  },
  neededPromptingBtn: {
    margin: 15,
    // fontSize:26,
    textAlign:"center"
  },
  exitButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    // backgroundColor:"#f0f"
  },
  nextBackSubContainer: {
    flexDirection: 'row',
  },
  needAddlPrompt: {
    width: 80,
    paddingTop: 0,
    color: CustomColors.uva.grayDark,
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
  },
  nextButton: {
    width: 244,
    margin: 15,
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default StepScreen;

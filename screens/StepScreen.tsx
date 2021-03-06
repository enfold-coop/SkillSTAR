import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import { AVPlaybackSource } from 'expo-av/build/AV';
import VideoPlayer from 'expo-video-player';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { ProgressBar, PromptLevel } from '../components/Steps/index';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import { ImageAssets } from '../data/images';
import { videos } from '../data/videos';
import CustomColors from '../styles/Colors';
import { MasteryIcon } from '../styles/MasteryIcon';
import { ChainStep } from '../types/chain/ChainStep';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';

const StepScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState<number>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainStep, setChainStep] = useState<ChainStep>();
  const [stepAttempt, setStepAttempt] = useState<StepAttempt>();
  const [video, setVideo] = useState<AVPlaybackSource>();
  const chainMasteryState = useChainMasteryState();
  const [isPLaying, setIsPlaying] = useState(false);
  const [pastFocusStepAttempts, setPastFocusStepAttempts] = useState<boolean[]>();
  const [chainStepId, setChainStepId] = useState<number>();

  /**
   * BEGIN: LIFECYCLE CALLS
   */
  // Runs once on first load.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (chainMasteryState.chainMastery && !isCancelled && !chainSteps) {
        setChainSteps(chainMasteryState.chainMastery.chainSteps);
        setStepIndex(0);
        setChainStep(chainMasteryState.chainMastery.chainSteps[0]);
        setChainStepId(chainMasteryState.chainMastery.draftSession.step_attempts[0].chain_step_id);
        const tempId = chainMasteryState.chainMastery.draftSession.step_attempts[0].chain_step_id;
        setStepAttempt(chainMasteryState.chainMastery.draftSession.step_attempts[0]);
        getPrevCompletedFocusSteps(tempId);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Runs when videos are loaded or stepIndex is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && stepIndex !== undefined) {
        // Solves issue of videos not start play at beginning
        const loadedVideo = videos[`step_${stepIndex + 1}`];

        if (loadedVideo) {
          setVideo(loadedVideo);
        } else {
          console.log('video is not loaded yet.');
        }

        setIsPlaying(false);
        setChainStepId(stepIndex);
        getPrevCompletedFocusSteps(stepIndex);
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

  const getPrevCompletedFocusSteps = (id: number) => {
    if (chainMasteryState.chainMastery) {
      setPastFocusStepAttempts(chainMasteryState.chainMastery.getPreviousFocusStepAttempts(id));
    }
  };

  const goToStep = (i: number) => {
    if (chainMasteryState.chainMastery) {
      setVideo(undefined);
      setChainStep(chainMasteryState.chainMastery.chainSteps[i]);
      setStepAttempt(chainMasteryState.chainMastery.draftSession.step_attempts[i]);
      setStepIndex(i);
    }
  };

  const ReturnVideoComponent = () => {
    return videos && video && stepIndex !== undefined ? (
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_STRETCH,
          source: video,
          volume: 0.0,
        }}
        inFullscreen={false}
        videoBackground={'transparent'}
        disableSlider={true}
        sliderColor={'#fff'}
        showFullscreenButton={false}
        height={Dimensions.get('screen').height / 2.5}
      />
    ) : (
      <Loading />
    );
  };

  const showNeededPromptingButton = (): boolean => {
    return !!(stepAttempt && stepAttempt.target_prompt_level !== ChainStepPromptLevel.full_physical);
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
    if (stepAttempt && chainStep && chainMasteryState.chainMastery) {
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'was_prompted', true);
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'completed', false);

      // Set the prompt level one level back.
      if (stepAttempt.target_prompt_level) {
        chainMasteryState.chainMastery.updateDraftSessionStep(
          chainStep.id,
          'prompt_level',
          chainMasteryState.chainMastery.getPrevPromptLevel(stepAttempt.target_prompt_level).key,
        );
      }
    }

    nextStep();
  };

  // Set completed to true for this step attempt
  const onStepComplete = () => {
    if (stepAttempt && chainStep && chainMasteryState.chainMastery) {
      // Mark as completed = true and at the target prompt level, regardless of step status.
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'completed', true);
      chainMasteryState.chainMastery.updateDraftSessionStep(
        chainStep.id,
        'prompt_level',
        stepAttempt.target_prompt_level,
      );
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'reason_step_incomplete', undefined);

      const currentFocusStep = chainMasteryState.chainMastery.draftFocusStepAttempt;

      // Focus steps and booster steps are completed with no additional prompting beyond the target prompt level.
      if (stepAttempt.status === ChainStepStatus.focus || stepAttempt.status === ChainStepStatus.booster_needed) {
        chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'was_prompted', false);
      }

      // Not-yet-started steps are marked as complete, but with additional prompting at the target prompt level.
      else if (
        currentFocusStep &&
        (stepAttempt.status === ChainStepStatus.not_yet_started ||
          stepAttempt.status === ChainStepStatus.not_complete) &&
        stepAttempt.chain_step_id > currentFocusStep.chain_step_id
      ) {
        chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'was_prompted', true);
      }

      // All other step types (mastered, booster_mastered) are recorded as needing no additional prompting.
      else {
        chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'was_prompted', false);
      }
    }

    nextStep();
  };

  return video && chainSteps && chainStep && stepIndex !== undefined ? (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brush Teeth'} />
        <View style={styles.progress}>
          <Text style={styles.headline}>{`Step ${chainStep.id + 1}: ${chainStep.instruction}`}</Text>
          <View style={styles.progressContainer}>
            <MasteryIcon chainStepStatus={stepAttempt?.status} iconSize={50} />
            <ProgressBar
              currentStepIndex={stepIndex}
              totalSteps={chainSteps.length}
              masteryLevel={'focus'}
              chainSteps={chainSteps}
            />
          </View>
        </View>
        <PromptLevel chainStepId={chainStep.id} prevFocusStepAttempts={pastFocusStepAttempts} />
        <View style={styles.subContainer}>
          <View style={[styles.subVideoContainer]}>
            <ReturnVideoComponent />
          </View>
        </View>
      </View>
      <View style={styles.nextBackBtnsContainer}>
        <Button
          style={styles.backButton}
          labelStyle={{ alignSelf: 'flex-start', fontSize: 24, paddingVertical: 5, marginHorizontal: 10 }}
          disabled={!stepIndex}
          color={CustomColors.uva.blue}
          mode={'outlined'}
          onPress={prevStep}
        >{`Previous Step`}</Button>
        <View style={{ ...styles.nextBackSubContainer, justifyContent: 'space-between' }}>
          <Button
            style={{ ...styles.nextPromptButton, marginHorizontal: 10, marginVertical: 5 }}
            labelStyle={{ fontSize: 24, paddingVertical: 10, marginHorizontal: 10, marginVertical: 5 }}
            color={CustomColors.uva.blue}
            mode={'contained'}
            onPress={onStepComplete}
          >{`Step Complete`}</Button>

          <Button
            style={{
              ...styles.nextPromptButton,
              marginHorizontal: 10,
              marginVertical: 5,
              display: showNeededPromptingButton() ? 'flex' : 'none',
            }}
            labelStyle={{ fontSize: 24, paddingVertical: 10, marginHorizontal: 10, marginVertical: 5 }}
            color={CustomColors.uva.orange}
            mode={'contained'}
            onPress={onNeededPrompting}
          >{`Needed Prompting`}</Button>
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
    justifyContent: 'space-around',
    alignContent: 'center',
    padding: 5,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
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
  neededPromptingBtn: {
    textAlign: 'center',
  },
  nextBackBtnsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  nextBackSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  nextPromptButton: {
    marginHorizontal: 5,
    marginVertical: 5,
    width: 380,
  },

  needAddlPrompt: {
    color: CustomColors.uva.grayDark,
    alignSelf: 'center',
    textAlign: 'center',
  },
  nextButton: {},
  backButton: {
    alignSelf: 'center',
    // marginVertical: 5,
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default StepScreen;

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
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelLabels,
  ChainStepPromptLevelMap,
  ChainStepStatus,
  StepAttempt,
} from '../types/chain/StepAttempt';

const StepScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState<number>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainStep, setChainStep] = useState<ChainStep>();
  const [stepAttempt, setStepAttempt] = useState<StepAttempt>();
  const chainMasteryState = useChainMasteryState();
  const [pastFocusStepAttempts, setPastFocusStepAttempts] = useState<boolean[]>();
  const [video, setVideo] = useState<AVPlaybackSource>();

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
      if (!isCancelled && stepIndex !== undefined && chainMasteryState.chainMastery) {
        setVideo(videos['step_' + (stepIndex + 1)]);
        setChainStep(chainMasteryState.chainMastery.chainSteps[stepIndex]);
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

  const VideoForStep = (): JSX.Element => {
    const height = Dimensions.get('screen').height / 2.5;

    if (video && stepIndex !== undefined) {
      const key = 'step_' + (stepIndex + 1);
      return (
        <View style={{ height: height, backgroundColor: CustomColors.uva.gray }}>
          <VideoPlayer
            key={'video-player-' + key}
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
            height={height}
          />
        </View>
      );
    } else {
      return (
        <View style={{ height: height, backgroundColor: CustomColors.uva.gray }}>
          <Loading />
        </View>
      );
    }
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
    if (showNeededPromptingButton()) {
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
    }
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

  const neededPromptingButtonText = () => {
    return showNeededPromptingButton()
      ? `Beyond ${
          stepAttempt && stepAttempt.target_prompt_level
            ? ChainStepPromptLevelMap[stepAttempt.target_prompt_level].value
            : 'target prompt level'
        }`
      : `${ChainStepPromptLevelLabels.full_physical} is the maximum prompt level.`;
  };

  return chainSteps && chainStep && stepIndex !== undefined && video ? (
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
            <VideoForStep />
          </View>
        </View>
      </View>
      <View style={styles.nextBackBtnsContainer}>
        <Button
          style={styles.backButton}
          labelStyle={{ fontSize: 24, paddingVertical: 10, marginHorizontal: 10, marginVertical: 5 }}
          disabled={!stepIndex}
          color={CustomColors.uva.blue}
          mode={'outlined'}
          onPress={prevStep}
        >{`Previous Step`}</Button>
        <Button
          style={styles.nextButton}
          labelStyle={{ fontSize: 24, paddingVertical: 10, marginHorizontal: 10, marginVertical: 5 }}
          color={CustomColors.uva.blue}
          mode={'contained'}
          onPress={onStepComplete}
        >{`Step Complete`}</Button>
      </View>
      <View style={styles.nextBackBtnsContainer}>
        <Button
          style={styles.additionalPromptingButton}
          mode={'contained'}
          color={showNeededPromptingButton() ? CustomColors.uva.orange : CustomColors.uva.grayMedium}
          onPress={onNeededPrompting}
        >
          <View style={{ paddingVertical: 10, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 24,
                color: showNeededPromptingButton() ? 'white' : CustomColors.uva.gray,
              }}
            >
              {showNeededPromptingButton() ? `Needed Additional Prompting` : 'No Additional Prompting Possible'}
            </Text>
            <Text style={{ fontSize: 16, color: showNeededPromptingButton() ? 'white' : CustomColors.uva.grayDark }}>
              {neededPromptingButtonText()}
            </Text>
          </View>
        </Button>
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
  nextBackSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
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
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    flexGrow: 1,
    marginRight: 10,
  },
  nextButton: {
    flexGrow: 1,
    marginLeft: 10,
  },
  additionalPromptingButton: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default StepScreen;

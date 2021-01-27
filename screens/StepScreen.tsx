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

const StepScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState<number>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
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

  const incrIndex = () => {
    if (stepIndex !== undefined) {
      setVideo(undefined);
      setStepIndex(stepIndex + 1);
    }
  };

  const decrIndex = () => {
    if (stepIndex !== undefined && stepIndex > 0) {
      setVideo(undefined);
      setStepIndex(stepIndex - 1);
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

  return (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brush Teeth'} />
        {chainSteps && stepIndex !== undefined ? (
          <View style={styles.progress}>
            <Text style={styles.headline}>
              {`Step ${chainSteps[stepIndex].id + 1}: ${chainSteps[stepIndex].instruction}`}
            </Text>
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
        ) : (
          <Loading />
        )}
        <StarsNIconsContainer />
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
            onPress={() => {
              decrIndex();
            }}
          >{`Previous Step`}</Button>
          <View style={styles.nextBackSubContainer}>
            <Text style={styles.needAddlPrompt}>{`Needed Add'l Prompting`}</Text>
            <Button
              style={styles.neededPromptingBtn}
              labelStyle={{ fontSize: 24, paddingVertical: 5, color: CustomColors.uva.white }}
              color={CustomColors.uva.orange}
              mode={'contained'}
              onPress={() => {
                console.log('NEEDING PROMPTING');
              }}
            >{`+`}</Button>
            <Button
              style={styles.nextButton}
              labelStyle={{ fontSize: 24, paddingVertical: 5 }}
              color={CustomColors.uva.blue}
              mode={'contained'}
              onPress={() => {
                if (!chainSteps || stepIndex === undefined) {
                  console.error('chainSteps and/or stepIndex not loaded.');
                  return;
                }

                const chainStep = chainSteps[stepIndex];

                // Set this step attempt to completed = true
                if (chainMasteryState.chainMastery) {
                  chainMasteryState.chainMastery.updateDraftSessionStep(chainStep.id, 'completed', true);
                }

                if (stepIndex + 1 <= chainSteps.length - 1) {
                  incrIndex();
                } else {
                  navigation.navigate('RewardsScreens');
                }
              }}
            >{`Step Complete`}</Button>
          </View>
        </View>
      </View>
    </ImageBackground>
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

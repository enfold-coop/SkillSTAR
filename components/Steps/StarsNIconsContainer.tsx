import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainStepPromptLevel } from '../../types/chain/StepAttempt';
import ChallengingBehavBtn from './ChallengingBehavBtn';
import StepAttemptStars from './StepAttemptStars';

interface StarsNIconsContainerProps {
  chainStepId: number;
  prevFocusStepAttempts: boolean[] | undefined;
}

const StarsNIconsContainer = (props: StarsNIconsContainerProps): JSX.Element => {
  const { chainStepId, prevFocusStepAttempts } = props;
  const [promptLevel, setPromptLevel] = useState<ChainStepPromptLevel>();
  const chainMasteryState = useChainMasteryState();

  // Runs when chain mastery state is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (
        !isCancelled &&
        chainStepId !== undefined &&
        chainMasteryState.chainMastery &&
        chainMasteryState.chainMastery.masteryInfoMap
      ) {
        if (chainMasteryState.chainMastery.masteryInfoMap[chainStepId].promptLevel) {
          setPromptLevel(chainMasteryState.chainMastery.masteryInfoMap[chainStepId].promptLevel);
        } else {
          const focusStepAttempts = chainMasteryState.chainMastery.getFocusStepAttemptsForChainStep(chainStepId);
          if (focusStepAttempts && focusStepAttempts.length > 0) {
            setPromptLevel(focusStepAttempts[focusStepAttempts.length - 1].target_prompt_level);
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
  }, [chainStepId, chainMasteryState.chainMastery]);

  return (
    <View style={styles.container}>
      {promptLevel && prevFocusStepAttempts ? (
        <StepAttemptStars promptLevel={promptLevel} attemptsWPromptType={prevFocusStepAttempts} />
      ) : (
        <View>
          <Text>{` `}</Text>
        </View>
      )}
      <ChallengingBehavBtn chainStepId={chainStepId} />
    </View>
  );
};

export default StarsNIconsContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainStepPromptLevel } from '../../types/chain/StepAttempt';
import { Empty } from '../Empty/Empty';
import ChallengingBehavBtn from './ChallengingBehavBtn';
import StepAttemptStars from './StepAttemptStars';

interface PromptLevelProps {
  chainStepId: number;
}

const PromptLevel = (props: PromptLevelProps): JSX.Element => {
  const { chainStepId } = props;
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
      {promptLevel ? <StepAttemptStars promptLevel={promptLevel} chainStepId={chainStepId} /> : <Empty />}
      <ChallengingBehavBtn chainStepId={chainStepId} />
    </View>
  );
};

export default PromptLevel;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

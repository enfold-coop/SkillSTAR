import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NUM_COMPLETE_ATTEMPTS_FOR_MASTERY } from '../../constants/MasteryAlgorithm';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevel, ChainStepPromptLevelMap } from '../../types/chain/StepAttempt';
import { Empty } from '../Empty/Empty';

interface StepAttemptStarsProps {
  promptLevel?: ChainStepPromptLevel;
  chainStepId?: number;
}

const StepAttemptStars = (props: StepAttemptStarsProps): JSX.Element => {
  const { promptLevel, chainStepId } = props;
  const chainMasteryState = useChainMasteryState();
  const [numStars, setNumStars] = useState<number>(0);

  useEffect(() => {
    if (chainStepId !== undefined && chainMasteryState.chainMastery) {
      setNumStars(chainMasteryState.chainMastery.getNumStars(chainStepId));
    }
  }, [chainStepId]);

  const Stars = (): JSX.Element => {
    const icons: JSX.Element[] = [];

    for (let i = 0; i < NUM_COMPLETE_ATTEMPTS_FOR_MASTERY; i++) {
      const iconName = i < numStars ? 'star' : 'staro';
      icons.push(
        <AntDesign
          name={iconName}
          size={30}
          color={CustomColors.uva.mountain}
          style={styles.star}
          key={`star-icon-${i}`}
        />,
      );
    }

    return <View style={styles.starContainer}>{icons}</View>;
  };

  return promptLevel && chainStepId !== undefined ? (
    <View style={styles.container}>
      <Text style={styles.promptLevelText}>{'Prompt Level: ' + ChainStepPromptLevelMap[promptLevel].shortName}</Text>
      <Stars />
    </View>
  ) : (
    <Empty />
  );
};

export default StepAttemptStars;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  promptLevelText: {
    paddingLeft: 10,
    paddingTop: 50,
    fontSize: 22,
    fontWeight: '500',
    color: '#222',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 22,
  },
  star: {},
});

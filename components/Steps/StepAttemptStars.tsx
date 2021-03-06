import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevel, ChainStepPromptLevelMap } from '../../types/chain/StepAttempt';

interface StepAttemptStarsProps {
  promptLevel?: ChainStepPromptLevel;
  attemptsWereSuccessful: boolean[] | undefined;
}

const StepAttemptStars = (props: StepAttemptStarsProps): JSX.Element => {
  const { promptLevel, attemptsWereSuccessful } = props;

  const Stars = (): JSX.Element => {
    const arr =
      !attemptsWereSuccessful || attemptsWereSuccessful.length === 0 ? [false, false, false] : attemptsWereSuccessful;

    const numSuccess = arr.slice(-3).filter((completed) => completed).length;
    const icons = [];

    for (let i = 0; i < 3; i++) {
      const iconName = i < numSuccess ? 'star' : 'staro';
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

  return promptLevel && attemptsWereSuccessful ? (
    <View style={styles.container}>
      <Text style={styles.promptLevelText}>{'Prompt Level: ' + ChainStepPromptLevelMap[promptLevel].shortName}</Text>
      <Stars />
    </View>
  ) : (
    <View>
      <Text>{` `}</Text>
    </View>
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

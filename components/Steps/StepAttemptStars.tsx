import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevel, ChainStepPromptLevelMap } from '../../types/chain/StepAttempt';

interface StepAttemptStarsProps {
  promptLevel?: ChainStepPromptLevel;
  attemptsWPromptType: boolean[] | undefined;
}

const StepAttemptStars = (props: StepAttemptStarsProps): JSX.Element => {
  const { promptLevel, attemptsWPromptType } = props;

  const Stars = (): JSX.Element => {
    if (!(attemptsWPromptType && attemptsWPromptType.length > 0)) {
      return (
        <View>
          <Text>{` `}</Text>
        </View>
      );
    }

    const numSuccess = attemptsWPromptType.slice(-3).filter((completed) => completed).length;
    const icons = [];

    for (let i = 0; i < 3; i++) {
      const iconName = i < numSuccess - 1 ? 'star' : 'staro';
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

  return promptLevel && attemptsWPromptType ? (
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
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  promptLevelText: {
    paddingRight: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  starContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  star: {},
});

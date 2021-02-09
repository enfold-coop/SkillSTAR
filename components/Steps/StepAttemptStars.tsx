import { MaterialIcons } from '@expo/vector-icons';
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

  return promptLevel && attemptsWPromptType ? (
    <View style={styles.container}>
      <Text style={styles.promptLevelText}>{'Prompt Level: ' + ChainStepPromptLevelMap[promptLevel].shortName}</Text>
      <View style={styles.starContainer}>
        {attemptsWPromptType &&
          attemptsWPromptType?.slice(0, 3).map((completed, i) => {
            if (completed) {
              return (
                <MaterialIcons name={'check'} size={30} color={CustomColors.uva.green} style={styles.star} key={i} />
              );
            } else {
              return (
                <MaterialIcons
                  name={'close'}
                  size={30}
                  color={CustomColors.uva.redEmergency}
                  style={styles.star}
                  key={i}
                />
              );
            }
          })}
      </View>
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

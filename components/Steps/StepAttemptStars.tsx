import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';
import { StepAttempt } from '../../types/chain/StepAttempt';

interface StepAttemptStarsProps {
  promptType: string;
  attemptsWPromptType: boolean[] | undefined;
}

const StepAttemptStars = (props: StepAttemptStarsProps): JSX.Element => {
  const { attemptsWPromptType } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.promptTypeText}>{props.promptType + ':'}</Text>
      <View style={styles.starContainer}>
        {attemptsWPromptType &&
          attemptsWPromptType?.slice(0, 3).map((e, i) => {
            if (e) {
              return <AntDesign name={'star'} size={50} color={CustomColors.uva.orange} style={styles.star} key={i} />;
            } else {
              return <AntDesign name={'staro'} size={50} color={CustomColors.uva.orange} style={styles.star} key={i} />;
            }
          })}
      </View>
    </View>
  );
};

export default StepAttemptStars;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '33%',
  },
  promptTypeText: {
    alignSelf: 'center',
    paddingRight: 20,
    fontSize: 30,
    fontWeight: '800',
    color: '#333',
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {},
});

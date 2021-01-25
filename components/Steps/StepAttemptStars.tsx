import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';

interface StepAttemptStarsProps {
  promptType: string;
  attemptsWPromptType: boolean[];
}

const StepAttemptStars = (props: StepAttemptStarsProps): JSX.Element => {
  const { attemptsWPromptType } = props;
  return (
    <View style={styles.container}>
      <View style={styles.subContainer} />
      <View style={styles.starContainer}>
        <Text style={styles.promptTypeText}>{props.promptType + ':'}</Text>
        {attemptsWPromptType.map((e, i) => {
          if (e) {
            return <AntDesign name={'star'} size={40} color={CustomColors.uva.orange} style={styles.star} key={i} />;
          } else {
            return <AntDesign name={'staro'} size={40} color={CustomColors.uva.orange} style={styles.star} key={i} />;
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
    padding: 10,
    // alignContent: "center",
  },
  subContainer: {},
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

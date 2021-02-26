import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColors from '../../styles/Colors';

const ColumnLabels = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={[styles.mastery, styles.text]}>{`Mastery`}</Text>
      <Text style={[styles.step, styles.text]}>{`Step`}</Text>
      <Text style={[styles.promptLevel, styles.text]}>{`Target Prompt Level`}</Text>
      <Text style={[styles.completed, styles.text]}>{`Task Completed as Recommended?`}</Text>
      <Text style={[styles.challBehav, styles.text]}>{`Challenging Behavior?`}</Text>
    </View>
  );
};

export default ColumnLabels;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    margin: 10,
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
    borderColor: CustomColors.uva.sky,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    color: CustomColors.uva.mountain,
  },
  mastery: {
    width: '10%',
    flexDirection: 'column',
  },
  step: {
    alignSelf: 'flex-start',
    width: '30%',
  },
  promptLevel: {
    width: '10%',
  },
  completed: {
    width: '20%',
  },
  challBehav: {
    width: '20%',
  },
});

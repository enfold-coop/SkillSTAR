import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  // step: string;
};

const ProbeAside = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Probe Session</Text>
      <Text style={styles.instructionText}>
        Start the probe with a simple instruction, “It’s time to brush your teeth.”
      </Text>
      <Text style={styles.instructionText}>
        Do not provide any prompting or supports to the student. If a step is performed incorrectly,
        out of sequence, or the time limit for completing the step (5s) is exceeded, complete the
        step for the learner.
      </Text>
    </View>
  );
};

export default ProbeAside;

const styles = StyleSheet.create({
  container: {},
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 16,
    padding: 5,
  },
});

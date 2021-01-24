import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChainSessionType } from '../../types/chain/ChainSession';
import { ChainStepPromptLevel, StepAttempt } from '../../types/chain/StepAttempt';

interface TrainingAsideProps {
  sessionType?: ChainSessionType;
  stepAttempt?: StepAttempt;
  promptLevel?: ChainStepPromptLevel;
}

const TrainingAside = (props: TrainingAsideProps): JSX.Element => {
  const { sessionType, stepAttempt, promptLevel } = props;

  return sessionType && stepAttempt && promptLevel ? (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`${sessionType} Session`}</Text>
      <Text style={styles.instructionText}>
        {`Focus Step: ${stepAttempt.chain_step ? stepAttempt.chain_step.instruction : '...'}`}
      </Text>
      <Text style={styles.instructionText}>{`Prompt Level ${promptLevel}`}</Text>
    </View>
  ) : (
    <View>
      <Text>{`sessionType: ${sessionType ? 'Done' : 'Loading...'}`}</Text>
      <Text>{`stepAttempt: ${stepAttempt ? 'Done' : 'Loading...'}`}</Text>
      <Text>{`promptLevel: ${promptLevel ? 'Done' : 'Loading...'}`}</Text>
    </View>
  );
};

export default TrainingAside;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 200,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 16,
    padding: 5,
  },
});

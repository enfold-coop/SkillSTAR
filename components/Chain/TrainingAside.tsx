import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainSessionType, ChainSessionTypeMap } from '../../types/chain/ChainSession';
import { ChainStep } from '../../types/chain/ChainStep';
import { ChainStepPromptLevel, ChainStepPromptLevelMap, StepAttempt } from '../../types/chain/StepAttempt';
import { Loading } from '../Loading/Loading';
import { TRAINING_INSTRUCTIONS } from './chainshome_text_assets/chainshome_text';

// TODO: Aside content...
//  - Focus step
//  - Session type
//  - Target prompt level
//  - Current chain step mastery level
//  - Instructions

const TrainingAside = (): JSX.Element => {
  const chainMasteryState = useChainMasteryState();

  const getHeaderText = (): string => {
    const stepAttempt = chainMasteryState.chainMastery?.draftFocusStepAttempt;
    if (stepAttempt && stepAttempt.session_type) {
      const typeMap = ChainSessionTypeMap[stepAttempt.session_type as string];

      if (typeMap) {
        return typeMap.value;
      }
    }

    return '';
  };

  const getFocusStepInstructions = (): string => {
    const stepAttempt = chainMasteryState.chainMastery?.draftFocusStepAttempt;
    console.log(stepAttempt);

    if (stepAttempt && stepAttempt.chain_step) {
      return stepAttempt.chain_step.instruction;
    }

    return '';
  };

  const getPromptLevel = (): string => {
    const stepAttempt = chainMasteryState.chainMastery?.draftFocusStepAttempt;
    if (stepAttempt && stepAttempt.target_prompt_level) {
      const typeMap = ChainStepPromptLevelMap[stepAttempt.target_prompt_level as string];

      if (typeMap) {
        return typeMap.value;
      }
    }

    return '';
  };

  return chainMasteryState.chainMastery ? (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`${getHeaderText()} Session`}</Text>
      {chainMasteryState.chainMastery.draftFocusStepAttempt && (
        <View>
          <Text style={styles.instructionText}>{`Focus Step: ${getFocusStepInstructions()}`}</Text>
          <Text style={styles.instructionText}>{`Prompt Level: ${getPromptLevel()}`}</Text>
          {/* Get mastery of step prompt-level */}
          {/* <Text style={styles.instructionText}>{`Mastery of Prompt Level: ${()}`}</Text> */}
        </View>
      )}
    </View>
  ) : (
    <Loading />
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

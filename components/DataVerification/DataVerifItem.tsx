import React, { FC, useEffect, useState } from 'react';
import { Image, ImageRequireSource, StyleSheet, Text, View } from 'react-native';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStep } from '../../types/chain/ChainStep';
import { ChainStepPromptLevel, StepAttempt } from '../../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';
import BehavAccordion from './BehavAccordion';
import BehavDataVerifSwitch from './BehavDataVerifSwitch';
import PromptAccordion from './PromptAccordion';
import PromptDataVerifSwitch from './PromptDataVerifSwitch';

const getPromptIcon = (level: string): ImageRequireSource => {
  const icons: { [key: string]: ImageRequireSource } = {
    none: require('../../assets/icons/ip_prompt_icon.png'),
    shadow: require('../../assets/icons/sp_prompt_icon.png'),
    partial_physical: require('../../assets/icons/pp_prompt_icon.png'),
    full_physical: require('../../assets/icons/fp_prompt_icon.png'),
  };

  return icons[level];
};

interface DataVerifItemProps {
  chainStepId: number;
}

const DataVerifItem = (props: DataVerifItemProps): JSX.Element => {
  const { chainStepId } = props;
  const [promptSwitch, setPromptSwitch] = useState(false);
  const [behavSwitch, setBehavSwitch] = useState(false);
  const [promptIcon, setPromptIcon] = useState<ImageRequireSource>();
  const [stepAttempt, setStepAttempt] = useState<StepAttempt>();
  const chainMasteryState = useChainMasteryState();

  /** Lifecycle calls */
  // Runs when session is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && !stepAttempt && chainMasteryState.chainMastery) {
        const stateStepAttempt = chainMasteryState.chainMastery.getDraftSessionStep(chainStepId);
        setStepAttempt(stateStepAttempt);
      }

      if (!isCancelled && stepAttempt && !promptIcon) {
        const promptLevel = stepAttempt.prompt_level || ChainStepPromptLevel.full_physical;
        const _promptLevelIcon = getPromptIcon(promptLevel as string);
        setPromptIcon(_promptLevelIcon);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [stepAttempt]);
  /** END: Lifecycle calls */

  const handlePromptSwitch: DataVerificationControlCallback = async (chainStepId, fieldName, fieldValue) => {
    setPromptSwitch(!promptSwitch);
  };
  const handleBehavSwitch: DataVerificationControlCallback = async (chainStepId, fieldName, fieldValue) => {
    setBehavSwitch(!behavSwitch);
  };

  return chainMasteryState.chainMastery &&
    promptIcon &&
    stepAttempt &&
    stepAttempt.chain_step &&
    stepAttempt.chain_step_id !== undefined ? (
    <View style={styles.container}>
      <View style={styles.defaultFormContainer}>
        <MasteryIcon chainStepStatus={stepAttempt.status} iconSize={40} />
        <Text style={styles.stepTitle}>{`"${stepAttempt.chain_step.instruction}"`}</Text>
        <Image style={styles.promptLevelImage} source={promptIcon} resizeMode={'contain'} />
        <View style={styles.switchContainer}>
          <View style={styles.questionContainer}>
            <PromptDataVerifSwitch
              fieldName={'prompt_level'}
              chainStepId={stepAttempt.chain_step_id}
              handleSwitch={handlePromptSwitch}
            />
          </View>
          <View style={styles.questionContainer}>
            <BehavDataVerifSwitch
              name={'had_challenging_behavior'}
              chainStepId={stepAttempt.chain_step_id}
              handleSwitch={handleBehavSwitch}
            />
          </View>
        </View>
      </View>
      <View style={styles.accordionContainer}>
        <PromptAccordion switched={promptSwitch} stepAttempt={stepAttempt} />
        <BehavAccordion switched={behavSwitch} stepAttempt={stepAttempt} />
      </View>
    </View>
  ) : (
    <Text>{`...`}</Text>
  );
};

export default DataVerifItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    marginLeft: 30,
    marginRight: 30,
    borderColor: CustomColors.uva.sky,
    backgroundColor: CustomColors.uva.sky,
  },
  defaultFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  accordionContainer: {},
  masteryIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 0,
  },
  promptLevelIcon: {
    fontSize: 20,
    fontWeight: '800',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: CustomColors.uva.gray,
    color: CustomColors.uva.gray,
    padding: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  promptLevelImage: {
    width: 32,
    height: 32,
    alignSelf: 'center',
  },
  stepTitle: {
    width: '30%',
    alignSelf: 'center',
    fontSize: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  questionContainer: {
    flexDirection: 'column',
    margin: 10,
    marginBottom: 10,
  },
  questionSubContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'space-around',
  },
  accordion: {
    backgroundColor: '#f0f',
    width: 200,
    height: 200,
  },
  btnContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  yesNoBtn: {
    width: 144,
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  nextBtnContainer: {},
});

import React, { FC, useState } from 'react';
import { Image, ImageRequireSource, StyleSheet, Text, View } from 'react-native';
import { chainSteps } from '../../data/chainSteps';
import CustomColors from '../../styles/Colors';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { StepAttempt } from '../../types/CHAIN/StepAttempt';
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

type Props = {
  stepAttempt: StepAttempt;
};

const DataVerifItem: FC<Props> = props => {
  const { stepAttempt } = props;
  const [promptSwitch, setPromptSwitch] = useState(false);
  const [behavSwitch, setBehavSwitch] = useState(false);
  const [icon, setIcon] = useState();
  const [promptIcon, setPromptIcon] = useState<ImageRequireSource>();

  const handlePromptSwitch: DataVerificationControlCallback = async (
    chainStepId,
    fieldName,
    fieldValue,
  ) => {
    setPromptSwitch(!promptSwitch);
  };
  const handleBehavSwitch: DataVerificationControlCallback = async (
    chainStepId,
    fieldName,
    fieldValue,
  ) => {
    setBehavSwitch(!behavSwitch);
  };

  const promptLevelIcon = () => {
    const _promptLevelIcon = getPromptIcon(stepAttempt.prompt_level as string);
    setPromptIcon(_promptLevelIcon);
  };

  return chainSteps && stepAttempt && stepAttempt.chain_step ? (
    <View style={styles.container}>
      <View style={styles.defaultFormContainer}>
        <MasteryIcon chainStepStatus={stepAttempt.status} />
        <Text style={styles.stepTitle}>"{stepAttempt.chain_step.instruction}"</Text>
        <Text style={styles.promptLevelIcon}>{'FP'}</Text>
        <Image style={styles.promptLevelIcon} source={promptIcon} resizeMode='contain' />
        <View style={styles.switchContainer}>
          <View style={styles.questionContainer}>
            <PromptDataVerifSwitch
              name={'prompt_level'}
              chainStepId={stepAttempt.chain_step_id !== undefined ? stepAttempt.chain_step_id : -1}
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
    <Text>Error</Text>
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
    // width: 30,
    // height: 30,
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

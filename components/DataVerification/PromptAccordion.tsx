import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevel, ChainStepPromptLevelMap } from '../../types/chain/StepAttempt';

interface PromptAccordionProps {
  chainStepId: number;
  completed: boolean;
}

const PromptAccordion = (props: PromptAccordionProps): JSX.Element => {
  const { chainStepId } = props;
  const [checked, setChecked] = useState<number>();
  const [promptValues, setPromptValues] = useState<ChainStepPromptLevelMap[]>();
  const refSwitched = useRef(true);
  const chainMasteryState = useChainMasteryState();
  const { completed } = props;

  /**
   * BEGIN: Lifecycle methods
   */
  // Runs when completed is changed
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && completed !== undefined) {
        if (refSwitched.current) {
          refSwitched.current = false;
          removeNoPrompt();
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [completed]);
  /**
   * END: Lifecycle methods
   */

  const removeNoPrompt = () => {
    const sansNoPrompt: ChainStepPromptLevelMap[] = Object.values(ChainStepPromptLevelMap).slice(1);
    setPromptValues(sansNoPrompt);
  };

  const determineCheckedValue = () => {};

  // Store change in draft session
  const handleChange = (radioButtonIndex: number) => {
    setChecked(radioButtonIndex);
    const enumMap = Object.values(ChainStepPromptLevelMap)[radioButtonIndex];

    if (chainMasteryState.chainMastery && chainStepId !== undefined) {
      chainMasteryState.chainMastery.updateDraftSessionStep(
        chainStepId,
        'prompt_level',
        enumMap.key as ChainStepPromptLevel,
      );
    }
  };

  return (
    <Animatable.View style={styles.container}>
      <View style={styles.promptSubContainer}>
        <Text style={styles.question}>{`What prompt did you use to complete the step?`}</Text>
        <View style={styles.promptOptsContainer}>
          {promptValues &&
            promptValues.map((e, i) => {
              return (
                <View style={styles.checkboxContainer} key={randomId()}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      padding: 0,
                      borderRadius: 100,
                      borderWidth: 2,
                      borderColor: CustomColors.uva.gray,
                    }}
                  >
                    <RadioButton
                      color={CustomColors.uva.orange}
                      value={e.key}
                      status={checked === i ? 'checked' : 'unchecked'}
                      onPress={() => handleChange(i)}
                    />
                  </View>
                  <Text style={styles.radioBtnText}>{e.value}</Text>
                </View>
              );
            })}
        </View>
      </View>
    </Animatable.View>
  );
};

export default PromptAccordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 5,
    marginBottom: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    backgroundColor: CustomColors.uva.white,
  },
  promptSubContainer: {
    paddingBottom: 10,
  },
  promptOptsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  checkboxContainer: {
    marginRight: 5,
    flexDirection: 'row',
    alignContent: 'center',
    margin: 5,
  },
  radioBtnText: {
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 20,
  },
  question: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    padding: 5,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { StepIncompleteReason, StepIncompleteReasonMap } from '../../types/chain/StepAttempt';

interface BehavAccordionProps {
  chainStepId: number;
  completed: boolean;
  hadChallengingBehavior: boolean;
}

const BehavAccordion = (props: BehavAccordionProps): JSX.Element => {
  const [checked, setChecked] = useState(0);
  const refSwitched = useRef(true);
  const { chainStepId, completed, hadChallengingBehavior } = props;
  const chainMasteryState = useChainMasteryState();

  /**
   * BEGIN: Lifecycle methods
   */
  // Runs when completed or hadChallengingBehavior are changed
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && chainMasteryState.chainMastery) {
        const stateStepAttempt = chainMasteryState.chainMastery.getDraftSessionStep(chainStepId);

        if (stateStepAttempt.reason_step_incomplete) {
          setChecked(StepIncompleteReasonMap[stateStepAttempt.reason_step_incomplete].order);
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [chainStepId, chainMasteryState.chainMastery]);

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && completed !== undefined && hadChallengingBehavior !== undefined) {
        if (refSwitched.current) {
          refSwitched.current = false;
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [completed, hadChallengingBehavior]);
  /**
   * END: Lifecycle methods
   */

  // Store change in draft session
  const handleChange = (radioButtonIndex: number) => {
    setChecked(radioButtonIndex);
    const enumMap = Object.values(StepIncompleteReasonMap)[radioButtonIndex];

    if (chainMasteryState.chainMastery && chainStepId !== undefined) {
      chainMasteryState.chainMastery.updateDraftSessionStep(
        chainStepId,
        'reason_step_incomplete',
        enumMap.key as StepIncompleteReason,
      );
    }
  };

  return (
    <Animatable.View style={styles.container}>
      <View style={styles.behavSubContainer}>
        <Text style={styles.question}>{`What was the primary reason for failing to complete the task?`}</Text>
        <View style={styles.behavOptsContainer}>
          {Object.values(StepIncompleteReasonMap).map((e, i) => {
            return (
              <View style={styles.checkboxContainer} key={randomId()}>
                <View
                  style={{
                    padding: 0,
                    borderRadius: 100,
                    borderWidth: 2,
                    backgroundColor: CustomColors.uva.white,
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

export default BehavAccordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingBottom: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: CustomColors.uva.white,
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
    fontSize: 16,
  },

  behavSubContainer: {
    paddingBottom: 10,
    marginLeft: 20,
  },
  behavOptsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
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

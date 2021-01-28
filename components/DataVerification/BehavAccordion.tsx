import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import CustomColors from '../../styles/Colors';
import { StepIncompleteReasonMap } from '../../types/chain/StepAttempt';
import { MOCK_BEHAV_Q } from './mock_session';

interface BehavAccordionProps {
  chainStepId: number;
  hadChallengingBehavior: boolean;
}

const BehavAccordion = (props: BehavAccordionProps): JSX.Element => {
  const [checked, setChecked] = React.useState(0);
  const [expanded, setExpanded] = useState(false);
  const refSwitched = useRef(true);
  const { hadChallengingBehavior } = props;

  /**
   * BEGIN: Lifecycle methods
   */
  useEffect(() => {
    if (refSwitched.current) {
      refSwitched.current = false;
    } else {
      setExpanded(hadChallengingBehavior);
    }
  }, [hadChallengingBehavior]);
  /**
   * END: Lifecycle methods
   */

  /**
   *
   * SET DATA:
   * - setBehavValue([behav index "checked"])
   *
   */

  return (
    <Animatable.View style={[styles.container, { display: expanded ? 'flex' : 'none' }]}>
      <View style={styles.behavSubContainer}>
        <Text style={styles.question}>{`What was the primary reason for failing to complete the task?`}</Text>
        <View style={[styles.behavOptsContainer]}>
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
                    onPress={() => setChecked(i)}
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

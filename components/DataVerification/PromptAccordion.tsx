import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevelMap } from '../../types/chain/StepAttempt';

interface PromptAccordionProps {
  chainStepId: number;
  completed: boolean;
}

const PromptAccordion = (props: PromptAccordionProps): JSX.Element => {
  const { chainStepId, completed } = props;
  const [checked, setChecked] = React.useState(0);
  const [expanded, setExpanded] = useState(false);

  /**
   * BEGIN: Lifecycle methods
   */
  useEffect(() => {
    console.log('PromptAccordion.tsx > useEffect > chainStepId', chainStepId);
    setExpanded(!completed);
  }, [completed]);
  /**
   * END: Lifecycle methods
   */

  // TODO: SET DATA:
  //  - setBehavValue([behav index "checked"])

  return (
    <Animatable.View style={[styles.container, { display: expanded ? 'flex' : 'none' }]}>
      <View style={styles.promptSubContainer}>
        <Text style={styles.question}>{`What prompt did you use to complete the step?`}</Text>
        <View style={[styles.promptOptsContainer]}>
          {Object.values(ChainStepPromptLevelMap).map((e, i) => {
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

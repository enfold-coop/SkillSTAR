import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import CustomColors from '../../styles/Colors';
import { StepAttempt } from '../../types/CHAIN/StepAttempt';
import { MOCK_PROMP_Q, MOCK_PROMPT_OPTS } from './mock_session';

type Props = {
  stepAttempt: StepAttempt;
  switched: boolean;
};

const PromptAccordion: FC<Props> = props => {
  const { switched } = props;
  const [checked, setChecked] = React.useState(0);
  const [expanded, setExpanded] = useState(false);
  const [promptOpts, setpromptOpts] = useState(MOCK_PROMPT_OPTS);
  const [promptQ, setpromptQ] = useState(MOCK_PROMP_Q);

  /**
   * BEGIN: Lifecycle methods
   */
  useEffect(() => {
    setExpanded(switched);
  }, [switched]);
  /**
   * END: Lifecycle methods
   */

  /**
   * SET DATA:
   * - setBehavValue([behav index "checked"])
   */

  return (
    <Animatable.View style={[styles.container, { display: switched ? 'flex' : 'none' }]}>
      <View style={styles.promptSubContainer}>
        <Text style={styles.question}>{promptQ}</Text>
        <View style={[styles.promptOptsContainer]}>
          {promptOpts.map((e, i) => {
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
                    value={e + 'YOYOYOYOYOYO'}
                    status={checked === i ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(i)}
                  />
                </View>
                <Text style={styles.radioBtnText}>{e}</Text>
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

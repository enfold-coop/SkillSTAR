import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';

interface ListItemSwitchProps {
  name: string;
  type: number;
  id: number;
  defaultValue: boolean;
  onChange: DataVerificationControlCallback;
}

const ListItemSwitch = (props: ListItemSwitchProps): JSX.Element => {
  /**
   *
   * use context api, here:
   * -- send collected data to Context / server:
   * ---- set switch value to type, on stepId
   *
   */

  const { id, name, type, defaultValue, onChange } = props;
  const [isSwitchOn, setIsSwitchOn] = useState(defaultValue);
  const [label, setLabel] = useState('No');

  // Sets question type swtich value type
  const setQuestionType = () => {
    if (type === 0) {
      setIsSwitchOn(true);
    } else if (type === 1) {
      setIsSwitchOn(false);
    }
  };

  // Toogle switch label (yes/no)
  const toggleLabel = () => {
    setLabel(isSwitchOn === false ? 'No' : 'Yes');
  };

  // callback for setting isSwitchOn value
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    onChange(id, name, isSwitchOn);
  };
  //

  /** START: Lifecycle calls */
  useEffect(() => {
    setQuestionType();
  }, [type]);

  useEffect(() => {
    toggleLabel();
  }, [isSwitchOn]);
  /** END: Lifecycle calls */

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={isSwitchOn}
        color={CustomColors.uva.orange}
        onValueChange={onToggleSwitch}
        style={[styles.switch]}
      />
    </View>
  );
};

export default ListItemSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  label: {
    fontSize: 28,
    textAlign: 'center',
    alignSelf: 'center',
  },
  switch: {
    margin: 10,
    alignSelf: 'center',
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

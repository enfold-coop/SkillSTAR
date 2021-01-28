import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { StepAttemptFieldName } from '../../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';

interface ListItemSwitchProps {
  fieldName: StepAttemptFieldName;
  chainStepId: number;
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

  const { chainStepId, fieldName, defaultValue, onChange } = props;
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(defaultValue);
  const [label, setLabel] = useState('No');

  /** START: Lifecycle calls */
  // Runs once on mount
  useEffect(() => {
    setIsSwitchOn(defaultValue);
    updateLabel(defaultValue);
  }, []);
  /** END: Lifecycle calls */

  const updateLabel = (newValue: boolean) => {
    setLabel(newValue ? 'Yes' : 'No');
  };

  // callback for setting isSwitchOn value
  const onToggleSwitch = () => {
    const newValue = !isSwitchOn;
    setIsSwitchOn(newValue);
    updateLabel(newValue);
    onChange(chainStepId, fieldName, newValue);
  };

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

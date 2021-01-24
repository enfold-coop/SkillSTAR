import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CustomColors from '../../styles/Colors';

interface ToggleButtonsProps {
  btnStyle: StyleSheet.NamedStyles<any>;
  stepTitle: string;
}

type ButtonMode = 'text' | 'outlined' | 'contained';

const ToggleButtons = (props: ToggleButtonsProps): JSX.Element => {
  const { btnStyle, stepTitle } = props;
  const [btn1Mode, setBtn1Mode] = useState<ButtonMode>('outlined');
  const [btn2Mode, setBtn2Mode] = useState<ButtonMode>('outlined');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (title === '' || title != stepTitle) {
      setTitle(stepTitle);
      reset();
    }
  });

  const reset = () => {
    setBtn1Mode('outlined');
    setBtn2Mode('outlined');
  };

  const toggleBtn = (btn: string) => {
    if (btn === 'btn1') {
      if (btn1Mode === 'outlined') {
        setBtn1Mode('contained');
        setBtn2Mode('outlined');
      }
    } else if (btn === 'btn2') {
      if (btn2Mode === 'outlined') {
        setBtn1Mode('outlined');
        setBtn2Mode('contained');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        color={CustomColors.uva.blue}
        style={btnStyle}
        mode={btn1Mode}
        onPress={() => {
          toggleBtn('btn1');
        }}
      >{`Yes`}</Button>
      <Button
        color={CustomColors.uva.blue}
        style={btnStyle}
        mode={btn2Mode}
        onPress={() => {
          toggleBtn('btn2');
        }}
      >{`No`}</Button>
    </View>
  );
};

export default ToggleButtons;

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
});

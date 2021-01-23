import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStepStatus } from '../../types/CHAIN/StepAttempt';

interface MasteryIconContainerProps {
  masteryLevel: string;
}

const MasteryIconContainer = (props: MasteryIconContainerProps): JSX.Element => {
  const { masteryLevel } = props;
  const [level, setMasteryLevel] = useState(ChainStepStatus.not_complete);

  const getMasteryLevel = () => {
    if (masteryLevel === 'mastered') {
      setMasteryLevel(ChainStepStatus.mastered);
    } else if (masteryLevel === 'focus') {
      setMasteryLevel(ChainStepStatus.focus);
    } else {
      setMasteryLevel(ChainStepStatus.not_complete);
    }
  };

  useEffect(() => {
    getMasteryLevel();
  }, [masteryLevel]);

  return (
    <View style={styles.container}>
      <MasteryIcon chainStepStatus={level} iconSize={50} />
    </View>
  );
};

export default MasteryIconContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    margin: 10,
  },
  img: {
    alignSelf: 'center',
    marginRight: 10,
    resizeMode: 'contain',
  },
});

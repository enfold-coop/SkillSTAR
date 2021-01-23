import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStepStatus, ChainStepStatusMap } from '../../types/CHAIN/StepAttempt';

type Props = {
  masteryLevel: string;
};

const MasteryIconContainer: FC<Props> = props => {
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
      <MasteryIcon chainStepStatus={level} iconSize={50}/>
    </View>
  );
};

export default MasteryIconContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    margin:10,
  },
  img: {
    alignSelf: 'center',
    marginRight: 10,
    resizeMode: 'contain',
  },
});

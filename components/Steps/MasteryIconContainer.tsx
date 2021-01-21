import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStepStatus, ChainStepStatusMap } from '../../types/CHAIN/StepAttempt';

type Props = {
  masteryLevel: string;
};

const MasteryIconContainer: FC<Props> = props => {
  const { masteryLevel } = props;
//   console.log('====================================');
//   console.log(masteryLevel);
//   console.log('====================================');
  const masteredIcon = require('../../assets/icons/ribbon-icon_1.png');
  const focusIcon = require('../../assets/icons/in-progress-icon.png');
  const notStartedIcon = require('../../assets/icons/waving-icon.png');
  const [icon, setIcon] = useState(masteredIcon);
  const [level, setMasteryLevel] = useState(masteryLevel);

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

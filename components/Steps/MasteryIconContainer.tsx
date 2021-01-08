import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  masteryLevel: string;
};

const MasteryIconContainer: FC<Props> = props => {
  const { masteryLevel } = props;
  const masteredIcon = require('../../assets/icons/ribbon-icon_1.png');
  const focusIcon = require('../../assets/icons/in-progress-icon.png');
  const notStartedIcon = require('../../assets/icons/waving-icon.png');
  const [icon, setIcon] = useState(masteredIcon);

  const getMasteryLevel = () => {
    if (masteryLevel === 'mastered') {
      setIcon(masteredIcon);
    } else if (masteryLevel === 'focus') {
      setIcon(focusIcon);
    } else {
      setIcon(notStartedIcon);
    }
  };

  useEffect(() => {
    getMasteryLevel();
  }, [masteryLevel]);

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={icon} />
    </View>
  );
};

export default MasteryIconContainer;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 10,
  },
  img: {
    alignSelf: 'center',
    marginRight: 10,
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});

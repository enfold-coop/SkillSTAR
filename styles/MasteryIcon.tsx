import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColor from '../styles/Colors';
import { MasteryStatus } from '../types/CHAIN/MasteryLevel';
import { ChainStepStatus, ChainStepStatusMap } from '../types/CHAIN/StepAttempt';
import { SkillStarIcons } from './Icons';

export interface MasteryIconProps {
  chainStepStatus: ChainStepStatus;
  iconSize: number;
}

export function MasteryIcon(props: MasteryIconProps) {
  const { chainStepStatus, iconSize } = props;
  const [size, setIconSize] = useState(30);

  useEffect(() => {
    if (iconSize != undefined) {
      setIconSize(iconSize);
    }
  });

  const statusMap = ChainStepStatusMap[chainStepStatus as string];

  const icons: { [key: string]: MasteryStatus } = {
    not_complete: {
      stepStatus: ChainStepStatus.not_complete,
      label: 'Not Started',
      icon: 'not_started',
      color: CustomColor.uva.gray,
    },
    focus: {
      stepStatus: ChainStepStatus.focus,
      label: 'Focus Step',
      icon: 'focus_step',
      color: CustomColor.uva.mountain,
    },
    mastered: {
      stepStatus: ChainStepStatus.mastered,
      label: 'Mastered',
      icon: 'mastered',
      color: CustomColor.uva.mountain,
    },
  };

  const key = statusMap ? statusMap.key : undefined;
  const iconMap = key ? icons[key] : undefined;

  return iconMap ? (
    <View style={styles.icon}>
      <SkillStarIcons name={iconMap.icon} size={size} style={styles.icon} color={iconMap.color} />
    </View>
  ) : (
    <Text>Icon Error</Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 5,
  },
});

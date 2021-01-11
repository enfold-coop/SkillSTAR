import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomColor from '../styles/Colors';
import { MasteryStatus } from '../types/CHAIN/MasteryLevel';
import { ChainStepStatus, ChainStepStatusMap } from '../types/CHAIN/StepAttempt';
import { SkillStarIcons } from './Icons';

export interface MasteryIconProps {
  chainStepStatus: ChainStepStatus;
}

export function MasteryIcon(props: MasteryIconProps) {
  const { chainStepStatus } = props;
  const statusMap = Object.entries(ChainStepStatusMap).find(
    ([key, m]) => m.value === chainStepStatus,
  );
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
      icon: 'not_mastered',
      color: CustomColor.uva.mountain,
    },
    mastered: {
      stepStatus: ChainStepStatus.mastered,
      label: 'Mastered',
      icon: 'mastered',
      color: CustomColor.uva.mountain,
    },
  };

  const key = statusMap && statusMap.length === 2 ? statusMap[1].key : undefined;

  return key ? (
    <View style={styles.icon}>
      <SkillStarIcons
        name={icons[key].icon}
        size={30}
        style={styles.icon}
        color={icons[key].color}
      />
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

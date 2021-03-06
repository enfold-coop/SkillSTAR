import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Loading } from '../components/Loading/Loading';
import CustomColor from '../styles/Colors';
import { MasteryStatus } from '../types/chain/MasteryLevel';
import { ChainStepStatus, ChainStepStatusMap } from '../types/chain/StepAttempt';
import { AntDesignT } from '../types/icons/AntDesign';
import { FeatherT } from '../types/icons/Feather';
import { MaterialCommunityIconsT } from '../types/icons/MaterialCommunityIcons';
import { MaterialIconsT } from '../types/icons/MaterialIcons';
import { SkillStarIcons } from './Icons';

export interface MasteryIconProps {
  chainStepStatus?: ChainStepStatus;
  iconSize: number;
}

export function MasteryIcon(props: MasteryIconProps): JSX.Element {
  const { chainStepStatus, iconSize } = props;
  const [size, setIconSize] = useState(30);

  useEffect(() => {
    if (iconSize != undefined) {
      setIconSize(iconSize);
    }
  });

  const statusMap = ChainStepStatusMap[chainStepStatus as string];

  const icons: { [K in ChainStepStatus]: MasteryStatus } = {
    not_yet_started: {
      stepStatus: ChainStepStatus.not_yet_started,
      label: 'Not Started',
      icon: 'update',
      iconLibrary: 'MaterialIcons',
      color: CustomColor.uva.gray,
    },
    not_complete: {
      stepStatus: ChainStepStatus.not_complete,
      label: 'Not Started',
      icon: 'update',
      iconLibrary: 'MaterialIcons',
      color: CustomColor.uva.gray,
    },
    focus: {
      stepStatus: ChainStepStatus.focus,
      label: 'Focus Step',
      icon: 'target',
      iconLibrary: 'Feather',
      color: CustomColor.uva.mountain,
    },
    booster_needed: {
      stepStatus: ChainStepStatus.booster_needed,
      label: 'Booster Needed',
      icon: 'flash-circle',
      iconLibrary: 'MaterialCommunityIcons',
      color: CustomColor.uva.mountain,
    },
    mastered: {
      stepStatus: ChainStepStatus.mastered,
      label: 'Mastered',
      icon: 'mastered',
      iconLibrary: 'SkillStarIcons',
      color: CustomColor.uva.mountain,
    },
    booster_mastered: {
      stepStatus: ChainStepStatus.booster_mastered,
      label: 'Booster Mastered',
      icon: 'mastered',
      iconLibrary: 'SkillStarIcons',
      color: CustomColor.uva.mountain,
    },
  };

  const key = statusMap ? (statusMap.key as ChainStepStatus) : undefined;
  const iconMap = key ? icons[key] : undefined;

  const renderIcon = (iconInfoMap: MasteryStatus): JSX.Element => {
    switch (iconInfoMap.iconLibrary) {
      case 'SkillStarIcons':
        return (
          <SkillStarIcons name={iconInfoMap.icon as string} size={size} style={styles.icon} color={iconInfoMap.color} />
        );
      case 'MaterialIcons':
        return (
          <MaterialIcons
            name={iconInfoMap.icon as MaterialIconsT}
            size={size}
            color={iconInfoMap.color}
            style={styles.icon}
          />
        );
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            name={iconInfoMap.icon as MaterialCommunityIconsT}
            size={size}
            color={iconInfoMap.color}
            style={styles.icon}
          />
        );
      case 'Feather':
        return (
          <Feather name={iconInfoMap.icon as FeatherT} size={size} color={iconInfoMap.color} style={styles.icon} />
        );
      case 'AntDesign':
        return (
          <AntDesign name={iconInfoMap.icon as AntDesignT} size={size} color={iconInfoMap.color} style={styles.icon} />
        );
      default:
        return <Loading />;
    }
  };

  return iconMap ? <View style={styles.icon}>{renderIcon(iconMap)}</View> : <Text>{`Icon Error: ${key}`}</Text>;
}

const styles = StyleSheet.create({
  icon: {
    padding: 5,
  },
});

import { MaterialIcons } from '@expo/vector-icons';
import date from 'date-and-time';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card, List } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStep } from '../../types/chain/ChainStep';
import { MasteryInfo } from '../../types/chain/MasteryInfoMap';
import { StepAttempt } from '../../types/chain/StepAttempt';
import { Loading } from '../Loading/Loading';

interface ScorecardListItemProps {
  chainStep: ChainStep;
  stepAttempt?: StepAttempt;
  masteryInfo: MasteryInfo;
}

interface ListItemIconProps {
  color: string;
  style: {
    marginLeft: number;
    marginRight: number;
    marginVertical?: number;
  };
}

interface DateListItemProps {
  label: string;
  date: Date | undefined;
}

const ScorecardListItem = (props: ScorecardListItemProps): JSX.Element => {
  const { chainStep, stepAttempt, masteryInfo } = props;
  const [isPressed, setIsPressed] = useState(false);
  const dates = [
    {
      label: 'Date Introduced',
      date: masteryInfo.dateIntroduced,
    },
    {
      label: 'Date Mastered',
      date: masteryInfo.dateMastered,
    },
    {
      label: 'Date Booster Training Initiated',
      date: masteryInfo.dateBoosterInitiated,
    },
    {
      label: 'Date Mastered Booster Training',
      date: masteryInfo.dateBoosterMastered,
    },
  ];

  const handleDateVals = (d?: Date | string): string => {
    if (d && d instanceof Date) {
      return date.format(d, 'MM/DD/YYYY');
    } else if (typeof d === 'string') {
      console.error('date is a string');
    }

    return 'N/A';
  };

  const DateListItem = (props: DateListItemProps): JSX.Element => {
    return (
      <List.Item
        title={props.label}
        description={props.date ? handleDateVals(props.date) : 'N/A'}
        left={(props: ListItemIconProps) => <List.Icon {...props} icon={'calendar'} />}
      />
    );
  };

  return stepAttempt && chainStep ? (
    <Animatable.View animation={'fadeIn'} duration={500 * chainStep.id}>
      <Card style={styles.container}>
        <TouchableOpacity
          style={[styles.touchable]}
          onPress={() => {
            setIsPressed(!isPressed);
          }}
        >
          <View style={styles.leftColumn}>
            <Text style={styles.id}>{`${chainStep.id + 1}.`}</Text>
            <Text style={styles.skill}>{chainStep.instruction}</Text>
          </View>
          <View style={styles.rightColumn}>
            <MasteryIcon chainStepStatus={stepAttempt.status} iconSize={40} />
            <MaterialIcons
              name={isPressed ? 'expand-less' : 'expand-more'}
              size={24}
              color={'black'}
              style={styles.nextIcon}
            />
          </View>
        </TouchableOpacity>
        {isPressed && (
          <View style={styles.dropDownContainer}>
            {dates.map((d, i) => (
              <DateListItem key={'date_list_item_' + i} label={d.label} date={d.date} />
            ))}
          </View>
        )}
      </Card>
    </Animatable.View>
  ) : (
    <Animatable.View animation={'fadeIn'} duration={1000}>
      <Card style={styles.container}>
        <Loading />
      </Card>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 3,
    flexDirection: 'row',
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  leftColumn: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  dropDownContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingRight: 20,
    padding: 20,
    backgroundColor: CustomColors.uva.white,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: CustomColors.uva.graySoft,
  },
  dropDownLabel: {
    padding: 4,
    paddingLeft: 20,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  dropDownItemDate: {
    color: CustomColors.uva.grayDark,
  },
  id: {
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skill: {
    width: 240,
    flexWrap: 'wrap',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    paddingLeft: 20,
  },
  nextIcon: {
    width: 24,
    height: 24,
  },
  title: {
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScorecardListItem;

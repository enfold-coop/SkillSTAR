import { MaterialIcons } from '@expo/vector-icons';
import date from 'date-and-time';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { ChainStep } from '../../types/CHAIN/ChainStep';
import { MasteryInfo } from '../../types/CHAIN/MasteryLevel';
import { StepAttempt } from '../../types/CHAIN/StepAttempt';

interface ScorecardListItemProps {
  chainStep: ChainStep;
  stepAttempt?: StepAttempt;
  masteryInfo: MasteryInfo;
}

const ScorecardListItem = (props: ScorecardListItemProps): JSX.Element => {
  const { chainStep, stepAttempt, masteryInfo } = props;

  const [isPressed, setIsPressed] = useState(false);
  const [stepData, setStepData] = useState<StepAttempt>();

  const handleDateVals = (d?: Date): string => {
    if (d && d instanceof Date) {
      return date.format(d, 'MM/DD/YYYY');
    } else {
      return 'N/A';
    }
  };

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) {
      setStepData(stepAttempt);
    }

    return () => {
      isCancelled = true;
    };
  }, [stepAttempt]);

  return stepAttempt && chainStep ? (
    <Animatable.View animation={'fadeIn'} duration={500 * chainStep.id}>
      <Card style={styles.container}>
        <TouchableOpacity
          style={[styles.touchable]}
          onPress={() => {
            setIsPressed(!isPressed);
          }}
        >
          <Text style={styles.id}>{chainStep.id + 1}. </Text>
          <Text style={styles.skill}>{chainStep.instruction}</Text>
          <MasteryIcon chainStepStatus={stepAttempt.status} iconSize={40} />
          <MaterialIcons
            name={isPressed ? 'expand-less' : 'expand-more'}
            size={24}
            color={'black'}
            style={styles.nextIcon}
          />
        </TouchableOpacity>
        {isPressed && (
          <View style={styles.dropDownContainer}>
            <Text style={styles.dropDownLabel}>
              {`${'\u2022'} Date Introduced: `}
              <Text style={styles.dropDownItemDate}>{handleDateVals(masteryInfo.dateIntroduced)}</Text>
            </Text>
            <Text style={styles.dropDownLabel}>
              {`${'\u2022'} Date Mastered: `}
              <Text style={styles.dropDownItemDate}>{handleDateVals(masteryInfo.dateMastered)}</Text>
            </Text>
            <Text style={styles.dropDownLabel}>
              {`${'\u2022'} Date Booster training initiated: `}
              <Text style={styles.dropDownItemDate}>{handleDateVals(masteryInfo.dateBoosterInitiated)}</Text>
            </Text>
            <Text style={styles.dropDownLabel}>
              {`${'\u2022'} Date Mastered Booster training: `}
              <Text style={styles.dropDownItemDate}>{handleDateVals(masteryInfo.dateBoosterMastered)}</Text>
            </Text>
          </View>
        )}
      </Card>
    </Animatable.View>
  ) : (
    <Animatable.View animation={'fadeIn'} duration={1000}>
      <Card style={styles.container}>
        <View style={styles.dropDownContainer}>
          <Text style={styles.dropDownLabel}>...</Text>
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
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
    width: 300,
    flexWrap: 'wrap',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    paddingLeft: 20,
  },
  nextIcon: {
    marginLeft: 'auto',
    padding: 10,
    paddingRight: 20,
  },
  title: {
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScorecardListItem;

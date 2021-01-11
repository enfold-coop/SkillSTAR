import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { MasteryIcon } from '../../styles/MasteryIcon';
import { StepAttempt } from '../../types/CHAIN/StepAttempt';

type Props = {
  stepAttempts: StepAttempt[];
  name: string;
};

function createSkillTitleString(stepAttempts: StepAttempt[]): string {
  return stepAttempts
    .map(s => (s.chain_step !== undefined ? s.chain_step.instruction : '...'))
    .join(', ');
}

const SkillGrade: FC<Props> = props => {
  const { stepAttempts } = props;

  const masteryIcons = stepAttempts.map(stepAttempt => {
    return <MasteryIcon chainStepStatus={stepAttempt.status} />;
  });

  return (
    <Card style={styles.container}>
      {masteryIcons}

      <View style={styles.subcontainer}>
        <Text style={styles.skillGrade}>{props.name}: </Text>
        <View style={styles.skillList}>
          <Text style={styles.stepNames}>{createSkillTitleString(stepAttempts)}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  icon: {
    width: 50,
    height: 50,
    margin: 5,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  subcontainer: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  skillList: {
    display: 'flex',
    flexDirection: 'row',
  },
  skillTitle: {
    padding: 2,
  },
  skillGrade: {
    fontWeight: '800',
  },
  stepNames: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SkillGrade;

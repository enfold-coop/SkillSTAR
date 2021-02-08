import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StepAttempt } from '../../types/chain/StepAttempt';
import ChallengingBehavBtn from './ChallengingBehavBtn';
import StepAttemptStars from './StepAttemptStars';

interface StarsNIconsContainerProps {
  chainStepId: number;
  prevFocusStepAttempts: boolean[] | undefined;
}

const StarsNIconsContainer = (props: StarsNIconsContainerProps): JSX.Element => {
  const { chainStepId, prevFocusStepAttempts } = props;

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <StepAttemptStars promptType={'FP'} attemptsWPromptType={prevFocusStepAttempts} />
        <ChallengingBehavBtn chainStepId={chainStepId} />
      </View>
    </View>
  );
};

export default StarsNIconsContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    margin: 10,
    marginBottom: 0,
    padding: 10,
    paddingBottom: 0,
  },
  subContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

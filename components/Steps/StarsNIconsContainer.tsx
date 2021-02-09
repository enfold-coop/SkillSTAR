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
      <StepAttemptStars promptType={'FP'} attemptsWPromptType={prevFocusStepAttempts} />
      <ChallengingBehavBtn chainStepId={chainStepId} />
    </View>
  );
};

export default StarsNIconsContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  subContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

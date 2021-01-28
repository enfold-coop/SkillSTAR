import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Badge } from 'react-native-paper';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ImageAssets } from '../../data/images';
import { StepAttempt } from '../../types/chain/StepAttempt';
import { Loading } from '../Loading/Loading';

interface ChallengingBehavBtnProps {
  chainStepId: number;
}

const ChallengingBehavBtn = (props: ChallengingBehavBtnProps): JSX.Element => {
  const chainMasteryState = useChainMasteryState();
  const [stepAttempt, setStepAttempt] = useState<StepAttempt>();
  const [numChallengingBehavior, setNumChallengingBehavior] = useState<number>(0);
  const { chainStepId } = props;

  // Runs when chainStepId changes
  useEffect(() => {
    if (chainMasteryState.chainMastery && chainStepId !== undefined) {
      const stateStepAttempt = chainMasteryState.chainMastery.getDraftSessionStep(chainStepId);
      setStepAttempt(stateStepAttempt);

      const stepAttemptCBs = stateStepAttempt.challenging_behaviors || [];
      setNumChallengingBehavior(stepAttemptCBs.length);
    }
  }, [chainStepId, chainMasteryState.chainMastery]);

  // Set had_challenging_behavior to true, and add the current time to challenging_behaviors for the current step attempt.
  const onChallengingBehavior = () => {
    if (chainMasteryState.chainMastery && stepAttempt) {
      const oldCBs = stepAttempt.challenging_behaviors || [];
      const newCBs = oldCBs.concat([{ time: new Date() }]);
      setNumChallengingBehavior(newCBs.length);
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'had_challenging_behavior', true);
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'challenging_behaviors', newCBs);
      setStepAttempt(chainMasteryState.chainMastery.getDraftSessionStep(chainStepId));
    }
  };

  return stepAttempt ? (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onChallengingBehavior}>
          {/* <SvgUri width={'100%" height="100%'} uri={flagIcon} /> */}
          <Badge visible={numChallengingBehavior > 0} style={{ marginBottom: -18, marginRight: 0 }}>
            {numChallengingBehavior}
          </Badge>
          <Image source={ImageAssets.flag_icon} style={{ ...styles.img, marginLeft: 0, marginRight: 10 }} />
        </TouchableOpacity>
      </View>
      <Text style={styles.difficultyParagraph}>
        {`Click on this icon anytime your child is having difficulty or experiencing challenging behavior.`}
      </Text>
    </View>
  ) : (
    <Loading />
  );
};

export default ChallengingBehavBtn;

const styles = StyleSheet.create({
  container: {
    width: '44%',
    paddingRight: 20,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  iconContainer: {
    padding: 10,
    // backgroundColor: CustomColors.uva.grayMedium,
    borderRadius: 5,
  },
  difficultyParagraph: {
    width: '60%',
    padding: 0,
    paddingLeft: 10,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  img: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    // color: CustomColors.uva.magenta75Soft,
    resizeMode: 'contain',
  },
});

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ImageAssets } from '../../data/images';
import CustomColors from '../../styles/Colors';
import { StepAttempt, StepIncompleteReason } from '../../types/chain/StepAttempt';
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
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (chainMasteryState.chainMastery && chainStepId !== undefined) {
          const stateStepAttempt = chainMasteryState.chainMastery.getDraftSessionStep(chainStepId);
          setStepAttempt(stateStepAttempt);

          const stepAttemptCBs = stateStepAttempt.challenging_behaviors || [];
          setNumChallengingBehavior(stepAttemptCBs.length);
        }
      }
    };

    _load();
    return () => {
      isCancelled = true;
    };
  }, [chainStepId, chainMasteryState.chainMastery]);

  // Set had_challenging_behavior to true, and add the current time to challenging_behaviors for the current step attempt.
  const onChallengingBehavior = () => {
    if (chainMasteryState.chainMastery && stepAttempt) {
      const oldCBs = stepAttempt.challenging_behaviors || [];
      const newCBs = oldCBs.concat([{ time: new Date() }]);
      setNumChallengingBehavior(newCBs.length);
      chainMasteryState.chainMastery.updateDraftSessionStep(
        chainStepId,
        'reason_step_incomplete',
        StepIncompleteReason.challenging_behavior,
      );
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'had_challenging_behavior', true);
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'challenging_behaviors', newCBs);
      setStepAttempt(chainMasteryState.chainMastery.getDraftSessionStep(chainStepId));
    }
  };

  return stepAttempt ? (
    <View style={styles.container}>
      {/* <View style={styles.iconContainer}> */}
      <TouchableOpacity onPress={onChallengingBehavior}>
        {/* <SvgUri width={'100%" height="100%'} uri={flagIcon} /> */}
        <Badge
          adjustsFontSizeToFit={true}
          allowFontScaling={true}
          visible={numChallengingBehavior > 0}
          style={{ marginBottom: -18, marginRight: 0, fontSize: 14, padding: 0 }}
        >
          {numChallengingBehavior}
        </Badge>
        <Image source={ImageAssets.flag_icon} style={{ ...styles.img, marginLeft: 0, marginRight: 10 }} />
      </TouchableOpacity>
      {/* </View> */}
    </View>
  ) : (
    <Loading />
  );
};

export default ChallengingBehavBtn;

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: 80,
    // padding: 10,
    borderColor: CustomColors.uva.grayMedium,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginRight: 10,
  },
  img: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

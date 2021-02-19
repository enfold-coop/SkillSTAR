import { ChainData } from '../types/chain/ChainData';
import { CalcChalBehaviorPercentage, CalcMasteryPercentage } from './CalculateMasteryPercentage';
import { FilteredSessionWithSessionIndex } from './FilterSessionType';
import { ChainMastery } from '../services/ChainMastery';
import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
import { ChainSession } from '../types/chain/ChainSession';
import { SessionAndIndex } from '../types/chain/FilteredSessions';

describe('CalculateMasteryPercentage', () => {
  let chainData: ChainData;
  let chainMastery: ChainMastery;
  let sessions: ChainSession[];
  let probes: SessionAndIndex[];
  let training: SessionAndIndex[];

  beforeEach(() => {
    chainData = new ChainData(mockChainQuestionnaire);
    chainMastery = new ChainMastery(mockChainSteps, chainData);
    sessions = chainData.sessions;
    const { probeArr, trainingArr } = FilteredSessionWithSessionIndex(sessions);
    probes = probeArr;
    training = trainingArr;
  });

  it('Should calculate percentage of mastery from probe data and return array of SessionAndIndex', () => {
    const calculatedProbePercentages = CalcMasteryPercentage(probes);
    expect(calculatedProbePercentages.every((s) => s.session_number != undefined)).toEqual(true);
    expect(calculatedProbePercentages.every((s) => s.mastery != undefined)).toEqual(true);
  });
  it('Should calculate percentage of mastery from training data and return array of SessionAndIndex', () => {
    const calculatedTrainingPercentages = CalcMasteryPercentage(training);
    expect(calculatedTrainingPercentages.every((s) => s.session_number != undefined)).toEqual(true);
    expect(calculatedTrainingPercentages.every((s) => s.mastery != undefined)).toEqual(true);
  });

  it('Should calculate percentage of Challenging Behavior from session data', () => {
    const calculatedCBPercentages = CalcChalBehaviorPercentage(sessions);
    expect(calculatedCBPercentages.every((s) => s.session_number != undefined)).toEqual(true);
    expect(calculatedCBPercentages.every((s) => s.challenging_behavior != undefined)).toEqual(true);
  });
});

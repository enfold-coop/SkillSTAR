import { ChainData } from '../types/chain/ChainData';
import { ChainSession } from '../types/chain/ChainSession';
import { SessionAndIndex } from '../types/chain/FilteredSessions';
import { mockChainQuestionnaire } from './testing/mockChainQuestionnaire';
import { calculatePercentChallengingBehavior, calculatePercentMastery } from './CalculateMasteryPercentage';
import { FilteredSessionWithSessionIndex } from './FilterSessionType';

describe('CalculateMasteryPercentage', () => {
  let chainData: ChainData;
  let sessions: ChainSession[];
  let probes: SessionAndIndex[];
  let training: SessionAndIndex[];

  beforeEach(() => {
    chainData = new ChainData(mockChainQuestionnaire);
    sessions = chainData.sessions;
    const { probeArr, trainingArr } = FilteredSessionWithSessionIndex(sessions);
    probes = probeArr;
    training = trainingArr;
  });

  it('Should calculate percentage of mastery from probe data and return array of SessionAndIndex', () => {
    const calculatedProbePercentages = calculatePercentMastery(probes);
    expect(calculatedProbePercentages).toHaveLength(probes.length);
    expect(calculatedProbePercentages.every((s) => s.session_number !== undefined)).toEqual(true);
    expect(calculatedProbePercentages.every((s) => s.mastery !== undefined)).toEqual(true);
    expect(calculatedProbePercentages.every((s) => s.mastery === 0)).toEqual(true);
    console.log('calculatedProbePercentages', calculatedProbePercentages);
  });

  it('Should calculate percentage of mastery from training data and return array of SessionAndIndex', () => {
    const calculatedTrainingPercentages = calculatePercentMastery(training);
    expect(calculatedTrainingPercentages).toHaveLength(training.length);
    expect(calculatedTrainingPercentages.every((s) => s.session_number !== undefined)).toEqual(true);
    expect(calculatedTrainingPercentages.every((s) => s.mastery !== undefined)).toEqual(true);
    expect(calculatedTrainingPercentages.every((s) => s.mastery === 0)).toEqual(true);
    console.log('calculatedTrainingPercentages', calculatedTrainingPercentages);
  });

  it('Should calculate percentage of Challenging Behavior from session data', () => {
    const calculatedCBPercentages = calculatePercentChallengingBehavior(sessions);
    expect(calculatedCBPercentages).toHaveLength(sessions.length);
    expect(calculatedCBPercentages.every((s) => s.session_number !== undefined)).toEqual(true);
    expect(calculatedCBPercentages.every((s) => s.challenging_behavior !== undefined)).toEqual(true);
    expect(calculatedCBPercentages.every((s) => s.challenging_behavior === 100)).toEqual(true);
    console.log('calculatedCBPercentages', calculatedCBPercentages);
  });
});

import { ChainData } from '../types/chain/ChainData';
import { ChainSession } from '../types/chain/ChainSession';
import { SessionGroup } from '../types/chain/FilteredSessions';
import { calculatePercentChallengingBehavior, calculatePercentMastery } from './CalculateMasteryPercentage';
import { FilteredSessionWithSessionIndex } from './FilterSessionType';
import { mockChainQuestionnaire } from './testing/mockChainQuestionnaire';

describe('CalculateMasteryPercentage', () => {
  let chainData: ChainData;
  let sessions: ChainSession[];
  let probes: SessionGroup[];
  let training: SessionGroup[];
  let challenging: SessionGroup[];

  beforeEach(() => {
    chainData = new ChainData(mockChainQuestionnaire);
    sessions = chainData.sessions;
    const { probeSessionGroups, trainingSessionGroups, challengingSessionGroups } = FilteredSessionWithSessionIndex(
      sessions,
    );
    probes = probeSessionGroups;
    training = trainingSessionGroups;
    challenging = challengingSessionGroups;
  });

  it('Should calculate percentage of mastery from probe data and return array of SessionAndIndex', () => {
    const calculatedProbePercentages = calculatePercentMastery(probes);
    expect(calculatedProbePercentages).toHaveLength(probes.length);
    expect(calculatedProbePercentages.every((p) => p.every((s) => s.session_number !== undefined))).toEqual(true);
    expect(calculatedProbePercentages.every((p) => p.every((s) => s.mastery !== undefined))).toEqual(true);
    expect(calculatedProbePercentages.every((p) => p.every((s) => s.mastery === 0))).toEqual(true);
  });

  it('Should calculate percentage of mastery from training data and return array of SessionAndIndex', () => {
    const calculatedTrainingPercentages = calculatePercentMastery(training);
    expect(calculatedTrainingPercentages).toHaveLength(training.length);
    expect(calculatedTrainingPercentages.every((p) => p.every((s) => s.session_number !== undefined))).toEqual(true);
    expect(calculatedTrainingPercentages.every((p) => p.every((s) => s.mastery !== undefined))).toEqual(true);
    expect(calculatedTrainingPercentages.every((p) => p.every((s) => s.mastery === 0))).toEqual(true);
  });

  it('Should calculate percentage of Challenging Behavior from session data', () => {
    const calculatedCBPercentages = calculatePercentChallengingBehavior(challenging);
    expect(calculatedCBPercentages).toHaveLength(challenging.length);
    expect(calculatedCBPercentages.every((p) => p.every((s) => s.session_number !== undefined))).toEqual(true);
    expect(calculatedCBPercentages.every((p) => p.every((s) => s.challenging_behavior !== undefined))).toEqual(true);
    expect(calculatedCBPercentages.every((p) => p.every((s) => s.challenging_behavior === 100))).toEqual(true);
  });
});

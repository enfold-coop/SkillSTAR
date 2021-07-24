import { ChainData } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { SessionGroup } from '../types/chain/FilteredSessions';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';
import {
  calculatePercentChallengingBehavior,
  calculatePercentMastery,
  percentChallengingBehavior,
  percentMastered,
} from './CalculateMasteryPercentage';
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
    const { probeSessionGroups, trainingSessionGroups, challengingSessionGroups } =
      FilteredSessionWithSessionIndex(sessions);
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

  it('should calculate percent mastered from a list of step attempts', () => {
    const stepAttempts: StepAttempt[] = [...Array(100).keys()].map(() => {
      return {
        chain_step_id: 0,
        session_type: ChainSessionType.training,
        completed: true,
        was_prompted: false,
        was_focus_step: true,
        had_challenging_behavior: false,
        status: ChainStepStatus.focus,
      };
    });

    stepAttempts.forEach((s) => {
      s.prompt_level = ChainStepPromptLevel.none;
      s.target_prompt_level = ChainStepPromptLevel.none;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(100);

    stepAttempts.forEach((s) => {
      s.prompt_level = ChainStepPromptLevel.shadow;
      s.target_prompt_level = ChainStepPromptLevel.shadow;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(67);

    stepAttempts.forEach((s) => {
      s.prompt_level = ChainStepPromptLevel.partial_physical;
      s.target_prompt_level = ChainStepPromptLevel.partial_physical;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(33);

    stepAttempts.forEach((s) => {
      s.prompt_level = ChainStepPromptLevel.full_physical;
      s.target_prompt_level = ChainStepPromptLevel.full_physical;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(0);

    stepAttempts.forEach((s) => {
      s.session_type = ChainSessionType.probe;
      s.prompt_level = undefined;
      s.target_prompt_level = ChainStepPromptLevel.full_physical;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(100);

    stepAttempts.forEach((s) => {
      s.session_type = ChainSessionType.probe;
      s.prompt_level = undefined;
      s.target_prompt_level = ChainStepPromptLevel.full_physical;
      s.completed = false;
      s.was_prompted = true;
    });
    expect(Math.round(percentMastered(stepAttempts))).toEqual(0);
  });

  it('should calculate percent challenging from a list of step attempts', () => {
    const stepAttempts: StepAttempt[] = [...Array(100).keys()].map(() => {
      return {
        chain_step_id: 0,
        session_type: ChainSessionType.training,
        completed: true,
        was_prompted: false,
        was_focus_step: true,
        status: ChainStepStatus.focus,
      };
    });

    stepAttempts.forEach((s) => {
      s.had_challenging_behavior = false;
    });
    expect(Math.round(percentChallengingBehavior(stepAttempts))).toEqual(0);

    stepAttempts.forEach((s, i) => {
      s.had_challenging_behavior = i < 25;
    });
    expect(Math.round(percentChallengingBehavior(stepAttempts))).toEqual(25);

    stepAttempts.forEach((s, i) => {
      s.had_challenging_behavior = i < 50;
    });
    expect(Math.round(percentChallengingBehavior(stepAttempts))).toEqual(50);

    stepAttempts.forEach((s, i) => {
      s.had_challenging_behavior = i < 75;
    });
    expect(Math.round(percentChallengingBehavior(stepAttempts))).toEqual(75);

    stepAttempts.forEach((s) => {
      s.had_challenging_behavior = true;
    });
    expect(Math.round(percentChallengingBehavior(stepAttempts))).toEqual(100);
  });
});

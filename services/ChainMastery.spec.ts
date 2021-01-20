import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import { ChainStepPromptLevel } from '../types/CHAIN/StepAttempt';
import { ChainMastery } from './ChainMastery';

describe('ChainMastery', () => {
  it('should get current focus step');

  it('should get previous session data', () => {
    // Should return last session if there are sessions.
    const chainData = new ChainData(mockChainQuestionnaire);
    const sessionResult = ChainMastery._getPreviousSessionData(chainData);
    expect(sessionResult).toEqual(chainData.sessions[chainData.sessions.length - 1]);

    // Should throw an error if there are no sessions.
    const emptyChainData = new ChainData({ participant_id: 0, sessions: [] });
    expect(() => ChainMastery._getPreviousSessionData(emptyChainData)).toThrow();
  });

  it('should get next prompt level', () => {
    // Next level should be partial if current level is full
    const partial = ChainMastery.promptHierarchy.find(p => p.key === ChainStepPromptLevel.partial_physical);
    const partialResult = ChainMastery.getNextPromptLevel(ChainStepPromptLevel.full_physical);
    expect(partialResult).toEqual(partial);

    // Next level should be none if current level is none
    const independent = ChainMastery.promptHierarchy.find(p => p.key === ChainStepPromptLevel.none);
    const independentResult = ChainMastery.getNextPromptLevel(ChainStepPromptLevel.none);
    expect(independent).toEqual(independentResult);
  });

  it('should get prev session focus step data', () => {
    const result = ChainMastery._getPrevSessionFocusStepData(mockChainQuestionnaire.sessions[1]);
    expect(result).toEqual(mockChainQuestionnaire.sessions[0].step_attempts);
  });

  it('should set session array', () => {
    const chainData =
    const result = ChainMastery.setSessionArray(mockChainQuestionnaire);
    expect(result).toBeTruthy();
  });

  it('should determine current session number', () => {
    const result = ChainMastery.determineCurrentSessionNumber();
    expect(result).toBeTruthy();
  });

  it('should determine step attempt prompt level', () => {
    const result = ChainMastery.determineStepAttemptPromptLevel();
    expect(result).toBeTruthy();
  });

  it('should determine prev focus step id', () => {
    const result = ChainMastery.determinePrevFocusStepId();
    expect(result).toBeTruthy();
  });

  it('should determine current focus step id', () => {
    const result = ChainMastery.determineCurrentFocusStepId();
    expect(result).toBeTruthy();
  });

  it('should set prev session type', () => {
    const result = ChainMastery._setPrevSessionType();
    expect(result).toBeTruthy();
  });

  it('should is session probe or training', () => {
    const result = ChainMastery.isSessionProbeOrTraining();
    expect(result).toBeTruthy();
  });

  it('should determine prev session type', () => {
    const result = ChainMastery._determinePrevSessionType();
    expect(result).toBeTruthy();
  });

  it('should set current session number', () => {
    const result = ChainMastery._setCurrentSessionNumber();
    expect(result).toBeTruthy();
  });

  it('should find prev step attempt wid', () => {
    const result = ChainMastery._findPrevStepAttemptWId();
    expect(result).toBeTruthy();
  });

  it('should needed prompt or had cb', () => {
    const result = ChainMastery._neededPromptOrHadCB();
    expect(result).toBeTruthy();
  });

  it('should determine if booster session', () => {
    const result = ChainMastery.determineIfBoosterSession();
    expect(result).toBeTruthy();
  });

  it('should get next prompt level', () => {
    const result = ChainMastery.getNextPromptLevel();
    expect(result).toBeTruthy();
  });

  it('should set curr prompt level', () => {
    const result = ChainMastery.setCurrPromptLevel();
    expect(result).toBeTruthy();
  });

  it('should is prev focus mastered', () => {
    const result = ChainMastery._isPrevFocusMastered();
    expect(result).toBeTruthy();
  });
});

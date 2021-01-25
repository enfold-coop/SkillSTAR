import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
import { ChainData } from '../types/chain/ChainData';
import { ChainStepStatus } from '../types/chain/StepAttempt';
import { ChainMastery } from './ChainMastery';

describe('ChainMastery', () => {
  let chainData: ChainData;
  let chainMastery: ChainMastery;

  beforeEach(() => {
    chainData = new ChainData(mockChainQuestionnaire);
    chainMastery = new ChainMastery(mockChainSteps, chainData);
  });

  it('should populate the mastery info object and draft session', () => {
    expect(chainMastery.masteryInfoMap).toBeTruthy();
    expect(chainMastery.chainSteps).toBeTruthy();
    expect(chainMastery.chainData).toBeTruthy();
    expect(chainMastery.masteredChainStepIds).toBeTruthy();
    expect(chainMastery.masteredChainStepIds).toBeInstanceOf(Array);
    expect(chainMastery.focusedChainStepIds).toBeTruthy();
    expect(chainMastery.focusedChainStepIds).toBeInstanceOf(Array);
    expect(chainMastery.unmasteredFocusedChainStepIds).toBeTruthy();
    expect(chainMastery.unmasteredFocusedChainStepIds).toBeInstanceOf(Array);
    expect(chainMastery.draftSession).toBeTruthy();
  });

  it('should set default step attempt status to Not Started', () => {
    const draftSession = chainMastery.draftSession;
    const stepAttempts = draftSession && draftSession.step_attempts;
    expect(draftSession).toBeTruthy();
    expect(stepAttempts).toBeTruthy();
    expect(stepAttempts && stepAttempts.length).toEqual(mockChainSteps.length);
    expect(stepAttempts && stepAttempts.every(s => s.status === ChainStepStatus.not_yet_started)).toBeTruthy();
  });

  it('should get step status', () => {
    // All steps are completed = false in mockChainQuestionnaire
    const chainStepId = mockChainSteps[0].id;
    const stepAttempts = chainData.getAllStepAttemptsForChainStep(mockChainSteps[0].id);
    const masteryInfo = chainMastery.masteryInfoMap[chainStepId];
    expect(chainMastery.getStepStatus(stepAttempts, masteryInfo)).toEqual(ChainStepStatus.focus);
  });
});

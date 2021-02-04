import { deepClone } from '../_util/deepClone';
import { checkMasteryInfo } from '../_util/testing/chainTestUtils';
import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
import { ChainData } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import { ChainStepPromptLevel, ChainStepPromptLevelMap, ChainStepStatus } from '../types/chain/StepAttempt';
import { ChainMastery } from './ChainMastery';

describe('ChainMastery', () => {
  let chainData: ChainData;
  let chainMastery: ChainMastery;

  beforeEach(() => {
    chainData = new ChainData(mockChainQuestionnaire);
    chainMastery = new ChainMastery(mockChainSteps, chainData);
  });

  it('should populate the mastery info object and draft session for returning users', () => {
    checkMasteryInfo(chainMastery);
    expect(chainMastery.chainData.sessions.every((s) => s.completed === true)).toEqual(true);
  });

  it('should populate the mastery info object and draft session for new users', () => {
    chainData = new ChainData({
      user_id: 0,
      participant_id: 0,
      sessions: [],
    });
    chainMastery = new ChainMastery(mockChainSteps, chainData);
    checkMasteryInfo(chainMastery);
  });

  it('should set default step attempt status to Not Started', () => {
    const draftSession = chainMastery.draftSession;
    const stepAttempts = draftSession && draftSession.step_attempts;
    expect(draftSession).toBeTruthy();
    expect(stepAttempts).toBeTruthy();
    expect(draftSession && draftSession.date).toBeTruthy();
    expect(stepAttempts && stepAttempts.length).toEqual(mockChainSteps.length);
    expect(stepAttempts && stepAttempts.every((s) => s.status === ChainStepStatus.not_yet_started)).toBeTruthy();
    expect(stepAttempts && stepAttempts.every((s) => !!s.date)).toBeTruthy();
  });

  it('should get step status', () => {
    // All steps are completed = false in mockChainQuestionnaire
    const chainStepId = mockChainSteps[0].id;
    const stepAttempts = chainData.getAllStepAttemptsForChainStep(mockChainSteps[0].id);
    const masteryInfo = chainMastery.masteryInfoMap[chainStepId];
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
    expect(chainMastery.draftSession.step_attempts[0].target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
    expect(chainMastery.getStepStatus(stepAttempts, masteryInfo)).toEqual(ChainStepStatus.focus);
  });

  it('should get next prompt level', () => {
    expect(chainMastery.getNextPromptLevel(ChainStepPromptLevel.full_physical)).toEqual(
      ChainStepPromptLevelMap['partial_physical'],
    );
    expect(chainMastery.getNextPromptLevel(ChainStepPromptLevel.partial_physical)).toEqual(
      ChainStepPromptLevelMap['shadow'],
    );
    expect(chainMastery.getNextPromptLevel(ChainStepPromptLevel.shadow)).toEqual(ChainStepPromptLevelMap['none']);
    expect(chainMastery.getNextPromptLevel(ChainStepPromptLevel.none)).toEqual(ChainStepPromptLevelMap['none']);
  });

  it('should save draft session', () => {
    // Create a draft session of type booster.
    const newMockChainData = chainData.clone();
    const newMockSession = deepClone<ChainSession>(chainMastery.draftSession);
    const numSessionsBefore = newMockChainData.sessions.length;

    newMockSession.session_type = ChainSessionType.booster;
    expect(newMockSession.session_type).toEqual(ChainSessionType.booster);

    newMockChainData.sessions.push(newMockSession);
    expect(newMockChainData.sessions).toHaveLength(numSessionsBefore + 1);

    // The original should be unmodified
    const origLastSession = chainData.lastSession;
    expect(origLastSession).toBeTruthy();
    expect(origLastSession.session_type).toEqual(ChainSessionType.training);
    expect(chainData.sessions).toHaveLength(numSessionsBefore);

    // The clone should be modified
    const lastSession = newMockChainData.lastSession;
    expect(lastSession).toBeTruthy();
    expect(lastSession.session_type).toEqual(ChainSessionType.booster);

    // Last session before saving the draft session should be a training session
    expect(chainMastery.currentSession.session_type).toEqual(ChainSessionType.training);

    // Save the modified chain data with the draft session.
    chainMastery.updateChainData(newMockChainData);

    // Last session type after saving should be booster.
    expect(chainMastery.currentSession.session_type).toEqual(ChainSessionType.booster);
  });

  it('should populate date mastered if more than 3 probe attempts are successful', () => {
    // The date mastered for the first chain step should not be populated yet.
    expect(chainMastery.masteryInfoMap[0].dateMastered).toBeFalsy();

    // Mark all probe and training sessions for first chain step as complete,
    // with no prompting or challenging behavior.
    const newMockChainData = chainData.clone();
    newMockChainData.sessions.forEach((s, i) => {
      s.step_attempts[0].completed = true;
      s.step_attempts[0].was_prompted = false;
      s.step_attempts[0].had_challenging_behavior = false;

      if (s.session_type === ChainSessionType.training) {
        s.step_attempts[0].was_focus_step = true;
        s.step_attempts[0].status = ChainStepStatus.focus;
        s.step_attempts[0].challenging_behaviors = [];
        s.step_attempts[0].prompt_level = ChainStepPromptLevel.none;
      }
    });

    // Save the modified chain data.
    chainMastery.updateChainData(newMockChainData);

    // The date mastered for the first chain step should now be populated.
    expect(chainMastery.masteryInfoMap[0].dateMastered).toBeTruthy();
  });

  test.todo('should show Training session upon completing Probe session');
});

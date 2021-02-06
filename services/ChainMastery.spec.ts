import { deepClone } from '../_util/deepClone';
import { checkMasteryInfo } from '../_util/testing/chainTestUtils';
import { mockChainDataAllProbesSuccessful } from '../_util/testing/mockChainDataAllProbesSuccessful';
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
    checkMasteryInfo(chainMastery, 0, 0);
    expect(chainMastery.chainData.sessions.every((s) => s.completed === true)).toEqual(true);
  });

  it('should populate the mastery info object and draft session for new users', () => {
    chainData = new ChainData({
      user_id: 0,
      participant_id: 0,
      sessions: [],
    });
    chainMastery = new ChainMastery(mockChainSteps, chainData);
    checkMasteryInfo(chainMastery, -1, -1);

    // Step attempt status should be Not Started
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
      const stepAttempt = s.step_attempts[0];
      stepAttempt.completed = true;
      stepAttempt.had_challenging_behavior = false;

      if (s.session_type === ChainSessionType.training) {
        stepAttempt.was_prompted = false;
        stepAttempt.was_focus_step = true;
        stepAttempt.status = ChainStepStatus.focus;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = ChainStepPromptLevel.none;
        stepAttempt.target_prompt_level = ChainStepPromptLevel.full_physical;
      }

      if (s.session_type === ChainSessionType.probe) {
        stepAttempt.was_prompted = undefined;
        stepAttempt.was_focus_step = undefined;
        stepAttempt.status = ChainStepStatus.not_yet_started;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = undefined;
      }
    });

    // Save the modified chain data.
    chainMastery.updateChainData(newMockChainData);

    // The date mastered for the first chain step should now be populated.
    expect(chainMastery.masteryInfoMap[0].dateMastered).toBeTruthy();
  });

  it('should set step to focus if probes are incomplete', () => {
    // Mark all sessions as probes, all steps incomplete with challenging behavior.
    const newMockChainData = chainData.clone();
    newMockChainData.sessions.forEach((s) => {
      s.session_type = ChainSessionType.probe;

      s.step_attempts.forEach((stepAttempt) => {
        stepAttempt.session_type = ChainSessionType.probe;
        stepAttempt.completed = false;
        stepAttempt.had_challenging_behavior = true;
        stepAttempt.was_prompted = undefined;
        stepAttempt.was_focus_step = undefined;
        stepAttempt.status = ChainStepStatus.not_complete;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = undefined;
      });
    });

    // Save the modified chain data.
    chainMastery.updateChainData(newMockChainData);

    // The first chain step should now be marked as the focus step.
    expect(chainMastery.nextFocusChainStepId).toEqual(0);
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
    expect(chainMastery.draftSession.step_attempts[0].was_focus_step).toBeTruthy();
    expect(chainMastery.masteryInfoMap[0].stepStatus).toEqual(ChainStepStatus.focus);
  });

  it('should have no focus step if all steps are mastered', () => {
    // Mark all sessions as probes, all steps incomplete with challenging behavior.
    const newMockChainData = chainMastery.chainData.clone();

    newMockChainData.sessions.forEach((s, i) => {
      s.session_type = ChainSessionType.probe;

      s.step_attempts.forEach((stepAttempt) => {
        stepAttempt.session_type = ChainSessionType.probe;
        stepAttempt.completed = true;
        stepAttempt.had_challenging_behavior = false;
        stepAttempt.was_prompted = undefined;
        stepAttempt.was_focus_step = undefined;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = undefined;

        // Should be the mastery info step status at the time the draft session was created?
        if (i < 5) {
          stepAttempt.status = ChainStepStatus.not_yet_started;
        } else {
          stepAttempt.status = ChainStepStatus.mastered;
        }
      });
    });

    // Save the modified chain data.
    chainMastery.updateChainData(newMockChainData);

    // The first chain step should now be marked as the focus step.
    expect(chainMastery.nextFocusChainStepId).toBeUndefined();
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
    for (const chainStep of mockChainSteps) {
      const draftStepAttempt = chainMastery.draftSession.step_attempts[chainStep.id];
      expect(chainMastery.masteryInfoMap[chainStep.id].stepStatus).toEqual(ChainStepStatus.mastered);
      expect(draftStepAttempt.status).toEqual(ChainStepStatus.mastered);
      expect(draftStepAttempt.was_focus_step).toBeFalsy();
    }
  });

  it('should get the current non-draft session focus step', () => {
    // Mark all steps as not focus step.
    const chainDataWithoutFocus = chainData.clone();
    chainDataWithoutFocus.sessions.forEach((s) => {
      s.step_attempts.forEach((stepAttempt) => {
        stepAttempt.was_focus_step = false;
      });
    });

    // Save the modified chain data.
    chainMastery.updateChainData(chainDataWithoutFocus);
    expect(chainMastery.currentFocusStep).toBeUndefined();
    expect(chainMastery.previousFocusStep).toBeUndefined();

    // Mark first step as focus step.
    const chainDataWithFocus = chainData.clone();
    chainDataWithFocus.sessions.forEach((s) => {
      if (s.session_type === ChainSessionType.training) {
        s.step_attempts[0].was_focus_step = true;
      }
    });

    // Save the modified chain data.
    chainMastery.updateChainData(chainDataWithFocus);
    expect(chainMastery.currentFocusStep).toBeTruthy();
    expect(chainMastery.previousFocusStep).toBeTruthy();
  });

  test.todo('should show Training session upon completing Probe session');
});

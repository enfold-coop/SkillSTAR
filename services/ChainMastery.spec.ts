import { ChainData } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepStatus,
  StepIncompleteReason,
} from '../types/chain/StepAttempt';
import { deepClone } from '../_util/deepClone';
import { checkMasteryInfo } from '../_util/testing/chainTestUtils';
import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { makeMockChainSession } from '../_util/testing/mockChainSessions';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
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
    newMockChainData.sessions.forEach((s) => {
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
    // Mark all sessions as probes:
    // - Even steps incomplete with challenging behavior.
    // - Odd steps complete with no challenging behavior.
    const newMockChainData = chainData.clone();
    newMockChainData.sessions.forEach((s) => {
      s.session_type = ChainSessionType.probe;

      s.step_attempts.forEach((stepAttempt, i) => {
        const isComplete = i % 2 !== 0;
        stepAttempt.session_type = ChainSessionType.probe;
        stepAttempt.completed = isComplete;
        stepAttempt.had_challenging_behavior = !isComplete;
        stepAttempt.was_prompted = !isComplete;
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
    expect(chainMastery.unmasteredChainStepIds).toEqual([0, 2, 4, 6, 8, 10, 12]);
    expect(chainMastery.masteredChainStepIds).toEqual([1, 3, 5, 7, 9, 11, 13]);
    expect(chainMastery.nextFocusChainStepId).toEqual(0);
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
    expect(chainMastery.draftSession.step_attempts[0].was_focus_step).toBeTruthy();
    expect(chainMastery.masteryInfoMap[0].stepStatus).toEqual(ChainStepStatus.focus);
  });

  it('should have no focus step if all steps are mastered', () => {
    // Mark all sessions as probes, all steps complete with no prompting or challenging behavior.
    const newMockChainData = chainMastery.chainData.clone();

    newMockChainData.sessions.forEach((s, i) => {
      s.session_type = ChainSessionType.probe;

      s.step_attempts.forEach((stepAttempt) => {
        stepAttempt.session_type = ChainSessionType.probe;
        stepAttempt.completed = true;
        stepAttempt.had_challenging_behavior = false;
        stepAttempt.was_prompted = false;
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

    // No chain steps should be marked as the focus step.
    expect(chainMastery.nextFocusChainStepId).toBeUndefined();
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);
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

  it('should show Training session upon completing Probe session', () => {
    const chainDataAllProbes = chainData.clone();
    chainDataAllProbes.sessions = [
      makeMockChainSession(1, ChainSessionType.probe),
      makeMockChainSession(2, ChainSessionType.probe),
      makeMockChainSession(3, ChainSessionType.probe),
    ];

    // Save the modified chain data.
    chainMastery.updateChainData(chainDataAllProbes);
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
    expect(chainMastery.draftSession.step_attempts[0].was_focus_step).toBeTruthy();

    // Mark the first step as complete with no challenging behavior.
    chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
      stepAttempt.completed = true;
      stepAttempt.had_challenging_behavior = false;
      stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
      stepAttempt.was_prompted = true;
    });
  });

  it('should set Focus Step target prompt levels', () => {
    // Clear out all sessions.
    const chainDataAllProbes = chainData.clone();
    chainDataAllProbes.sessions = [];
    chainMastery.updateChainData(chainDataAllProbes);

    /* INITIAL PROBE SESSIONS */

    // First 3 sessions should be failing probes.
    for (let i = 0; i < 3; i++) {
      expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

      // Populate probe session step attempts
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        expect(stepAttempt.was_focus_step).toBeFalsy();
        expect(stepAttempt.session_type).toEqual(ChainSessionType.probe);
        expect(stepAttempt.status).toEqual(ChainStepStatus.not_yet_started);
        expect(stepAttempt.target_prompt_level).toBeFalsy();

        // Mark all steps as incomplete
        stepAttempt.was_prompted = true;
        stepAttempt.completed = false;
        stepAttempt.had_challenging_behavior = true;
      });

      // Add draft session to chain data and update chain mastery instance.
      chainMastery.saveDraftSession();
    }

    /* FOCUS STEP MASTERY SESSIONS */

    const numPromptLevels = chainMastery.promptHierarchy.length;
    const numChainSteps = chainMastery.chainSteps.length;
    let numPostProbeSessions = 0;
    const numFocusChainSessions = 5 * numPromptLevels * numChainSteps;
    const numPostMasterySessions = 10;
    const maxSessions = numFocusChainSessions + numPostMasterySessions; // 290

    // For each chain step (in ascending order)...
    for (let focusStepIndex = 0; focusStepIndex < numChainSteps; focusStepIndex++) {
      if (numPostProbeSessions > maxSessions) {
        break;
      }

      // For each prompt level (in descending order)...
      for (let promptLevelIndex = numPromptLevels - 1; promptLevelIndex >= 0; promptLevelIndex--) {
        if (numPostProbeSessions > maxSessions) {
          break;
        }

        // 5 step attempts for focus step at current prompt level:
        //   1. Training --> fail
        //   2. Training --> complete
        //   3. Training --> complete
        //   4. Training --> complete
        //   5. Probe --> complete
        for (let promptLevelAttemptIndex = 0; promptLevelAttemptIndex < 5; promptLevelAttemptIndex++) {
          numPostProbeSessions++;
          if (numPostProbeSessions > maxSessions) {
            break;
          }

          // Every 5th session will be a probe session
          if (numPostProbeSessions % 5 === 0) {
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

            // Populate probe session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              if (stepAttemptIndex <= focusStepIndex) {
                // Mark focus step and any previous steps as complete
                stepAttempt.was_prompted = false;
                stepAttempt.completed = true;
                stepAttempt.had_challenging_behavior = false;
              } else {
                // Mark steps after focus step as incomplete
                stepAttempt.was_prompted = true;
                stepAttempt.completed = false;
                stepAttempt.had_challenging_behavior = true;
              }
            });
          } else {
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);

            // Populate training session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              // Mark steps before the focus step as complete
              if (stepAttemptIndex < focusStepIndex) {
                expect(stepAttempt.was_focus_step).toBeFalsy();

                stepAttempt.was_prompted = false;
                stepAttempt.completed = true;
                stepAttempt.had_challenging_behavior = false;
              }

              // This is the focus step. Fail first attempt at this prompt level, then complete next 3.
              if (stepAttemptIndex === focusStepIndex) {
                expect(stepAttempt.was_focus_step).toEqual(true);
                expect(stepAttempt.status).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.target_prompt_level).toEqual(chainMastery.promptHierarchy[promptLevelIndex].key);

                if (promptLevelAttemptIndex === 0) {
                  // Fail first attempt at this prompt level
                  stepAttempt.was_prompted = true;
                  stepAttempt.completed = false;
                  stepAttempt.had_challenging_behavior = true;
                  stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
                  stepAttempt.reason_step_incomplete = StepIncompleteReason.challenging_behavior;
                  stepAttempt.challenging_behaviors = [{ time: new Date() }];
                } else {
                  // Mark focus step as complete at the target prompt level
                  stepAttempt.was_prompted = false;
                  stepAttempt.completed = true;
                  stepAttempt.had_challenging_behavior = false;
                  stepAttempt.prompt_level = stepAttempt.target_prompt_level;
                }
              }

              // Mark steps after focus step as incomplete
              if (stepAttemptIndex > focusStepIndex) {
                expect(stepAttempt.was_focus_step).toBeFalsy();
                stepAttempt.was_prompted = true;
                stepAttempt.completed = false;
                stepAttempt.had_challenging_behavior = true;
                stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
                stepAttempt.reason_step_incomplete = StepIncompleteReason.challenging_behavior;
                stepAttempt.challenging_behaviors = [{ time: new Date() }];
              }
            });
          }

          // Add draft session to chain data and update chain mastery instance.
          chainMastery.saveDraftSession();
        }
      }
    }

    // All remaining sessions should be probes.
    for (let i = 0; i < numPostProbeSessions; i++) {
      expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

      // Populate probe session step attempts
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        expect(stepAttempt.was_focus_step).toBeFalsy();
        expect(stepAttempt.session_type).toEqual(ChainSessionType.probe);
        expect(stepAttempt.status).toEqual(ChainStepStatus.mastered);
        expect(stepAttempt.target_prompt_level).toBeFalsy();

        // Mark all steps as complete
        stepAttempt.was_prompted = false;
        stepAttempt.completed = true;
        stepAttempt.had_challenging_behavior = false;
      });

      // Add draft session to chain data and update chain mastery instance.
      chainMastery.saveDraftSession();
    }
  });
});

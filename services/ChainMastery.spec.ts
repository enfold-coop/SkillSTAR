import {
  NUM_COMPLETE_ATTEMPTS_FOR_MASTERY,
  NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER,
  NUM_MIN_PROBE_SESSIONS,
  NUM_PROBE_SESSIONS_BETWEEN_TRAINING,
  NUM_TRAINING_SESSIONS_BETWEEN_PROBES,
} from '../constants/MasteryAlgorithm';
import { ChainData } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType } from '../types/chain/ChainSession';
import {
  ChainStepPromptLevel,
  ChainStepPromptLevelMap,
  ChainStepStatus,
  StepIncompleteReason,
} from '../types/chain/StepAttempt';
import { deepClone } from '../_util/deepClone';
import {
  checkAllStepsHaveStatus,
  checkAllStepsHaveTargetPromptLevel,
  checkAllStepsMastered,
  checkMasteryInfo,
  clearSessions,
  completeStepAttempt,
  doProbeSessions,
  failStepAttempt,
  shouldBeProbeSession,
} from '../_util/testing/chainTestUtils';
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
    checkMasteryInfo(chainMastery, 0);
    expect(chainMastery.chainData.sessions.every((s) => s.completed === true)).toEqual(true);
  });

  it('should populate the mastery info object and draft session for new users', () => {
    chainData = new ChainData({
      user_id: 0,
      participant_id: 0,
      sessions: [],
    });
    chainMastery = new ChainMastery(mockChainSteps, chainData);
    checkMasteryInfo(chainMastery, -1);

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
    expect(ChainMastery.getNextPromptLevel(ChainStepPromptLevel.full_physical)).toEqual(
      ChainStepPromptLevelMap['partial_physical'],
    );
    expect(ChainMastery.getNextPromptLevel(ChainStepPromptLevel.partial_physical)).toEqual(
      ChainStepPromptLevelMap['shadow'],
    );
    expect(ChainMastery.getNextPromptLevel(ChainStepPromptLevel.shadow)).toEqual(ChainStepPromptLevelMap['none']);
    expect(ChainMastery.getNextPromptLevel(ChainStepPromptLevel.none)).toEqual(ChainStepPromptLevelMap['none']);
  });

  it('should get previous prompt level', () => {
    expect(ChainMastery.getPrevPromptLevel(ChainStepPromptLevel.full_physical)).toEqual(
      ChainStepPromptLevelMap['full_physical'],
    );
    expect(ChainMastery.getPrevPromptLevel(ChainStepPromptLevel.partial_physical)).toEqual(
      ChainStepPromptLevelMap['full_physical'],
    );
    expect(ChainMastery.getPrevPromptLevel(ChainStepPromptLevel.shadow)).toEqual(
      ChainStepPromptLevelMap['partial_physical'],
    );
    expect(ChainMastery.getPrevPromptLevel(ChainStepPromptLevel.none)).toEqual(ChainStepPromptLevelMap['shadow']);
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
        stepAttempt.was_prompted = false;
        stepAttempt.was_focus_step = undefined;
        stepAttempt.status = ChainStepStatus.not_yet_started;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = ChainStepPromptLevel.full_physical;
      }
    });

    // Save the modified chain data.
    chainMastery.updateChainData(newMockChainData);

    // The date mastered for the first chain step should now be populated.
    expect(chainMastery.masteryInfoMap[0].dateMastered).toBeTruthy();
  });

  it('should calculate the proper number of stars for a step', () => {
    clearSessions(chainData, chainMastery);

    for (const chainStep of mockChainSteps) {
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(0);
    }

    // Fail all steps in 3 probes.
    doProbeSessions(chainMastery, 3, true, ChainStepStatus.not_yet_started);

    for (const chainStep of mockChainSteps) {
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(0);
    }

    clearSessions(chainData, chainMastery);

    // Master all steps in 3 probes.
    doProbeSessions(chainMastery, NUM_COMPLETE_ATTEMPTS_FOR_MASTERY, false, ChainStepStatus.not_yet_started);

    for (const chainStep of mockChainSteps) {
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(NUM_COMPLETE_ATTEMPTS_FOR_MASTERY);
    }

    // Fail all steps in 3 probes to trigger a booster.
    for (let i = 0; i < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        const numStars = chainMastery.getNumStars(stepAttempt.chain_step_id);
        expect(stepAttempt.status).toEqual(ChainStepStatus.mastered);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
        expect(numStars).toEqual(NUM_COMPLETE_ATTEMPTS_FOR_MASTERY - i);
        failStepAttempt(stepAttempt);
      });

      chainMastery.saveDraftSession();
    }

    for (const chainStep of mockChainSteps) {
      expect(chainMastery.masteryInfoMap[chainStep.id].stepStatus).toEqual(ChainStepStatus.booster_needed);
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(0);
    }

    // Do 3 booster sessions at shadow prompt level.
    for (let i = 0; i < NUM_COMPLETE_ATTEMPTS_FOR_MASTERY; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.shadow);
        expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(i);
        completeStepAttempt(stepAttempt);
        stepAttempt.prompt_level = stepAttempt.target_prompt_level;
      });

      chainMastery.saveDraftSession();
    }

    // Do 3 more booster sessions at independent prompt level.
    for (let i = 0; i < NUM_COMPLETE_ATTEMPTS_FOR_MASTERY; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
        expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(i);
        completeStepAttempt(stepAttempt);
        stepAttempt.prompt_level = stepAttempt.target_prompt_level;
      });

      chainMastery.saveDraftSession();
    }

    // All steps should be mastered again.
    for (const chainStep of mockChainSteps) {
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(NUM_COMPLETE_ATTEMPTS_FOR_MASTERY);
      expect(chainMastery.masteryInfoMap[chainStep.id].stepStatus).toEqual(ChainStepStatus.booster_mastered);
    }

    // Fail all steps in 3 probes AGAIN to trigger another booster.
    for (let i = 0; i < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        const numStars = chainMastery.getNumStars(stepAttempt.chain_step_id);
        expect(stepAttempt.status).toEqual(ChainStepStatus.booster_mastered);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
        expect(numStars).toEqual(NUM_COMPLETE_ATTEMPTS_FOR_MASTERY - i);
        failStepAttempt(stepAttempt);
      });

      chainMastery.saveDraftSession();
    }

    for (const chainStep of mockChainSteps) {
      expect(chainMastery.masteryInfoMap[chainStep.id].stepStatus).toEqual(ChainStepStatus.booster_needed);
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(0);
    }

    // Do 3 booster sessions at shadow prompt level.
    for (let i = 0; i < NUM_COMPLETE_ATTEMPTS_FOR_MASTERY; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        const numStars = chainMastery.getNumStars(stepAttempt.chain_step_id);
        expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.shadow);
        expect(numStars).toEqual(i);
        completeStepAttempt(stepAttempt);
        stepAttempt.prompt_level = stepAttempt.target_prompt_level;
      });

      chainMastery.saveDraftSession();
    }

    // Do 3 more booster sessions at independent prompt level.
    for (let i = 0; i < NUM_COMPLETE_ATTEMPTS_FOR_MASTERY; i++) {
      chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
        expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
        expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(i);
        completeStepAttempt(stepAttempt);
        stepAttempt.prompt_level = stepAttempt.target_prompt_level;
      });

      chainMastery.saveDraftSession();
    }

    // All steps should be re-mastered again.
    for (const chainStep of mockChainSteps) {
      expect(chainMastery.getNumStars(chainStep.id)).toEqual(NUM_COMPLETE_ATTEMPTS_FOR_MASTERY);
      expect(chainMastery.masteryInfoMap[chainStep.id].stepStatus).toEqual(ChainStepStatus.booster_mastered);
    }
  });

  it('should set focus step on not-started step if booster is needed on previously-mastered step', () => {
    clearSessions(chainData, chainMastery);

    const sessionTypes = [
      ChainSessionType.probe, // 0. Master first, fail others.
      ChainSessionType.probe, // 1. Master first, fail others.
      ChainSessionType.probe, // 2. Master first, fail others.
      ChainSessionType.training, // 3. First step mastered, 2nd step complete @ full_physical
      ChainSessionType.training, // 4. First step mastered, 2nd step complete @ full_physical
      ChainSessionType.training, // 5. First step mastered, 2nd step complete @ full_physical
      ChainSessionType.training, // 6. First step mastered, 2nd step complete @ partial_physical
      ChainSessionType.training, // 7. First step mastered, 2nd step complete @ partial_physical
      ChainSessionType.training, // 8. First step mastered, 2nd step complete @ partial_physical
      ChainSessionType.training, // 9. First step mastered, 2nd step complete @ shadow
      ChainSessionType.training, // 10. First step mastered, 2nd step complete @ shadow
      ChainSessionType.training, // 11. First step mastered, 2nd step complete @ shadow
      ChainSessionType.training, // 12. First step mastered, 2nd step complete @ none
      ChainSessionType.training, // 13. First step mastered, 2nd step complete @ none
      ChainSessionType.training, // 14. First step mastered, 2nd step complete @ none
      ChainSessionType.probe, // 15. Steps 1 & 2 mastered, fail step 1
      ChainSessionType.probe, // 16. Steps 1 & 2 mastered, fail step 1
      ChainSessionType.probe, // 17. Steps 1 & 2 mastered, fail step 1
      ChainSessionType.training, // 18. Steps 1 & 2 mastered, fail step 1, 3rd step complete @ full_physical
      ChainSessionType.training, // 19. Steps 1 & 2 mastered, fail step 1, 3rd step complete @ full_physical
      ChainSessionType.training, // 19. Steps 1 & 2 mastered, fail step 1, 3rd step complete @ full_physical
    ];

    // Draft session #21 should be:
    // 21. (DRAFT) First step booster @ shadow, 2nd step mastered, 3rd step complete @ partial_physical

    sessionTypes.forEach((sessionType, sessionIndex) => {
      chainMastery.setDraftSessionType(sessionType);
      expect(chainMastery.draftSession.session_type).toEqual(sessionType);
      expect(chainMastery.draftSession.session_number).toEqual(sessionIndex + 1);

      chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
        if (stepAttempt.session_number === undefined) {
          throw new Error('No session number found');
        }

        stepAttempt.num_stars = chainMastery.getNumStars(stepAttempt.chain_step_id);

        // Sessions 0-2: Initial probe sessions.
        if (sessionIndex <= 2) {
          if (stepAttemptIndex === 0) {
            expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(0);

            // Master first chain step.
            completeStepAttempt(stepAttempt);
          } else {
            expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(0);

            // Fail all others with challenging behavior.
            failStepAttempt(stepAttempt, true);
          }
        }

        // Sessions 3-17: First step mastered, 2nd step complete @ full_physical thru independent + 3 probes
        else if (sessionIndex >= 3 && sessionIndex <= 17) {
          if (stepAttemptIndex <= 1) {
            if (stepAttemptIndex === 0) {
              expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(3);
            }

            if (stepAttemptIndex === 1) {
              if (sessionIndex <= 14) {
                // Number of stars will increment from 0 to 3
                expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(sessionIndex % 3);
              } else {
                // Mastered now.
                expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(3);
              }
            }

            // Complete first 2 chain steps.
            completeStepAttempt(stepAttempt);
            stepAttempt.prompt_level = stepAttempt.target_prompt_level;
          } else {
            // Fail Step 3 with NO challenging behavior.
            if (stepAttemptIndex === 2) {
              failStepAttempt(stepAttempt, false);
              stepAttempt.prompt_level = ChainMastery.getPrevPromptLevel(
                stepAttempt.target_prompt_level || ChainStepPromptLevel.full_physical,
              ).key;

              if (sessionIndex <= 5) {
                // The number of stars increases from 1 to 3.
                expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(sessionIndex % 3);
                expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
              } else if (sessionIndex < 15) {
                // Step hasn't been focused yet. It should have 3 stars, since there has been no challenging behavior.
                expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(3);
                expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
              } else {
                // Step 3 is the focus step now. It should have 0 stars, since it has not been completed
                // successfully at the current prompt level.
                expect(stepAttempt.status).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.was_focus_step).toBeTruthy();
                expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(0);

                // Step 3 starts at partial physical, but fails 3 times in training.
                if (stepAttempt.session_number >= 16 && stepAttempt.session_number <= 18) {
                  expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.partial_physical);
                }

                // After failing 3 times, Step 3 is knocked back to full physical.
                if (stepAttempt.session_number > 18) {
                  expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
                }
              }
            }

            // Fail all other steps with challenging behavior.
            else {
              expect(chainMastery.getNumStars(stepAttempt.chain_step_id)).toEqual(0);
              failStepAttempt(stepAttempt, true);
              stepAttempt.prompt_level = ChainMastery.getPrevPromptLevel(
                stepAttempt.target_prompt_level || ChainStepPromptLevel.full_physical,
              ).key;
            }
          }
        }

        // Sessions 18-20: 3 training. First step FAIL, 2nd step mastered, 3rd step complete @ partial_physical
        else if (sessionIndex >= 18 && sessionIndex <= 20) {
          if (stepAttemptIndex === 0) {
            // Fail first step to trigger a booster.
            failStepAttempt(stepAttempt);
          } else if (stepAttemptIndex <= 2) {
            // Complete 2nd & 3rd chain steps.
            completeStepAttempt(stepAttempt);
            stepAttempt.prompt_level = stepAttempt.target_prompt_level;

            if (stepAttemptIndex === 2) {
              expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.partial_physical);
            }
          } else {
            // Fail all others.
            failStepAttempt(stepAttempt, false);
          }
        }
      });

      chainMastery.saveDraftSession();
    });

    // The draft session (#21) should be a booster session
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.booster);

    // The date mastered and date booster initiated for the first chain step should now be populated.
    const m1 = chainMastery.masteryInfoMap[0];
    const s1 = chainMastery.draftSession.step_attempts[0];
    expect(m1).toBeTruthy();
    expect(m1.dateMastered).toBeTruthy();
    expect(m1.dateBoosterInitiated).toBeTruthy();
    expect(m1.dateBoosterMastered).toBeFalsy();
    expect(m1.promptLevel).toEqual(ChainStepPromptLevel.shadow);
    expect(m1.stepStatus).toEqual(ChainStepStatus.booster_needed);
    expect(s1.status).toEqual(ChainStepStatus.booster_needed);
    expect(s1.was_focus_step).toEqual(false);

    // The second step should be mastered.
    const m2 = chainMastery.masteryInfoMap[1];
    const s2 = chainMastery.draftSession.step_attempts[1];
    expect(m2).toBeTruthy();
    expect(m2.dateMastered).toBeTruthy();
    expect(m2.dateBoosterInitiated).toBeFalsy();
    expect(m2.dateBoosterMastered).toBeFalsy();
    expect(m2.promptLevel).toEqual(ChainStepPromptLevel.none);
    expect(m2.stepStatus).toEqual(ChainStepStatus.mastered);
    expect(s2.status).toEqual(ChainStepStatus.mastered);
    expect(s2.was_focus_step).toEqual(false);

    // The third step should be focused @ shadow prompt level
    const m3 = chainMastery.masteryInfoMap[2];
    const s3 = chainMastery.draftSession.step_attempts[2];
    expect(m3).toBeTruthy();
    expect(m3.dateMastered).toBeFalsy();
    expect(m3.dateBoosterInitiated).toBeFalsy();
    expect(m3.dateBoosterMastered).toBeFalsy();
    expect(m3.promptLevel).toEqual(ChainStepPromptLevel.shadow);
    expect(m3.stepStatus).toEqual(ChainStepStatus.focus);
    expect(s3.status).toEqual(ChainStepStatus.focus);
    expect(s3.was_focus_step).toEqual(true);
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
        if (isComplete) {
          completeStepAttempt(stepAttempt);
        } else {
          failStepAttempt(stepAttempt);
        }
        stepAttempt.was_focus_step = undefined;
        stepAttempt.status = ChainStepStatus.not_complete;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = ChainStepPromptLevel.full_physical;
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
        completeStepAttempt(stepAttempt);
        stepAttempt.was_focus_step = undefined;
        stepAttempt.challenging_behaviors = [];
        stepAttempt.prompt_level = undefined;
        stepAttempt.target_prompt_level = ChainStepPromptLevel.full_physical;

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
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

    // All steps should be mastered now.
    checkAllStepsMastered(chainMastery);
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
      stepAttempt.was_prompted = true;
      stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
    });
  });

  it('should set Focus Step target prompt levels', () => {
    clearSessions(chainData, chainMastery);

    /* INITIAL PROBE SESSIONS */

    // First 3 sessions should be failing probes.
    doProbeSessions(chainMastery, 3, true, ChainStepStatus.not_yet_started);
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.not_complete, 0);

    /* FOCUS STEP MASTERY SESSIONS */

    const numPromptLevels = ChainMastery.promptHierarchy.length;
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

        // 15 step attempts = 12 for focus step at target prompt level + 3 probes:
        //   1. Probe --> fail all steps
        //   2. Probe --> fail all steps
        //   3. Probe --> fail all steps
        //   4. Training --> step 0 fail @ full_physical
        //   5. Training --> step 0 fail @ full_physical
        //   6. Training --> step 0 complete @ full_physical
        //   7. Training --> step 0 complete @ full_physical
        //   8. Training --> step 0 complete @ full_physical
        //   9. Training --> step 0 fail @ partial_physical
        //   10. Training --> step 0 fail @ partial_physical
        //   11. Training --> step 0 complete @ partial_physical
        //   12. Training --> step 0 complete @ partial_physical
        //   13. Training --> step 0 complete @ partial_physical
        //   14. Training --> step 0 fail @ shadow
        //   15. Training --> step 0 fail @ shadow
        //   16. Probe --> step 0 complete @ none
        //   17. Probe --> step 0 complete @ none
        //   18. Probe --> step 0 complete @ none *** STEP 0 MASTERED ***
        //   19. Training --> step 1 fail @ full_physical
        //   20. Training --> step 1 fail @ full_physical
        //   21. Training --> step 1 complete @ full_physical
        //   ...
        for (let promptLevelAttemptIndex = 0; promptLevelAttemptIndex < 5; promptLevelAttemptIndex++) {
          numPostProbeSessions++;
          if (numPostProbeSessions > maxSessions) {
            break;
          }

          // Every 13th-15th session will be a probe session
          if (shouldBeProbeSession(chainMastery.chainData)) {
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

            // Populate probe session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              if (stepAttemptIndex <= focusStepIndex) {
                // Mark focus step and any previous steps as complete
                completeStepAttempt(stepAttempt);
              } else {
                // Mark steps after focus step as incomplete
                failStepAttempt(stepAttempt);
              }
            });

            // On 3rd probe session, the step will be mastered ahead of the training schedule.
            // The ordinal of the draft session will be the 1 more than session the current session length.
            const n = chainMastery.chainData.sessions.length + 1;
            const a = NUM_MIN_PROBE_SESSIONS;
            const b = NUM_PROBE_SESSIONS_BETWEEN_TRAINING + NUM_TRAINING_SESSIONS_BETWEEN_PROBES;

            if ((n - a) % b === 0) {
              // Jump promptLevelAttemptIndex ahead to 5 and promptLevelIndex to 0.
              promptLevelAttemptIndex = 5;
              promptLevelIndex = 0;
            }
          } else {
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);

            // Populate training session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              // Mark steps before the focus step as complete
              const stepMasteryInfo = chainMastery.masteryInfoMap[stepAttempt.chain_step_id];

              if (stepAttemptIndex < focusStepIndex) {
                expect(stepMasteryInfo.dateMastered).toBeTruthy();
                expect(stepMasteryInfo.promptLevel).toEqual(ChainStepPromptLevel.none);
                expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.mastered);
                expect(stepAttempt.status).toEqual(ChainStepStatus.mastered);
                expect(stepAttempt.was_focus_step).toBeFalsy();
                expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
                completeStepAttempt(stepAttempt);
              }

              // This is the focus step. Fail 2 attempts at this prompt level, then complete next 3.
              if (stepAttemptIndex === focusStepIndex) {
                const expectedPromptLevel = ChainMastery.promptHierarchy[promptLevelIndex].key;
                expect(stepAttempt.was_focus_step).toEqual(true);
                expect(stepMasteryInfo.dateMastered).toBeFalsy();
                expect(stepMasteryInfo.promptLevel).toEqual(expectedPromptLevel);
                expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.status).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.target_prompt_level).toEqual(expectedPromptLevel);

                if (promptLevelAttemptIndex <= 1) {
                  // Fail first 2 attempts at this prompt level
                  failStepAttempt(stepAttempt);
                  stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
                  stepAttempt.reason_step_incomplete = StepIncompleteReason.challenging_behavior;
                  stepAttempt.challenging_behaviors = [{ time: new Date() }];
                } else {
                  // Mark focus step as complete at the target prompt level
                  completeStepAttempt(stepAttempt);
                  stepAttempt.prompt_level = stepAttempt.target_prompt_level;
                }
              }

              // Mark steps after focus step as incomplete
              if (stepAttemptIndex > focusStepIndex) {
                expect(stepAttempt.was_focus_step).toBeFalsy();
                expect(stepAttempt.status).toEqual(ChainStepStatus.not_complete);
                failStepAttempt(stepAttempt);
                stepAttempt.prompt_level = ChainStepPromptLevel.full_physical;
                stepAttempt.reason_step_incomplete = StepIncompleteReason.challenging_behavior;
                stepAttempt.challenging_behaviors = [{ time: new Date() }];
              }
            });
          }

          // Add draft session to chain data and update chain mastery instance.
          chainMastery.draftSession.completed = true;
          chainMastery.saveDraftSession();
        }
      }
    }

    // All steps should be mastered now.
    checkAllStepsMastered(chainMastery);

    // Complete 3 probes in a row.
    doProbeSessions(chainMastery, NUM_COMPLETE_ATTEMPTS_FOR_MASTERY, false, ChainStepStatus.mastered);

    // All steps should be mastered.
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.mastered);
  });

  it('should set Booster Step target prompt levels', () => {
    clearSessions(chainData, chainMastery);

    /* INITIAL PROBE SESSIONS */

    // First 3 sessions should be successful probes.
    doProbeSessions(chainMastery, 3, false, ChainStepStatus.not_yet_started);

    // All steps should be mastered now.
    checkAllStepsMastered(chainMastery);
    checkAllStepsHaveTargetPromptLevel(chainMastery, ChainStepPromptLevel.none);

    // Fail 3 probes in a row, triggering a booster session for all steps.
    doProbeSessions(chainMastery, NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER, true, ChainStepStatus.mastered);

    // All steps should now require a booster.
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.booster_needed);
    checkAllStepsHaveTargetPromptLevel(chainMastery, ChainStepPromptLevel.shadow);

    /* BOOSTER STEP MASTERY SESSIONS */
    const numPromptLevels = 2;
    const numChainSteps = chainMastery.chainSteps.length;
    let numPostProbeSessions = 0;
    const numFocusChainSessions = 5 * numPromptLevels * numChainSteps; // 140
    const numPostMasterySessions = 10;
    const maxSessions = numFocusChainSessions + numPostMasterySessions; // 150

    // For each prompt level (in descending order)...
    for (let promptLevelIndex = 1; promptLevelIndex >= 0; promptLevelIndex--) {
      if (numPostProbeSessions > maxSessions) {
        break;
      }

      // 5 step attempts for focus step at current prompt level:
      //   1. Booster --> complete
      //   2. Booster --> fail
      //   3. Booster --> complete
      //   4. Booster --> complete
      //   5. Probe --> complete
      for (let promptLevelAttemptIndex = 0; promptLevelAttemptIndex < 5; promptLevelAttemptIndex++) {
        numPostProbeSessions++;
        if (numPostProbeSessions > maxSessions) {
          break;
        }

        // Every 5th session will be a probe session
        if (shouldBeProbeSession(chainMastery.chainData)) {
          expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

          // Populate probe session step attempts
          chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
            // Complete 5th attempt
            completeStepAttempt(stepAttempt);
          });
        } else {
          expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.booster);

          // Populate training session step attempts
          chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
            // Mark steps before the focus step as complete
            const stepMasteryInfo = chainMastery.masteryInfoMap[stepAttempt.chain_step_id];

            // All chain steps will be booster_needed. Fail first attempt at this prompt level, then complete next 3.
            const expectedPromptLevel = ChainMastery.promptHierarchy[promptLevelIndex].key;
            expect(stepMasteryInfo.dateMastered).toBeTruthy();
            expect(stepMasteryInfo.dateBoosterInitiated).toBeTruthy();
            expect(stepMasteryInfo.dateBoosterMastered).toBeFalsy();
            expect(stepMasteryInfo.numAttemptsSince.boosterInitiated).toBeGreaterThanOrEqual(0);
            expect(stepMasteryInfo.dateBoosterMastered).toBeFalsy();
            expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.booster_needed);
            expect(stepMasteryInfo.promptLevel).toEqual(expectedPromptLevel);
            expect(stepAttempt.was_focus_step).toEqual(false);
            expect(stepAttempt.session_type).toEqual(ChainSessionType.booster);
            expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
            expect(stepAttempt.target_prompt_level).toEqual(expectedPromptLevel);
            expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.booster_needed);

            if (promptLevelAttemptIndex === 1) {
              // Fail 2nd attempt at this prompt level
              failStepAttempt(stepAttempt);
              stepAttempt.prompt_level = ChainStepPromptLevel.shadow;
              stepAttempt.reason_step_incomplete = StepIncompleteReason.challenging_behavior;
              stepAttempt.challenging_behaviors = [{ time: new Date() }];
            } else {
              // Mark focus step as complete at the target prompt level
              completeStepAttempt(stepAttempt);
              stepAttempt.prompt_level = stepAttempt.target_prompt_level;
            }
          });
        }

        // Add draft session to chain data and update chain mastery instance.
        chainMastery.draftSession.completed = true;
        chainMastery.saveDraftSession();
      }
    }

    // All steps should be booster_mastered, and remaining sessions should be probes again.
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.booster_mastered);
    chainMastery.draftSession.step_attempts.forEach((s) => {
      expect(s.was_focus_step).toBeFalsy();
    });
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);
    doProbeSessions(chainMastery, NUM_COMPLETE_ATTEMPTS_FOR_MASTERY, false, ChainStepStatus.booster_mastered);

    // Fail all steps 3 times in a row, triggering boster for all steps.
    doProbeSessions(chainMastery, NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER, true, ChainStepStatus.booster_mastered);
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.booster_needed);
  });

  it('should trigger a booster', () => {
    clearSessions(chainData, chainMastery);

    // 3 Initial probe sessions
    // Sessions #0-2 - Do all steps independently for three probe sessions.
    doProbeSessions(chainMastery, NUM_MIN_PROBE_SESSIONS, false, ChainStepStatus.not_yet_started);

    // All steps should be mastered now.
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.mastered);

    // Sessions #3-5 - Fail 3 attempts in a row.
    for (let i = 0; i < NUM_INCOMPLETE_ATTEMPTS_FOR_BOOSTER; i++) {
      chainMastery.setDraftSessionType(ChainSessionType.probe);

      chainMastery.draftSession.step_attempts.forEach((stepAttempt, j) => {
        expect(stepAttempt.session_type).toEqual(ChainSessionType.probe);

        // Step status should still be mastered, at independent target prompt level.
        expect(stepAttempt.status).toEqual(ChainStepStatus.mastered);
        expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);

        // Step required prompting, but no challenging behavior.
        stepAttempt.completed = false;
        stepAttempt.was_prompted = true;

        // Mark every other step as having challenging behavior.
        stepAttempt.had_challenging_behavior = j % 2 === 0;
      });

      chainMastery.draftSession.completed = true;
      chainMastery.saveDraftSession();
    }

    // Draft Session #6
    // All steps should require a booster @ shadow prompt level
    chainMastery.draftSession.step_attempts.forEach((stepAttempt) => {
      expect(stepAttempt.status).toEqual(ChainStepStatus.booster_needed);
      expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.shadow);
    });

    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.booster_needed);
    checkAllStepsHaveTargetPromptLevel(chainMastery, ChainStepPromptLevel.shadow);
  });

  it('should advance through focus steps at appropriate prompt levels', () => {
    clearSessions(chainData, chainMastery);

    // 3 Initial probe sessions
    // Sessions 0-2 - Do no steps independently for three probe sessions.
    doProbeSessions(chainMastery, NUM_MIN_PROBE_SESSIONS, true, ChainStepStatus.not_yet_started);
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.not_complete, 0);

    for (const chainStep of mockChainSteps) {
      const masteryInfo = chainMastery.masteryInfoMap[chainStep.id];
      expect(masteryInfo).toBeTruthy();
      expect(masteryInfo.dateMastered).toBeFalsy();
      expect(masteryInfo.promptLevel).toEqual(ChainStepPromptLevel.full_physical);

      const draftStepAttempt = chainMastery.getDraftSessionStep(chainStep.id);
      expect(draftStepAttempt.chain_step_id).toEqual(chainStep.id);
      expect(draftStepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
    }

    const numPromptLevels = ChainMastery.promptHierarchy.length;
    const lastPromptLevelIndex = numPromptLevels - 1;
    const numChainSteps = mockChainSteps.length;
    const lastChainStepIndex = numChainSteps - 1;
    const maxNumSessions = // 168 + 42 - 3 = 207
      numPromptLevels * numChainSteps * NUM_COMPLETE_ATTEMPTS_FOR_MASTERY + // 4 * 14 * 3 = 168
      numChainSteps * NUM_PROBE_SESSIONS_BETWEEN_TRAINING - // 14 * 3 = 42
      NUM_MIN_PROBE_SESSIONS;

    // Keep track of where we are.
    let focusStepIndex = 0;
    let numPostProbeSessions = 0;
    let numAttemptsAtCurrentPromptLevel = 0; // Check if this number is greater than NUM_COMPLETE_ATTEMPTS_FOR_MASTERY
    let numProbesAfterStepMastered = 0; // Check if this number is greater than NUM_PROBE_SESSIONS_BETWEEN_TRAINING
    let promptLevelIndex: number;
    let isFirstTrainingAfterProbes = true;

    while (focusStepIndex <= lastChainStepIndex) {
      promptLevelIndex = lastPromptLevelIndex;

      while (promptLevelIndex >= 0) {
        while (
          numAttemptsAtCurrentPromptLevel <= NUM_COMPLETE_ATTEMPTS_FOR_MASTERY &&
          numProbesAfterStepMastered <= NUM_PROBE_SESSIONS_BETWEEN_TRAINING
        ) {
          if (isFirstTrainingAfterProbes) {
            // Prompt level will be set back to full_physical after 3 failed probes
            promptLevelIndex = lastPromptLevelIndex;
            isFirstTrainingAfterProbes = false;
          } else if (
            focusStepIndex > 0 &&
            promptLevelIndex === lastPromptLevelIndex &&
            numAttemptsAtCurrentPromptLevel === 0
          ) {
            // Skip straight to the 2nd prompt level if this is not the first chain step.
            promptLevelIndex--;
          }

          if (promptLevelIndex < 0 || numPostProbeSessions >= maxNumSessions) {
            break;
          }

          const promptLevel = ChainMastery.promptHierarchy[promptLevelIndex].key;
          numAttemptsAtCurrentPromptLevel++;
          numPostProbeSessions++;

          // Check to see if we need a probe session
          if (shouldBeProbeSession(chainMastery.chainData)) {
            numProbesAfterStepMastered++;

            // Do a probe session
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

            // Populate probe session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              if (stepAttemptIndex < focusStepIndex) {
                // Mark focus step and any previous steps as complete
                completeStepAttempt(stepAttempt);
              } else if (stepAttemptIndex === focusStepIndex) {
                // The previous focus step was just mastered.
                // The new focus step should be at partial physical, because it was complete at
                // full_physical with challenging behavior fewer than 3 training sessions in a row.
                expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.partial_physical);

                // Mark focus step as incomplete with challenging behavior.
                failStepAttempt(stepAttempt, true);
              } else {
                // Mark steps after focus step as incomplete with challenging behavior.
                failStepAttempt(stepAttempt, true);
              }
            });
          } else {
            // Do a training session at the current prompt level
            expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);

            // Populate training session step attempts
            chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
              // Mark steps before the focus step as complete
              const stepMasteryInfo = chainMastery.masteryInfoMap[stepAttempt.chain_step_id];

              if (stepAttemptIndex < focusStepIndex) {
                expect(stepMasteryInfo.dateMastered).toBeTruthy();
                expect(stepMasteryInfo.promptLevel).toEqual(ChainStepPromptLevel.none);
                expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.mastered);
                expect(stepAttempt.status).toEqual(ChainStepStatus.mastered);
                expect(stepAttempt.was_focus_step).toBeFalsy();
                expect(stepAttempt.target_prompt_level).toEqual(ChainStepPromptLevel.none);
                completeStepAttempt(stepAttempt);
              }

              // This is the focus step. Complete 3 attempts at this prompt level.
              if (stepAttemptIndex === focusStepIndex) {
                expect(stepAttempt.was_focus_step).toEqual(true);
                expect(stepMasteryInfo.dateMastered).toBeFalsy();

                // Mastery info should stay in sync with draft session
                expect(stepMasteryInfo.promptLevel).toEqual(promptLevel);
                expect(stepMasteryInfo.stepStatus).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.status).toEqual(ChainStepStatus.focus);
                expect(stepAttempt.target_prompt_level).toEqual(promptLevel);

                // Mark focus step as complete at the target prompt level
                completeStepAttempt(stepAttempt);
                stepAttempt.prompt_level = stepAttempt.target_prompt_level;
              }

              // Mark steps after focus step as complete at the target prompt level.
              if (stepAttemptIndex > focusStepIndex) {
                expect(stepAttempt.was_focus_step).toBeFalsy();
                expect(stepAttempt.status).toEqual(ChainStepStatus.not_complete);
                completeStepAttempt(stepAttempt);
                stepAttempt.was_prompted = false;
                stepAttempt.prompt_level = stepAttempt.target_prompt_level;
              }
            });
          }

          // Add draft session to chain data and update chain mastery instance.
          chainMastery.draftSession.completed = true;
          chainMastery.saveDraftSession();

          const chainStepId = mockChainSteps[focusStepIndex].id;
          const masteryInfo = chainMastery.masteryInfoMap[chainStepId];
          expect(masteryInfo).toBeTruthy();

          // Check that steps after the focus step have not changed prompt level, unless one of them is about to become
          // the next focus step.
          mockChainSteps.forEach((chainStep, i) => {
            if (chainStep.id > chainStepId) {
              const isNextNewFocusStep =
                promptLevelIndex === 0 &&
                numAttemptsAtCurrentPromptLevel === NUM_COMPLETE_ATTEMPTS_FOR_MASTERY &&
                chainStep.id === chainStepId + 1;
              const promptLevel = isNextNewFocusStep
                ? ChainStepPromptLevel.partial_physical
                : ChainStepPromptLevel.full_physical;

              expect(chainMastery.masteryInfoMap[chainStep.id].promptLevel).toEqual(promptLevel);
              expect(chainMastery.draftSession.step_attempts[i].target_prompt_level).toEqual(promptLevel);
            }
          });

          // Check if focus step is mastered.
          if (promptLevelIndex === 0 && numAttemptsAtCurrentPromptLevel === NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
            promptLevelIndex--;
            numAttemptsAtCurrentPromptLevel = 0;
            numProbesAfterStepMastered = 0;
            expect(masteryInfo.stepStatus).toEqual(ChainStepStatus.mastered);
          } else {
            if (shouldBeProbeSession(chainMastery.chainData)) {
              // Next session will be a probe session.
              expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);
              expect(masteryInfo.stepStatus).toEqual(ChainStepStatus.focus);
            } else {
              // Next session will be a training session.
              expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);
              expect(masteryInfo.stepStatus).toEqual(ChainStepStatus.focus);
            }

            // Check if prompt level is incremented
            const expectedPromptLevel = ChainMastery.promptHierarchy[promptLevelIndex];
            if (numAttemptsAtCurrentPromptLevel === NUM_COMPLETE_ATTEMPTS_FOR_MASTERY) {
              if (numProbesAfterStepMastered < NUM_PROBE_SESSIONS_BETWEEN_TRAINING) {
                // Focus step mastered at this prompt level. Should go to next prompt level.
                promptLevelIndex--;
              } else if (numProbesAfterStepMastered === NUM_PROBE_SESSIONS_BETWEEN_TRAINING) {
                // The prompt level index for the current focus will drop back a level after the 3 probes are finished.
                promptLevelIndex++;
                isFirstTrainingAfterProbes = true;
                numProbesAfterStepMastered = 0;
              }

              if (promptLevelIndex <= 0) {
                // Should be none if mastered
                expect(masteryInfo.promptLevel).toEqual(ChainStepPromptLevel.none);
              } else {
                const nextLevel = ChainMastery.promptHierarchy[promptLevelIndex];

                expect(nextLevel).toBeTruthy();
                expect(masteryInfo.promptLevel).toBeTruthy();
                expect(masteryInfo.promptLevel).toEqual(nextLevel.key);
              }
            } else {
              // Focus step still in training. Prompt level should not change.
              expect(masteryInfo.promptLevel).toBeTruthy();
              expect(masteryInfo.promptLevel).toEqual(expectedPromptLevel.key);
            }

            if (
              numAttemptsAtCurrentPromptLevel === NUM_COMPLETE_ATTEMPTS_FOR_MASTERY &&
              focusStepIndex <= lastChainStepIndex &&
              numPostProbeSessions < maxNumSessions
            ) {
              // Go to the next prompt level
              numAttemptsAtCurrentPromptLevel = 0;
            }
          }
        }
      }

      focusStepIndex++;
    }

    // All steps should be mastered, and remaining sessions should be probes.
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.mastered);
    chainMastery.draftSession.step_attempts.forEach((s) => {
      expect(s.was_focus_step).toBeFalsy();
    });
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);
    doProbeSessions(chainMastery, 3, false, ChainStepStatus.mastered);
  });

  it('should not change target prompt level if post-training probes are incomplete', () => {
    clearSessions(chainData, chainMastery);

    // 3 Initial probe sessions
    // Sessions 0-2 - Do no steps independently for three probe sessions.
    doProbeSessions(chainMastery, NUM_MIN_PROBE_SESSIONS, true, ChainStepStatus.not_yet_started);
    checkAllStepsHaveStatus(chainMastery, ChainStepStatus.not_complete, 0);

    // 12 training sessions
    // Sessions 3-15 - Complete all steps
    for (let i = 0; i < NUM_TRAINING_SESSIONS_BETWEEN_PROBES; i++) {
      for (let j = 0; j < chainMastery.chainSteps.length; j++) {
        expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.training);

        const stepAttempt = chainMastery.draftSession.step_attempts[j];
        completeStepAttempt(stepAttempt);
        stepAttempt.prompt_level = stepAttempt.target_prompt_level;
      }

      chainMastery.saveDraftSession();
    }

    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

    // Step 1 should be mastered @ none
    expect(chainMastery.draftSession.step_attempts[0].status).toEqual(ChainStepStatus.mastered);
    expect(chainMastery.draftSession.step_attempts[0].target_prompt_level).toEqual(ChainStepPromptLevel.none);

    // Step 2 should be focus step @ partial_physical
    expect(chainMastery.draftSession.step_attempts[1].status).toEqual(ChainStepStatus.focus);
    expect(chainMastery.draftSession.step_attempts[1].target_prompt_level).toEqual(
      ChainStepPromptLevel.partial_physical,
    );

    // Step 3 should be not_complete @ full_physical
    expect(chainMastery.draftSession.step_attempts[2].status).toEqual(ChainStepStatus.not_complete);
    expect(chainMastery.draftSession.step_attempts[2].target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);

    // Fail 3 probe sessions in a row with NO challenging behavior.
    for (let i = 0; i < NUM_PROBE_SESSIONS_BETWEEN_TRAINING; i++) {
      for (let j = 0; j < chainMastery.chainSteps.length; j++) {
        const stepAttempt = chainMastery.draftSession.step_attempts[j];
        stepAttempt.completed = false;
        stepAttempt.had_challenging_behavior = false;
        stepAttempt.was_prompted = true;
      }

      chainMastery.saveDraftSession();
    }

    // Step 1 should be booster_needed @ shadow
    expect(chainMastery.draftSession.step_attempts[0].status).toEqual(ChainStepStatus.booster_needed);
    expect(chainMastery.draftSession.step_attempts[0].target_prompt_level).toEqual(ChainStepPromptLevel.shadow);

    // Step 2 should still be focus step @ partial_physical
    expect(chainMastery.draftSession.step_attempts[1].status).toEqual(ChainStepStatus.focus);
    expect(chainMastery.draftSession.step_attempts[1].target_prompt_level).toEqual(
      ChainStepPromptLevel.partial_physical,
    );

    // Step 3 should be not_complete @ full_physical
    expect(chainMastery.draftSession.step_attempts[2].status).toEqual(ChainStepStatus.not_complete);
    expect(chainMastery.draftSession.step_attempts[2].target_prompt_level).toEqual(ChainStepPromptLevel.full_physical);
  });
});

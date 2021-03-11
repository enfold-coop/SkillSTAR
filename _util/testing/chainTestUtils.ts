import { ChainMastery } from '../../services/ChainMastery';
import { ChainData } from '../../types/chain/ChainData';
import { ChainSessionType } from '../../types/chain/ChainSession';
import { ChainStepStatus, StepAttempt } from '../../types/chain/StepAttempt';
import { mockChainSteps } from './mockChainSteps';

export const checkMasteryInfo = (chainMastery: ChainMastery, numLastFailed = -1): void => {
  expect(chainMastery).toBeTruthy();
  expect(chainMastery.chainSteps).toBeTruthy();
  expect(chainMastery.chainSteps.length).toBeGreaterThan(0);
  expect(chainMastery.chainData).toBeTruthy();
  expect(chainMastery.masteryInfoMap).toBeTruthy();
  mockChainSteps.forEach((chainStep) => {
    const masteryInfo = chainMastery.masteryInfoMap[chainStep.id];
    expect(masteryInfo).toBeTruthy();

    const numAttemptsSince = masteryInfo.numAttemptsSince;
    expect(numAttemptsSince.firstIntroduced).toBeTruthy();
    expect(numAttemptsSince.firstCompleted).toBeTruthy();
    expect(numAttemptsSince.lastCompleted).toBeTruthy();
    expect(numAttemptsSince.lastCompletedWithoutChallenge).toBeTruthy();
    expect(numAttemptsSince.lastCompletedWithoutPrompt).toBeTruthy();
    expect(numAttemptsSince.lastProbe).toBeTruthy();
    expect(numAttemptsSince.firstMastered).toBeTruthy();
    expect(numAttemptsSince.boosterInitiated).toBeTruthy();
    expect(numAttemptsSince.boosterMastered).toBeTruthy();
    expect(numAttemptsSince.lastFailed).toEqual(numLastFailed);
  });
  expect(chainMastery.masteredChainStepIds).toBeTruthy();
  expect(chainMastery.masteredChainStepIds).toBeInstanceOf(Array);
  expect(chainMastery.focusedChainStepIds).toBeTruthy();
  expect(chainMastery.focusedChainStepIds).toBeInstanceOf(Array);
  expect(chainMastery.unmasteredFocusedChainStepIds).toBeTruthy();
  expect(chainMastery.unmasteredFocusedChainStepIds).toBeInstanceOf(Array);
  expect(chainMastery.draftSession).toBeTruthy();
  expect(chainMastery.draftSession.completed).toEqual(false);
};

/**
 * Clears out all sessions for the given chain and mastery instances.
 * @param chainData
 * @param chainMastery
 */
export const clearSessions = (chainData: ChainData, chainMastery: ChainMastery): void => {
  const chainDataAllProbes = chainData.clone();
  chainDataAllProbes.sessions = [];
  chainMastery.updateChainData(chainDataAllProbes);
  expect(chainMastery.chainData.sessions).toHaveLength(0);
};

export const doProbeSessions = (
  chainMastery: ChainMastery,
  numToDo: number,
  shouldFail: boolean,
  stepStatus: ChainStepStatus,
): void => {
  const isPostMastery = [
    ChainStepStatus.mastered,
    ChainStepStatus.booster_needed,
    ChainStepStatus.booster_mastered,
  ].includes(stepStatus);

  for (let i = 0; i < numToDo; i++) {
    chainMastery.setDraftSessionType(ChainSessionType.probe);
    expect(chainMastery.draftSession).toBeTruthy();
    expect(chainMastery.draftSession.session_type).toEqual(ChainSessionType.probe);

    // Populate probe session step attempts
    chainMastery.draftSession.step_attempts.forEach((stepAttempt, stepAttemptIndex) => {
      if (!isPostMastery) {
        if (i === 0) {
          // First session
          expect(stepAttempt.status).toEqual(ChainStepStatus.not_yet_started);
        } else if (i < 3) {
          // Before any training session
          if (stepAttempt.status !== ChainStepStatus.not_complete) {
            console.log('fail 1');
            chainMastery.printSessionLog();
          }

          expect(stepAttempt.status).toEqual(ChainStepStatus.not_complete);
        } else if (stepAttemptIndex === 0) {
          // Enough probe sessions run so focus status can be set on first chain step.
          expect(stepAttempt.status).toEqual(ChainStepStatus.focus);
        } else {
          if (stepAttempt.status !== ChainStepStatus.not_complete) {
            console.log('fail 2');
            chainMastery.printSessionLog();
          }

          expect(stepAttempt.status).toEqual(ChainStepStatus.not_complete);
        }
      } else {
        const stepMasteryInfo = chainMastery.masteryInfoMap[stepAttempt.chain_step_id];
        expect(stepMasteryInfo).toBeTruthy();
        expect(stepMasteryInfo.dateIntroduced).toBeTruthy();
        expect(stepMasteryInfo.dateMastered).toBeTruthy();

        if (stepStatus === ChainStepStatus.booster_needed) {
          if (i === 0) {
            expect(stepMasteryInfo.dateBoosterInitiated).toBeFalsy();
          } else {
            expect(stepMasteryInfo.dateBoosterInitiated).toBeTruthy();
          }

          expect(stepMasteryInfo.dateBoosterMastered).toBeFalsy();
        } else if (stepStatus === ChainStepStatus.booster_mastered) {
          expect(stepMasteryInfo.dateBoosterMastered).toBeTruthy();
        }

        expect(stepMasteryInfo.stepStatus).toEqual(stepStatus);
        expect(stepAttempt.status).toEqual(stepStatus);
      }

      expect(stepAttempt.session_type).toEqual(ChainSessionType.probe);
      expect(stepAttempt.was_focus_step).toBeFalsy();
      expect(stepAttempt.target_prompt_level).toBeTruthy();

      if (shouldFail) {
        // Mark all steps as incomplete
        failStepAttempt(stepAttempt);
      } else {
        // Mark all steps as complete
        completeStepAttempt(stepAttempt);
      }
    });

    // Add draft session to chain data and update chain mastery instance.
    chainMastery.draftSession.completed = true;
    chainMastery.saveDraftSession();
  }
};

export const checkAllStepsHaveStatus = (
  chainMastery: ChainMastery,
  stepStatus: ChainStepStatus,
  focusStepId?: number,
): void => {
  for (const chainStep of mockChainSteps) {
    const masteryInfo = chainMastery.masteryInfoMap[chainStep.id];
    expect(masteryInfo).toBeTruthy();

    if (focusStepId !== undefined && focusStepId === chainStep.id) {
      expect(masteryInfo.stepStatus).toEqual(ChainStepStatus.focus);
    } else {
      expect(masteryInfo.stepStatus).toEqual(stepStatus);
    }
  }
};

export const checkAllStepsMastered = (chainMastery: ChainMastery): void => {
  // No chain steps should be marked as the focus step.
  if (chainMastery.nextFocusChainStepId !== undefined) {
    chainMastery.printSessionLog();
    console.log('chainMastery.nextFocusChainStepId', chainMastery.nextFocusChainStepId);
  }
  expect(chainMastery.nextFocusChainStepId).toBeUndefined();
  expect(chainMastery.masteryInfoMap).toBeTruthy();
  expect(chainMastery.draftSession).toBeTruthy();
  expect(chainMastery.draftSession.step_attempts).toBeTruthy();
  expect(chainMastery.draftSession.step_attempts).toHaveLength(mockChainSteps.length);

  for (const chainStep of mockChainSteps) {
    const masteryInfo = chainMastery.masteryInfoMap[chainStep.id];
    expect(masteryInfo).toBeTruthy();
    expect(masteryInfo.stepStatus).toEqual(ChainStepStatus.mastered);
    expect(masteryInfo.dateMastered).toBeTruthy();

    const draftStepAttempt = chainMastery.draftSession.step_attempts[chainStep.id];
    expect(draftStepAttempt).toBeTruthy();
    expect(draftStepAttempt.status).toEqual(ChainStepStatus.mastered);
    expect(draftStepAttempt.was_focus_step).toBeFalsy();
  }
};

export const failStepAttempt = (stepAttempt: StepAttempt): void => {
  stepAttempt.was_prompted = true;
  stepAttempt.completed = false;
  stepAttempt.had_challenging_behavior = true;
};

export const completeStepAttempt = (stepAttempt: StepAttempt): void => {
  stepAttempt.was_prompted = false;
  stepAttempt.completed = true;
  stepAttempt.had_challenging_behavior = false;
};

import { ChainMastery } from '../../services/ChainMastery';
import { mockChainSteps } from './mockChainSteps';

export const checkMasteryInfo = (chainMastery: ChainMastery) => {
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

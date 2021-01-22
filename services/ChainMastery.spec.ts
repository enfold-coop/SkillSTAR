import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
import { ChainData } from '../types/CHAIN/SkillstarChain';
import { ChainMastery } from './ChainMastery';

describe('ChainMastery', () => {
  it('should populate the mastery info object and draft session', () => {
    const chainData = new ChainData(mockChainQuestionnaire);
    const chainMastery = new ChainMastery(mockChainSteps, chainData);

    expect(chainMastery.masteryInfoMap).toBeTruthy();
    expect(chainMastery.chainSteps).toBeTruthy();
    expect(chainMastery.chainData).toBeTruthy();
    expect(chainMastery.masteredChainStepIds).toBeTruthy();
    expect(chainMastery.masteredChainStepIds).toBeInstanceOf(Array);
    expect(chainMastery.focusedChainStepIds).toBeTruthy();
    expect(chainMastery.focusedChainStepIds).toBeInstanceOf(Array);
    expect(chainMastery.unmasteredFocusedChainStepIds).toBeTruthy();
    expect(chainMastery.unmasteredFocusedChainStepIds).toBeInstanceOf(Array);
  });
});

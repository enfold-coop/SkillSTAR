import { ChainSession, ChainSessionType } from '../../types/chain/ChainSession';
import { ChainStepStatus } from '../../types/chain/StepAttempt';
import { mockChainSteps } from './mockChainSteps';
import { makeMockStepAttempt } from './mockStepAttempt';

export const makeMockChainSession = (chainSessionId: number, chainSessionType: ChainSessionType): ChainSession => {
  const day = chainSessionId.toString().padStart(2, '0');
  const dateString = `2021-01-${day}T00:00:00.000000+00:00`;

  return {
    id: chainSessionId,
    last_updated: new Date(dateString),
    time_on_task_ms: 0,
    date: new Date(dateString),
    completed: true,
    session_type: chainSessionType,
    step_attempts: mockChainSteps.map((chainStep) => {
      return makeMockStepAttempt(chainStep.id, chainSessionId, chainSessionType, ChainStepStatus.not_complete, false);
    }),
  };
};

export const mockSession0: ChainSession = makeMockChainSession(1, ChainSessionType.probe);
export const mockSession1: ChainSession = makeMockChainSession(2, ChainSessionType.probe);
export const mockSession2: ChainSession = makeMockChainSession(3, ChainSessionType.probe);
export const mockSession3: ChainSession = makeMockChainSession(4, ChainSessionType.training);
export const mockSession4: ChainSession = makeMockChainSession(5, ChainSessionType.training);
export const mockSession5: ChainSession = makeMockChainSession(6, ChainSessionType.training);

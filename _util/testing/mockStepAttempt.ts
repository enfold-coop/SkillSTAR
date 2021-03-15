import { ChainSessionType } from '../../types/chain/ChainSession';
import { ChainStepPromptLevel, ChainStepStatus, StepAttempt } from '../../types/chain/StepAttempt';
import { mockChainSteps } from './mockChainSteps';

export const makeMockStepAttempt = (
  chainStepId: number,
  chainSessionId: number,
  chainSessionType: ChainSessionType,
  status: ChainStepStatus,
  completed: boolean,
): StepAttempt => {
  const stepAttemptId = chainSessionId * 1000 + chainStepId;
  const day = chainSessionId.toString().padStart(2, '0');
  const hour = chainStepId.toString().padStart(2, '0');
  const dateString = `2021-01-${day}T${hour}:00:00.000000+00:00`;

  if (chainSessionType === ChainSessionType.probe) {
    return {
      id: stepAttemptId,
      last_updated: new Date(dateString),
      chain_step_id: chainStepId,
      chain_step: mockChainSteps[chainStepId],
      date: new Date(dateString),
      session_type: chainSessionType,
      status: status,
      completed: completed,
      was_prompted: !completed,
      had_challenging_behavior: !completed,
      target_prompt_level: ChainStepPromptLevel.full_physical,
    };
  } else {
    const makeFocusStep = chainStepId === 0;
    return {
      id: stepAttemptId,
      last_updated: new Date(dateString),
      chain_step_id: chainStepId,
      chain_step: mockChainSteps[chainStepId],
      date: new Date(dateString),
      session_type: chainSessionType,
      status: makeFocusStep ? ChainStepStatus.focus : status,
      completed: completed,
      was_prompted: !completed,
      was_focus_step: makeFocusStep,
      target_prompt_level: ChainStepPromptLevel.full_physical,
      prompt_level: makeFocusStep ? ChainStepPromptLevel.full_physical : undefined,
      had_challenging_behavior: !completed,
      challenging_behaviors: [
        {
          id: stepAttemptId,
          last_updated: new Date(dateString),
          chain_session_step_id: stepAttemptId,
          time: new Date(dateString),
        },
      ],
    };
  }
};

import { chainSteps } from '../../data/chainSteps';
import { Session } from '../../types/CHAIN/Session';
import { ChainStepStatus, StepAttempt } from '../../types/CHAIN/StepAttempt';

export function createSession() {
  const session = new Session();

  chainSteps.forEach((e, i) => {
    const s: StepAttempt = {
      chain_step_id: e.stepId,
      status: ChainStepStatus.not_complete,
      completed: false,
    };
    session.addStepData(s);
  });
  return session;
}

const MOCK_PROMPT_OPTS = [
  'No Prompt (Independent)',
  'Shadow Prompt (approximately one inch)',
  'Partial Physical Prompt (thumb and index finger)',
  'Full Physical Prompt (hand-over-hand)',
];

const MOCK_BEHAV_OPTS = [
  'Mild (did not interfere with task)',
  'Moderate (interfered with task, but we were able to work through it)',
  'Severe (we were not able to complete the task due to the severity of the behavior)',
];

const MOCK_PROMP_Q = 'What prompt did you use to complete the step?';
const MOCK_BEHAV_Q = 'How severe was the challenging behavior?';

export { MOCK_BEHAV_OPTS, MOCK_BEHAV_Q, MOCK_PROMPT_OPTS, MOCK_PROMP_Q };

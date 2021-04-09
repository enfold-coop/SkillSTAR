/**
 * for ChainsHome "Aside" element
 */
import { ChainSessionTypeLabels } from '../types/chain/ChainSession';

export const PROBE_ASIDE_INSTRUCTIONS = `
Probe sessions are an opportunity to demonstrate skills independently. Please do not provide any prompting. You will enter data based on skill demonstration.
`;

export const PROBE_INSTRUCTIONS = `
Start the probe with a simple instruction "It's time to brush your teeth."  

Do not provide any prompting or supports to the student. If a step is performed incorrectly, out of sequence, or the time limit for completing the step (5 seconds) is exceeded, complete the step for the learner.
`;

/**
 * for "Start [...] Session BUTTON"
 */
export const START_PROBE_SESSION_BTN = `Start ${ChainSessionTypeLabels.probe} Session`;
export const START_TRAINING_SESSION_BTN = `Start ${ChainSessionTypeLabels.training} Session`;
export const START_BOOSTER_SESSION_BTN = `Start ${ChainSessionTypeLabels.training} Session`;

export const PROBE_NAME = 'Task Completion in Probe';
export const TRAINING_NAME = 'Task Completion in Training';
export const CB_NAME = 'Challenging Behavior';

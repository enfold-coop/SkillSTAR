/**
 * for Chainshome "Aside" element
 */
import { ChainSessionTypeLabels } from '../../../types/chain/ChainSession';

const PROBE_INSTRUCTIONS = `
  Start the probe with a simple instruction "It's time to brush your teeth."

  Do not provide any prompting or supports to the student. If a step is performed incorrectly, out of sequence, or the time limit for completing the step (5 seconds) is exceeded, complete the step for the learner.
`;

// TODO: Edit this text
const TRAINING_INSTRUCTIONS = `
  [TBD - Training session instructions]
`;

// TODO: Edit this text
const BOOSTER_INSTRUCTIONS = `
  [TBD - Booster session instructions]
`;

/**
 * for "Start [...] Session BUTTON"
 */
const START_PROBE_SESSION_BTN = `Start ${ChainSessionTypeLabels.probe} Session`;
const START_TRAINING_SESSION_BTN = `Start ${ChainSessionTypeLabels.training} Session`;
const START_BOOSTER_SESSION_BTN = `Start ${ChainSessionTypeLabels.booster} Session`;

export {
  PROBE_INSTRUCTIONS,
  TRAINING_INSTRUCTIONS,
  BOOSTER_INSTRUCTIONS,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
  START_BOOSTER_SESSION_BTN,
};

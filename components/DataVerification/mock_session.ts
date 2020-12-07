import { Session } from "../../types/CHAIN/Session";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import { chainSteps } from "../../data/chainSteps";

export function createSesh() {
	let SESH = new Session();

	chainSteps.forEach((e, i) => {
		let s = new StepAttempt(e.stepId, e.instruction);
		SESH.addStepData(s);
	});
	return SESH;
}

const MOCK_PROMPT_OPTS = [
	"No Prompt (Independent)",
	"Shadow Prompt (approximately one inch)",
	"Partial Physical Prompt (thumb and index finger)",
	"Full Physical Prompt (hand-over-hand)",
];

const MOCK_BEHAV_OPTS = [
	"Mild (did not interfere with task)",
	"Moderate (interfered with task, but we were able to work through it)",
	"Severe (we were not able to complete the task due to the severity of the behavior)",
];

const MOCK_PROMP_Q = "What prompt did you use to complete the step?";
const MOCK_BEHAV_Q = "How severe was the challenging behavior?";

export { MOCK_BEHAV_OPTS, MOCK_BEHAV_Q, MOCK_PROMPT_OPTS, MOCK_PROMP_Q };

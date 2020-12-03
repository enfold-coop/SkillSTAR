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

interface ChallengingBehavior {
	didOccur: boolean;
	severity: number;
}

export class StepAttempt {
	date: Date;
	instruction: string;
	stepId: number;
	wasPrompted: boolean;
	promptLevel: number;
	challengingBehavior?: ChallengingBehavior;

	constructor(stepId: number, instruction: string) {
		this.date = new Date();
		this.stepId = stepId;
		this.instruction = instruction;
		this.wasPrompted = true;
		this.promptLevel = 4;
		this.challengingBehavior = {
			didOccur: false,
			severity: 0,
		};
	}
}

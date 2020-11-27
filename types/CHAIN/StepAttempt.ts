interface ChallengingBehavior {
	didOccur: boolean;
	severity: number;
	description?: string;
}

export class StepAttempt {
	date: Date;
	stepId: number;
	step: {};
	wasPrompted?: boolean;
	promptLevel?: number;
	instruction: string;
	challengingBehavior?: ChallengingBehavior;

	constructor(step: {}) {
		console.log(step);
		let { instruction, stepId } = step;
		this.date = new Date();
		this.step = step;
		this.stepId = stepId;
		console.log(this.stepId);

		this.instruction = instruction;
		this.challengingBehavior = {
			didOccur: false,
			severity: 0,
			description: "",
		};
	}

	setPromptLevel(promptLevel: number) {
		this.promptLevel = promptLevel;
	}

	getPromptLevel(): number | undefined {
		if (this.wasPrompted && this.promptLevel != undefined)
			return this.promptLevel;
	}

	setWasPrompted(wasPrompted: boolean) {
		this.wasPrompted = wasPrompted;
	}

	getWasPrompted(): boolean | undefined {
		if (this.wasPrompted != undefined) return this.wasPrompted;
	}

	setChallengingBehavior(challengingBehavior: ChallengingBehavior) {
		this.challengingBehavior = challengingBehavior;
	}
}

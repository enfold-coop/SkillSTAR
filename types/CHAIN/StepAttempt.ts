interface ChallengingBehavior {
	didOccur: boolean;
	severity: number;
	description?: string;
}

export class StepAttempt {
	date: Date;
	instruction: string;
	stepId: number;
	step: {};
	wasPrompted?: boolean;
	promptLevel?: number;
	challengingBehavior?: ChallengingBehavior;

	constructor(step: StepAttempt) {
		let { instruction, stepId } = step;
		this.date = new Date();
		this.step = step;
		this.stepId = stepId;
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

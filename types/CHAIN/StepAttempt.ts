interface ChallengingBehavior {
	didOccur: boolean;
	severity: number;
	description?: string;
}

class StepAttempt {
	date: Date;
	stepId: number;
	wasPrompted?: boolean;
	promptLevel?: number;
	challengingBehavior?: ChallengingBehavior;

	constructor(stepId: number) {
		this.date = new Date();
		this.stepId = stepId;
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

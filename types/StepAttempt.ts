interface Attempt {
	date?: {};
	wasPrompted?: boolean;
	promptLevel?: number;
	behavOccurred?: boolean;
	behavSeverity?: number;
}

class StepAttempt implements Attempt {
	date: Date = new Date();
	wasPrompted: boolean = false;
	promptLevel: number = 0;
	behavOccurred: boolean = false;
	behavSeverity: number = 0;
}

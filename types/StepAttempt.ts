interface Attempt {
	date?: {};
	wasPrompted?: boolean;
	promptLevel?: number;
	behavOccurred?: boolean;
	behavSeverity?: number;
}

class StepAttempt implements Attempt {
	date: Date = new Date();
}

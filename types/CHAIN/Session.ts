import { StepAttempt } from './StepAttempt';

export class Session {
  date?: Date;
  data: StepAttempt[];

  constructor() {
    this.date = new Date();
    this.data = [];
  }

  addStepData(step: StepAttempt) {
    this.data.push(step);
  }
}

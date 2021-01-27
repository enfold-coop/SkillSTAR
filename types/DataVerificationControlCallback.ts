import { StepAttemptField, StepAttemptFieldName } from './chain/StepAttempt';

export type DataVerificationControlCallback = (
  chainStepId: number,
  fieldName: StepAttemptFieldName,
  fieldValue: StepAttemptField,
) => Promise<void>;

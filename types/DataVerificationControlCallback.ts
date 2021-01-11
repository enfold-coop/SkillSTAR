export type DataVerificationControlCallback = (
  chainStepId: number,
  fieldName: string,
  fieldValue: boolean,
) => Promise<void>;

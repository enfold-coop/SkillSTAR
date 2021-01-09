export type DataVerificationControlCallback = (
  stepId: number,
  fieldName: string,
  fieldValue: boolean,
) => Promise<void>;

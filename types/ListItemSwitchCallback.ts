export type ListItemSwitchCallback = (
  stepId: number,
  value: boolean,
  fieldName: string,
) => Promise<void>;

export enum MasteryLevel {
  NotStarted,
  NotMastered,
  Mastered,
}

export interface MasteryStatus {
  level: MasteryLevel;
  label: string;
  icon: string;
  color: string;
}

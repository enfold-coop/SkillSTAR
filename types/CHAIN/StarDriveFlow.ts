export interface StarDriveFlowStep {
  date_completed: Date;
  label: string;
  name: string;
  questionnaire_id: number;
  status: string;
  type: string;
}

export interface StarDriveFlow {
  name: string;
  steps: StarDriveFlowStep[];
}

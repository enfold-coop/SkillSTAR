export interface ParticipantIdentification {
  first_name: string;
  last_name: string;
  nickname?: string;
}

export interface Participant {
  id: number;
  name: string;
  relationship: string;
  identification: ParticipantIdentification;
}

export interface User {
  id: number;
  email: string;
  last_updated?: Date;
  registration_date?: Date;
  last_login?: Date;
  token?: string;
  role?: string;
  permissions?: string[];
  token_url?: string;
  participant_count?: number;
  created_password: boolean;
  identity: string;
  percent_self_registration_complete: number;
  participants?: Participant[];
}

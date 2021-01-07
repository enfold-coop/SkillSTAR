import { Participant, User } from './User';

export interface AuthProviderState {
  user: null | User;
  participant: null | Participant;
}

export interface AuthProviderProps {
  state: AuthProviderState;
}

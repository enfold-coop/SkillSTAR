import { User } from "./User";

export interface AuthProviderState {
	user: null | User;
}

export interface AuthProviderProps {
	state: AuthProviderState;
}

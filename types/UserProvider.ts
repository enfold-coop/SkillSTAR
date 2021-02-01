import { User } from './User';

export type UserContextStateValue = User;

export type UserContextDispatchAction = { type: 'user'; payload: User };

export type UserContextDispatch = (action: UserContextDispatchAction) => void;

export type UserProviderProps = { children: React.ReactNode };

export type UserProviderState = { user: User | undefined };

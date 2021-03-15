import { ReactNode } from 'react';
import { User } from './User';

export type UserContextDispatchAction = { type: 'user'; payload: User };

export type UserContextDispatch = (action: UserContextDispatchAction) => void;

export type UserProviderProps = { children: ReactNode };

export type UserProviderState = { user: User | undefined };

import { ReactNode } from 'react';
import { Participant } from './User';

export type ParticipantContextDispatchAction = { type: 'participant'; payload: Participant };

export type ParticipantContextDispatch = (action: ParticipantContextDispatchAction) => void;

export type ParticipantProviderProps = { children: ReactNode };

export type ParticipantProviderState = { participant: Participant | undefined };

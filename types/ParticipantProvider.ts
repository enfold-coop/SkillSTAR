import { Participant } from './User';

export type ParticipantContextStateValue = Participant;

export type ParticipantContextDispatchAction = { type: 'participant'; payload: Participant };

export type ParticipantContextDispatch = (action: ParticipantContextDispatchAction) => void;

export type ParticipantProviderProps = { children: React.ReactNode };

export type ParticipantProviderState = { participant: Participant | undefined };

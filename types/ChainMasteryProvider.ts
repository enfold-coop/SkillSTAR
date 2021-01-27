import { ChainMastery } from '../services/ChainMastery';

export type ChainMasteryContextStateValue = ChainMastery;

export type ChainMasteryContextDispatchAction = { type: 'chainMastery'; payload: ChainMastery };

export type ChainMasteryContextDispatch = (action: ChainMasteryContextDispatchAction) => void;

export type ChainMasteryProviderProps = { children: React.ReactNode };

export type ChainMasteryProviderState = { chainMastery: ChainMastery | undefined };

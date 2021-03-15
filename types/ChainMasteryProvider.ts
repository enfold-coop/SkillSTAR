import { ReactNode } from 'react';
import { ChainMastery } from '../services/ChainMastery';

export type ChainMasteryContextDispatchAction = { type: 'chainMastery'; payload: ChainMastery };

export type ChainMasteryContextDispatch = (action: ChainMasteryContextDispatchAction) => void;

export type ChainMasteryProviderProps = { children: ReactNode };

export type ChainMasteryProviderState = { chainMastery: ChainMastery | undefined };

import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type SubItem = {
	id: string;
	title: string;
	score: number;
};

type Skill = {
	name: "";
	subItems: SubItem[];
};

type ChainProviderProps = {};

export const defaultContextValue: ChainProviderProps = {
	skill: {},
	setChainSkill: () => null,
	getChainSkill: () => null,
};

export const ChainContext = React.createContext<ChainProviderProps>(
	defaultContextValue
);

let initialState = {};

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	const [skill, setSkill] = useState<Skill>();

	return (
		<ChainContext.Provider
			value={{
				skill,
				setChainSkill: (s) => {
					setSkill(s);
				},
			}}
		>
			{children}
		</ChainContext.Provider>
	);
};

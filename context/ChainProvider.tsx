import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type Skill = null | { [key: string]: any; };

type ChainProviderProps = { [key: string]: any; }

export const ChainContext = React.createContext<{
	currentSkill: Skill;
	setChainSkill: (skill: Skill) => void;
}>({
	currentSkill: {},
	setChainSkill: (skill: Skill) => { console.log('skill', skill); },
});

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	const [currentSkill, setSkill] = useState<Skill>(null);

	return (
		<ChainContext.Provider
			value={{
				currentSkill,
				setChainSkill: (s) => {
					setSkill(s);
				},
			}}
		>
			{children}
		</ChainContext.Provider>
	);
};

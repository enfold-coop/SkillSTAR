import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type Skill = null | {};

type ChainProviderProps = {};

export const ChainContext = React.createContext<{
	currentSkill: Skill;
	setChainSkill: (skill: Skill) => void;
}>({
	currentSkill: {},
	setChainSkill: (skill: Skill) => {},
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

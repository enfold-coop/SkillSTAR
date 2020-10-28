import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type Skill = {};
type User = string;

export const ChainContext = React.createContext();

interface ChainProviderProps {
	skill: Skill;
	setChainSkill: (skill: Skill) => void;
}

export const ChainProvider = ({ children }) => {
	const [skill, setSkill] = useState<ChainProviderProps>();

	return (
		<ChainContext.Provider
			value={{
				skill,
				setChainSkill: () => {
					setSkill(skill);
				},
			}}
		>
			{children}
		</ChainContext.Provider>
	);
};

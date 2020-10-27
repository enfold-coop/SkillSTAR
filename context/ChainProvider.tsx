import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type User = null | { username: string };
type Skill = null | { skillname: string };

const ChainContext = React.createContext<{
	user: User;
	skill: Skill;
}>({
	user: null,
	skill: null,
});

interface ChainProviderProps {}

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User>(null);
	const [skill, setSkill] = useState<Skill>(null);

	return (
		<ChainContext.Provider
			value={{
				user,
				skill,
			}}
		>
			{children}
		</ChainContext.Provider>
	);
};

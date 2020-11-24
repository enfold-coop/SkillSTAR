import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

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

export const ChainContext = React.createContext<Partial<ChainProviderProps>>(
	{}
);

let initialState = {};

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	let [session, setSession] = useState();
	let [stepAttempt, setStepAttempt] = useState();
	let [authorization, setAuthorization] = useState(false);

	return <ChainContext.Provider value={{}}>{children}</ChainContext.Provider>;
};

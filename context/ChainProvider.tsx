import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepAttempt } from "../types/CHAIN/StepAttempt";

type ChainProviderProps = {};

export const ChainContext = React.createContext<Partial<ChainProviderProps>>(
	{}
);

let initialState = {
	authorization: false,
	session: null,
};

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	let [session, setSession] = useState();
	let [stepAttempt, setStepAttempt] = useState();
	let [authorization, setAuthorization] = useState(false);

	return <ChainContext.Provider value={{}}>{children}</ChainContext.Provider>;
};

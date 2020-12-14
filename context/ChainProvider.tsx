import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import initState from "./initial_states/initialSession";

type ChainProviderProps = {};

export const ChainContext = React.createContext<Partial<ChainProviderProps>>(
	{}
);

let initialState = {
	session: {
		date: "",
		sessionType: "",
		completed: false,
		stepAttempts: [{}],
	},
};

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	initState();
	let [session, setSession] = useState();
	let [stepAttempt, setStepAttempt] = useState();
	let [authorization, setAuthorization] = useState(false);

	return <ChainContext.Provider value={{}}>{children}</ChainContext.Provider>;
};

/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */

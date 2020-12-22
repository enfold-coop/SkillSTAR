import React, { useEffect, useState, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepAttempt } from "../types/Chain/StepAttempt";
import { session } from "./initial_states/initialSession";

type ChainProviderProps = {};

export const ChainContext = React.createContext<Partial<ChainProviderProps>>(
	{}
);

let initialState = {};

export const ChainProvider: React.FC<ChainProviderProps> = ({ children }) => {
	// let initialState = session;
	// // console.log(initialState);
	// const [sessionState, setSessionState] = useReducer(session, initialState);
	// let [session, setSession] = useState();
	// let [stepAttempt, setStepAttempt] = useState();

	return <ChainContext.Provider value={{}}>{children}</ChainContext.Provider>;
};

/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */

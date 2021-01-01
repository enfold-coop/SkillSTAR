import React, { useEffect, useState, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import { session } from "./initial_states/initialSession";

type ChainProviderProps = {};

const initialState = {
	session: {},
	userData: {},
};
const store = React.createContext<ChainProviderProps>(initialState);

const { Provider } = store;

const ChainProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case "addSession":
				return { ...state, session: action.payload };
			case "addUserData":
				return { ...state, userData: action.payload };
			default:
				throw new Error();
		}
	}, initialState);
	console.log("state");
	console.log(state);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, ChainProvider };
/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */

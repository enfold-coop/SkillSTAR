import React, { useEffect, useState, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import { session } from "./initial_states/initialSession";
import {
	ADD_SESSION_TYPE,
	ADD_SESSION,
	ADD_USER_DATA,
	ADD_CURR_SESSION_NMBR,
} from "../context/constants/actions";

type ChainProviderProps = {};

const initialState = {
	sessionType: "",
	session: {},
	userData: {},
	currSessionNmbr: 0,
};

const store = React.createContext<ChainProviderProps>(initialState);

const { Provider } = store;

const ChainProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case ADD_SESSION_TYPE:
				return { ...state, sessionType: action.payload };
			case ADD_SESSION:
				return { ...state, session: action.payload };
			case ADD_USER_DATA:
				return { ...state, userData: action.payload };
			case ADD_CURR_SESSION_NMBR:
				return { ...state, currSessionNmbr: action.payload };
			default:
				throw new Error();
		}
	}, []);
	// console.log("state");
	// console.log(state);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, ChainProvider };
/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */

import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type ProviderProps = {};

export const Context = React.createContext<Partial<ProviderProps>>({});

export const Provider: React.FC<ProviderProps> = ({ children }) => {
	let [session, setSession] = useState();
	let [stepAttempt, setStepAttempt] = useState();
	let [authorization, setAuthorization] = useState(false);

	return <Context.Provider value={{}}>{children}</Context.Provider>;
};

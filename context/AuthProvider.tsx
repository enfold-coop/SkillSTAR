import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type User = null | { username: string };

const AuthContext = React.createContext<{
	user: User;
	login: () => void;
	logout: () => void;
}>({
	user: null,
	login: () => {},
	logout: () => {},
});

interface AuthProviderProps {}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User>(null);
	return (
		<AuthContext.Provider
			value={{
				user,
				login: () => {
					setUser(user);
					AsyncStorage.setItem("user", JSON.stringify(user));
				},
				logout: () => {
					setUser(null);
					AsyncStorage.removeItem("user");
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

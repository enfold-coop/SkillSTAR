import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";

type User = null | { username: string };

const AuthContext = React.createContext<AuthProviderProps>({
	user: null,
	login: () => {},
	logout: () => {},
});

type AuthProviderProps = {
	user: User;
	login: () => void;
	logout: () => void;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User>(null);
	console.log(children);

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

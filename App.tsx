import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { AuthProvider } from "./context/AuthProvider";

/**
 * Entry for the application.
 */
export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<SafeAreaProvider>
				{/* <AppHeader /> */}
				<AuthProvider>
					<Navigation colorScheme={colorScheme} />
				</AuthProvider>
				{/* <StatusBar /> */}
			</SafeAreaProvider>
		);
	}
}

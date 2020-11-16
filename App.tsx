import "react-native-gesture-handler";

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { ChainProvider } from "./context/ChainProvider";

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
				<ChainProvider>
					<Navigation colorScheme={colorScheme} />
				</ChainProvider>
			</SafeAreaProvider>
		);
	}
}

// import {StatusBar} from "expo-status-bar";
import React, {ReactElement} from "react";
// import {View} from "react-native";
// import {AuthProvider} from "./context/AuthProvider";
import "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ChainProvider} from "./context/ChainProvider";
import {useCachedResources} from './hooks/useCachedResources';
import useColorScheme from "./hooks/useColorScheme";
import {Navigation} from './navigation';

/**
 * Entry for the application.
 */
export const App = (): ReactElement | null => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ChainProvider>
          <Navigation colorScheme={colorScheme}/>
        </ChainProvider>
      </SafeAreaProvider>
    );
  }
}

export default App;

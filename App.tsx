import * as Font from 'expo-font';

import React, {useEffect, useState} from "react";
import "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthContext} from './context/AuthProvider';
import {ChainProvider} from "./context/ChainProvider";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import {AuthProviderState} from './types/AuthProvider';

let customFonts = {
  'SkillStarIcons': require('./assets/fonts/icons/skillstar_icons.ttf'),
};

/**
 * Entry for the application.
 */
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const authState: AuthProviderState = {user: null};

  const _loadFonts = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  useEffect(() => {
    _loadFonts();
  });

  if (!fontsLoaded || !isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AuthContext.Provider value={{state: authState}}>
          <ChainProvider>
            <Navigation colorScheme={colorScheme}/>
          </ChainProvider>
        </AuthContext.Provider>
      </SafeAreaProvider>
    );
  }
}

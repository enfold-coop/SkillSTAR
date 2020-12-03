import * as Font from "expo-font";
import React, {useEffect, useState} from "react";
import {Provider} from 'react-native-paper';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthContext} from "./context/AuthProvider";
import {ChainProvider} from "./context/ChainProvider";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

let customFonts = {
  SkillStarIcons: require("./assets/fonts/icons/skillstar_icons.ttf"),
};

/**
 * Entry for the application.
 */
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  const _loadFonts = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    _loadFonts();
  });

  if (!fontsLoaded || !isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider>
          <AuthContext.Provider value={{state: {user: null, participant: null}}}>
            <ChainProvider>
              <Navigation colorScheme={colorScheme}/>
            </ChainProvider>
          </AuthContext.Provider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

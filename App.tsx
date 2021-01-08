import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from './context/AuthProvider';
import { ChainProvider } from './context/ChainProvider';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { customFonts } from './styles/Fonts';

console.log('*** App.tsx ***');

/**
 * Entry for the application.
 */
export default function App() {
  console.log('App');
  const colorScheme = useColorScheme();
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;
    console.log('*** App.tsx ***');

    const _loadFonts = async () => {
      console.log('Loading fonts...');
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync(customFonts);
      await SplashScreen.hideAsync();
    };

    try {
      _loadFonts().then(() => {
        console.log('Fonts have been loaded.');
        if (!isCancelled) {
          setIsLoadingComplete(true);
        }
      });
    } catch (e) {
      // We might want to provide this error information to an error reporting service
      console.warn(e);
    }

    return () => {
      isCancelled = true;
    };
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AuthContext.Provider value={{ state: { user: null, participant: null } }}>
          <Provider>
            <ChainProvider>
              <Navigation colorScheme={colorScheme} />
            </ChainProvider>
          </Provider>
        </AuthContext.Provider>
      </SafeAreaProvider>
    );
  }
}

import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from '@env';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Keyboard, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, TextInput } from 'react-native-paper';
import { useParticipantDispatch } from '../context/ParticipantProvider';
import { useUserDispatch } from '../context/UserProvider';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { RootStackParamList } from '../types/NavigationOptions';

const LandingScreen = (): JSX.Element => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  const [email, setEmail] = useState(DEFAULT_USER_EMAIL);
  const [password, setPassword] = useState(DEFAULT_USER_PASSWORD);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [keyboardIsOpen, setKeyboardIsOpen] = useState<boolean>();
  const userDispatch = useUserDispatch();
  const participantDispatch = useParticipantDispatch();

  /** LIFECYCLE METHODS */
  useEffect(() => {
    let isCancelled = false;
    let isLoading = false;

    // Watch changes to the keyboard hide/show state
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (!isCancelled) {
        setKeyboardIsOpen(true);
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (!isCancelled) {
        setKeyboardIsOpen(false);
      }
    });

    const _loadUser = async () => {
      isLoading = true;
      const user = await ApiService.getUser(() => {
        setIsLoggedOut(true);
        navigation.navigate({ name: 'LandingScreen', params: undefined });
      });

      if (user) {
        await userDispatch({ type: 'user', payload: user });

        // Get cached participant, or participant from STAR DRIVE if none cached.
        const selectedParticipant = await ApiService.getSelectedParticipant();

        if (selectedParticipant) {
          // When the participant is returned, go to the ChainsHomeScreen.
          await participantDispatch({ type: 'participant', payload: selectedParticipant });
          // navigation.navigate('ChainsHomeScreen');
          navigation.navigate('SelectParticipant');
        } else {
          // TODO: There is a cached user, but the user account has no participants.
          //  Render a message that instructs the user to go to STAR DRIVE and
          //  add a dependent to their profile.
          console.error('No participants for the current user');
        }
      } else {
        // If no cached user, this screen will render the login form.
        setIsLoggedOut(true);
      }

      isLoading = false;
    };

    if (!isCancelled) {
      setIsValid(!!(email && password));
      if (!isLoading) {
        _loadUser();
      }
    }

    return () => {
      isCancelled = true;
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  /** END LIFECYCLE METHODS */

  const _checkEmail = async (inputText: string) => {
    if (!isLoggedOut) {
      await ApiService.logout();
      setIsLoggedOut(true);
    }
    setErrorMessage('');
    setIsValid(!!(inputText && password));
    setEmail(inputText);
  };

  const _checkPassword = async (inputText: string) => {
    if (!isLoggedOut) {
      await ApiService.logout();
      setIsLoggedOut(true);
    }
    setErrorMessage('');
    setIsValid(!!(email && inputText));
    setPassword(inputText);
  };

  const _handleLogin = async () => {
    setErrorMessage('');

    try {
      const user = await ApiService.login(email, password);
      if (user) {
        userDispatch({ type: 'user', payload: user });
        navigation.navigate('SelectParticipant');
      }
    } catch (e) {
      setErrorMessage('Invalid username or password. Please check your login information and try again.');
      console.error(e);
    }
  };

  return (
    <ImageBackground source={ImageAssets.sunrise_muted} resizeMode={'cover'} style={styles.image}>
      <View style={{ ...styles.container, justifyContent: keyboardIsOpen ? 'flex-start' : 'center' }}>
        <Animatable.View animation={'zoomIn'}>
          <Image style={styles.logo} source={ImageAssets.logo} />
        </Animatable.View>
        <TextInput
          textAlign={'left'}
          textContentType={'emailAddress'}
          autoComplete={'username'}
          label={'Email'}
          mode={'outlined'}
          value={email}
          style={styles.input}
          onChangeText={(text: string) => _checkEmail(text)}
          autoFocus={true}
          onSubmitEditing={Keyboard.dismiss}
          onFocus={() => Keyboard.emit('keyboardDidShow')}
        />
        <TextInput
          textAlign={'left'}
          textContentType={'password'}
          autoComplete={'password'}
          secureTextEntry={true}
          label={'Password'}
          mode={'outlined'}
          value={password}
          style={styles.input}
          onChangeText={(text: string) => _checkPassword(text)}
          onSubmitEditing={Keyboard.dismiss}
          onFocus={() => Keyboard.emit('keyboardDidShow')}
        />
        <View
          style={{
            display: errorMessage === '' ? 'none' : 'flex',
            ...styles.container,
          }}
        >
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
        <Button
          style={styles.button}
          color={CustomColors.uva.blue}
          mode={'contained'}
          disabled={!isValid}
          onPress={() => {
            _handleLogin();
          }}
        >
          <Text style={styles.btnText}>{`Log In`}</Text>
        </Button>
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    marginTop: 120,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: 200,
    alignSelf: 'center',
    margin: 10,
  },
  button: {
    margin: 22,
    height: 50,
    width: 200,
    padding: 5,
    alignSelf: 'center',
    alignContent: 'center',
  },
  btnText: {
    textAlign: 'center',
    color: CustomColors.uva.white,
    fontSize: 18,
  },
  logo: {
    alignSelf: 'center',
    width: 244,
    height: 244,
    marginBottom: 40,
  },
  error: {
    textAlign: 'center',
    alignSelf: 'center',
    color: CustomColors.uva.warning,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

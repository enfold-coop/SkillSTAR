import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from '@env';
import React, { useContext, useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Text, TextInput } from 'react-native-paper';
import { AuthContext } from '../context/AuthProvider';
import { RootNavProps as Props } from '../navigation/root_types';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { AuthProviderProps } from '../types/AuthProvider';

export default function LandingScreen({ navigation }: Props<'LandingScreen'>) {
  const [email, setEmail] = useState(DEFAULT_USER_EMAIL);
  const [password, setPassword] = useState(DEFAULT_USER_PASSWORD);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const api = new ApiService();
  const context = useContext<AuthProviderProps>(AuthContext);

  const _checkEmail = (inputText: string) => {
    setErrorMessage('');
    setIsValid(!!(inputText && password));
    setEmail(inputText);
  };

  const _checkPassword = (inputText: string) => {
    setErrorMessage('');
    setIsValid(!!(email && inputText));
    setPassword(inputText);
  };

  useEffect(() => {
    setIsValid(!!(email && password));

    api.getUser().then(
      user => {
        if (user) {
          if (user.token) {
            context.state.user = user;
          }

          // Get cached participant, or participant from STAR DRIVE if none cached.
          api.getSelectedParticipant().then(
            selectedParticipant => {
              if (selectedParticipant) {
                // When the participant is returned, go to the ChainsHomeScreen.
                context.state.participant = selectedParticipant;
                navigation.navigate('ChainsHomeScreen');
              } else {
                // TODO: There is a cached user, but the user account has no participants.
                //  Render a message that instructs the user to go to STAR DRIVE and
                //  add a dependent to their profile.
              }
            },
            error => {
              console.error('No participants for the current user', error);
            },
          );
        } else {
          // If no cached user, this screen will render the login form.
        }
      },
      error => {
        // If no cached user, this screen will render the login form.
        console.error('No cached user session. Please log in.', error);
      },
    );
  });

  return (
    <ImageBackground
      source={require('../assets/images/sunrise-muted.jpg')}
      resizeMode={'cover'}
      style={styles.image}
    >
      <View style={styles.container}>
        <Animatable.View animation='zoomIn'>
          <Image style={styles.logo} source={require('../assets/images/logo.png')} />
        </Animatable.View>
        <TextInput
          textContentType='emailAddress'
          autoCompleteType='username'
          label='Email'
          mode='outlined'
          value={email}
          style={styles.input}
          onChangeText={text => _checkEmail(text)}
          autoFocus={true}
        />
        <TextInput
          textContentType='password'
          autoCompleteType='password'
          secureTextEntry={true}
          label='Password'
          mode='outlined'
          value={password}
          style={styles.input}
          onChangeText={text => _checkPassword(text)}
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
          mode='contained'
          disabled={!isValid}
          onPress={() => {
            setErrorMessage('');
            api.login(email, password).then(user => {
              // console.log("user", user);
              if (user) {
                context.state.user = user;
                navigation.navigate('ChainsHomeScreen');
              } else {
                setErrorMessage(
                  'Invalid username or password. Please check your login information and try again.',
                );
              }
            });
          }}
        >
          <Text style={styles.btnText}>Log In</Text>
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 0,
    marginTop: 100,
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

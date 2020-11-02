import React, {ReactElement} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
// import { Appbar } from 'react-native-paper';
import * as TESTTEXT from './TestText';

const logo = {
  uri: '../../assets/images/icon.png'
};

export const AppHeader = (): ReactElement => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/icon.png')} style={styles.logo}/>
      <View style={styles.skillTextContainer}>
        <Text style={styles.headline}>{TESTTEXT.headlineTestText.teeth}</Text>
        <Text style={styles.subHeadline}>{TESTTEXT.subHeadlineTestText.teeth}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    color: '#ff00bb',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa'
  },
  logo: {
    width: 100,
    height: 100
  },
  skillTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10
  },
  headline: {
    fontSize: 50,
    color: '#fb00aa',
    alignSelf: 'center',
  },
  subHeadline: {
    fontSize: 20
  }
});

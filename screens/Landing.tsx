import * as React from 'react';
import { StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import { Text, View } from '../components/Themed';

type LandingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type Props = {
  navigation: LandingNavigationProp;
};

export default function Landing({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LANDING</Text>
      <Button 
        title="To Skills Home"
        onPress={() => navigation.navigate('SkillsHome')}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

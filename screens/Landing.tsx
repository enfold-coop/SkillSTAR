import * as React from 'react';
import { StyleSheet, Button } from 'react-native';
import { LandingProps as Props} from '../types';

import { Text, View } from '../components/Themed';

export default function Landing({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LANDING</Text>
      <Button 
        title="To Skills Home"
        onPress={() => navigation.navigate('SkillsHome')}
      />
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

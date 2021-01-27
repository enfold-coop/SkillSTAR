import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PROBE_INSTRUCTIONS } from './chainshome_text_assets/chainshome_text';

const ProbeAside = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`Probe Session`}</Text>
      <Text style={styles.instructionText}>{PROBE_INSTRUCTIONS}</Text>
    </View>
  );
};

export default ProbeAside;

const styles = StyleSheet.create({
  container: {},
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 16,
    padding: 5,
  },
});

// @ts-ignore
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

type Props = {};

export default function PromptLevelSelector(props) {
  let {} = props;
  const [isActive, setActive] = useState(false);
  return (
    <View style={styles.container}>
      <Text>YOYO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    marginLeft: 20,
    backgroundColor: '#f0f',
  },
});

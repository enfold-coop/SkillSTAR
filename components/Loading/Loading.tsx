import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import CustomColors from '../../styles/Colors';

export const Loading = (): JSX.Element => {
  return (
    <View>
      <ActivityIndicator animating={true} color={CustomColors.uva.mountain} />
    </View>
  );
};

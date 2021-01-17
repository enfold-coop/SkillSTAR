import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import CustomColors from './Colors';

export const globalStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
});

export const globalTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: CustomColors.uva.blue,
    accent: CustomColors.uva.orange,
  },
};

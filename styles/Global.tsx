import { DefaultTheme } from 'react-native-paper';
import CustomColors from './Colors';

export const globalTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: CustomColors.uva.blue,
    accent: CustomColors.uva.orange,
  },
};

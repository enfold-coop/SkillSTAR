import {StackNavigationOptions} from '@react-navigation/stack';
import CustomColors from '../styles/Colors';

export const screenOpts: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: CustomColors.uva.blue,
  },
  headerTintColor: CustomColors.uva.orange,
  headerTitleStyle: {
    fontWeight: "bold",
    color: "#fff",
  },
};

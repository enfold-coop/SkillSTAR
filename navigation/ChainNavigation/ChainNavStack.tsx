import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {ChainStackParamList} from "../../_types/Chain";
import {ChainProvider} from "../../context/ChainProvider";
import ChainsHomeScreen from '../../screens/ChainsHomeScreen';
import PrepareMaterialsScreen from '../../screens/PrepareMaterialsScreen';
import StepScreen from '../../screens/StepScreen';

export const ChainStack = createStackNavigator<ChainStackParamList>();

export function ChainNavigator() {
  return (
    <ChainProvider>
      <ChainStack.Navigator
        initialRouteName="ChainsHomeScreen"
        screenOptions={{headerShown: false}}
      >
        <ChainStack.Screen
          name="ChainsHomeScreen"
          component={ChainsHomeScreen}
        />
        <ChainStack.Screen
          name="PrepareMaterialsScreen"
          component={PrepareMaterialsScreen}
        />
        <ChainStack.Screen name="StepScreen" component={StepScreen}/>
      </ChainStack.Navigator>
    </ChainProvider>
  );
}

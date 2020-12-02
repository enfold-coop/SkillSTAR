import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import * as React from 'react';
import {ReactElement, useContext, useEffect, useState} from 'react';
import {Button, ColorSchemeName, View} from "react-native";
import {Menu, Provider} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';

import {
  BaselineAssessmentScreen,
  ChainsHomeScreen,
  DataVerificationScreen,
  LandingScreen,
  PrepareMaterialsScreen,
  ProbeScreen,
  StepScreen,
} from "../screens";
import {ApiService} from '../services/ApiService';
import CustomColors from '../styles/Colors';
import {screenOpts} from "../types/NavigationOptions";
import {Participant} from '../types/User';
import {RootStackParamList} from "./root_types";

export default function Navigation({
                                     colorScheme,
                                   }: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer>
      <RootNavigator/>
    </NavigationContainer>
  );
}

const api = new ApiService();

interface LogoutButtonProps {
  navigation: StackNavigationProp<any>
}

const LogoutButton = (props: LogoutButtonProps): ReactElement => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [participant, setParticipant] = useState<Participant>();
  const openMenu = () => setIsVisible(true);
  const closeMenu = () => setIsVisible(false);

  const selectParticipant = (selectedParticipant: Participant) => {
    setParticipant(selectedParticipant);
    AsyncStorage.setItem('selected_participant', JSON.stringify(selectedParticipant));
    closeMenu();
  };

  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const context = useContext(AuthContext);

  const participantName = (p: Participant): string => {
    if (p.name) {
      return p.name;
    } else {
      const first = p.identification.nickname || p.identification.first_name;
      const last = p.identification.last_name;
      return `${first} ${last}`;
    }
  }

  useEffect(() => {
    if (context && context.state) {
      console.log('context.state', context.state);
      if (!participant && context.state.participant) {
        setParticipant(context.state.participant);
      }
      if (!menuItems && context.state.user && context.state.user.participants) {
        const dependents = context.state.user.participants.filter(p => p.relationship === 'dependent');
        const items = dependents.map((p: Participant) => {
          return (
            <Menu.Item
              onPress={() => selectParticipant(p)}
              title={participantName(p)}
              key={"participant_" + p.id}
            />
          )
        })
        setMenuItems(items);
      }
    }
  })

  return (
    <Provider>
      <View
        style={{height: '100%', marginRight: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
        <Menu
          visible={isVisible}
          onDismiss={closeMenu}
          anchor={<Button title={participant ? "Participant: " + participantName(participant) : "Select Participant"} onPress={openMenu}/>}
        >{menuItems}</Menu>
        <Button
          title="Logout"
          color={CustomColors.uva.blue}
          onPress={() => {
            api.logout().then(() => {
              props.navigation.navigate("LandingScreen");
            });
          }}
        />
      </View>
    </Provider>
  )
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LandingScreen"
      screenOptions={{headerShown: true}}
    >
      <Stack.Screen
        options={{...screenOpts, title: "Welcome"}}
        name="LandingScreen"
        component={LandingScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Probe Session",
          headerRight: () => (<LogoutButton navigation={navigation}/>)
        })}
        name="ProbeScreen"
        component={ProbeScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Baseline Assessment",
          headerRight: () => (<LogoutButton navigation={navigation}/>)
        })}
        name="BaselineAssessmentScreen"
        component={BaselineAssessmentScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Data Verification",
          headerRight: () => (<LogoutButton navigation={navigation}/>)
        })}
        name="DataVerificationScreen"
        component={DataVerificationScreen}
      />
      {/* <Stack.Screen
				options={{...screenOpts, title: "Skills"}}
				name="SkillsHomeScreen"
				component={SkillsHomeScreen}
			/> */}
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Chains", // TODO: Replace this title with something more useful
          headerRight: () => (<LogoutButton navigation={navigation}/>),
        })}
        name="ChainsHomeScreen"
        component={ChainsHomeScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Prepare Materials",
          headerRight: () => (<LogoutButton navigation={navigation}/>)
        })}
        name="PrepareMaterialsScreen"
        component={PrepareMaterialsScreen}
      />
      <Stack.Screen
        options={({navigation}) => ({
          ...screenOpts,
          title: "Step", // TODO: Replace this title with something more useful
          headerRight: () => (<LogoutButton navigation={navigation}/>)
        })}
        name="StepScreen"
        component={StepScreen}
      />
    </Stack.Navigator>
  );
}

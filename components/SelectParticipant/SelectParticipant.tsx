import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {ReactElement, useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Menu, Provider, Text} from 'react-native-paper';
import {AuthContext} from '../../context/AuthProvider';
import CustomColors from '../../styles/Colors';
import {Participant} from '../../types/User';
import {MaterialIcons} from "@expo/vector-icons";

export interface SelectParticipantProps {
}

export const SelectParticipant = (props: SelectParticipantProps): ReactElement => {
  const context = useContext(AuthContext);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const [participant, setParticipant] = useState<Participant>();
  const closeMenu = () => setIsVisible(false);
  const openMenu = () => setIsVisible(true);

  const selectParticipant = (selectedParticipant: Participant) => {
    setParticipant(selectedParticipant);
    AsyncStorage.setItem('selected_participant', JSON.stringify(selectedParticipant));
    navigation.navigate('BaselineAssessmentScreen');
    closeMenu();
  };

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
              style={styles.menuItem}
            />
          )
        })
        setMenuItems(items);
      }
    }
  })

  return (
    <View style={styles.menuContainer}>
      <Menu
        contentStyle={styles.menuContent}
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={
          <Button
            onPress={openMenu}
            color={CustomColors.uva.orange}
          >
            {participant ? "Participant: " + participantName(participant) : "Select Participant"}
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color={CustomColors.uva.orange}
              />
            </View>
          </Button>
        }
      >{menuItems}</Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingTop: 8,
  },
  menuContainer: {
    marginTop: 4,
    marginRight: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuContent: {
    zIndex: 10001,
  },
  menuItem: {
    zIndex: 999,
  }
});

import {MaterialIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import React, {ReactElement, useContext, useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {Button, Menu, Text,} from "react-native-paper";
import {AuthContext} from "../../context/AuthProvider";
import {ApiService} from '../../services/ApiService';
import CustomColors from "../../styles/Colors";
import {Participant} from "../../types/User";

export interface SelectParticipantProps {
}

export const SelectParticipant = (
  props: SelectParticipantProps
): ReactElement => {
  const api = new ApiService();
  const context = useContext(AuthContext);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<ReactElement[]>();

  const [participant, setParticipant] = useState<Participant>();
  const [participants, setParticipants] = useState<Participant[]>();
  const closeMenu = () => setIsVisible(false);
  const openMenu = () => setIsVisible(true);

  const selectParticipant = async (selectedParticipant: Participant) => {
    context.state.participant = selectedParticipant;
    await setParticipant(selectedParticipant);
    await api.selectParticipant(selectedParticipant.id);
    await navigation.navigate("BaselineAssessmentScreen");
    await closeMenu();
  };

  const participantName = (p: Participant): string | undefined => {
    if (p.identification) {
      const first =
        p.identification.nickname || p.identification.first_name;
      const last = p.identification.last_name;
      return `${first} ${last}`;
    }
  };

  useEffect(() => {
    if (context && context.state) {
      if (!participant) {
        api.getSelectedParticipant().then((p) => {
          if (p) {
            setParticipant(p);
          } else if (!participant && context.state.participant) {
            setParticipant(context.state.participant);
          }
        });
      }
      if (
        !menuItems &&
        context.state.user &&
        context.state.user.participants
      ) {
        const dependents = context.state.user.participants.filter(
          (p) => p.relationship === "dependent"
        );
        const items = dependents.map((p: Participant) => {
          return (
            <Menu.Item
              onPress={() => selectParticipant(p)}
              title={participantName(p)}
              key={"participant_" + p.id}
              style={styles.menuItem}
            />
          );
        });
        setMenuItems(items);
        setParticipants(dependents);
      }
    }
  });

  if (!menuItems || menuItems.length === 0) {
    return (
      <View style={styles.menuContainer}>
        <Text style={{marginRight: 100}}>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        // paddingTop: 50,
        flexDirection: "row",
      }}
    >
      <Menu
        style={styles.menuContainer}
        contentStyle={styles.menuContent}
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={
          <Button
            onPress={openMenu}
            color={CustomColors.uva.orange}
            // mode={"contained"}
          >
            {participant
              ? "Participant: " + participantName(participant)
              : "Select Participant"}
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color={CustomColors.uva.orange}
              />
            </View>
          </Button>
        }
      >
        {menuItems}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingTop: 8,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 270,
  },
  menuContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "space-around",
    padding: 10,
  },
  menuItem: {
    height: 50,
    padding: 10,
  },
});

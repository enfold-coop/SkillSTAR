import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { ApiService } from '../../services/ApiService';
import CustomColors from '../../styles/Colors';
import { Participant, User } from '../../types/User';

export const SelectParticipant = (): ReactElement => {
  const api = new ApiService();
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const [user, setUser] = useState<User>();
  const [participant, setParticipant] = useState<Participant>();
  const [participants, setParticipants] = useState<Participant[]>();
  const closeMenu = () => setIsVisible(false);
  const openMenu = () => setIsVisible(true);

  const selectParticipant = async (selectedParticipant: Participant) => {
    const participant = await api.selectParticipant(selectedParticipant.id);

    if (participant) {
      await setParticipant(selectedParticipant);
      await navigation.navigate('ChainsHomeScreen');
    }

    await closeMenu();
  };

  const participantName = (p: Participant): string | undefined => {
    if (p.identification) {
      const first = p.identification.nickname || p.identification.first_name;
      const last = p.identification.last_name;
      return `${first} ${last}`;
    } else if (p.name) {
      return p.name;
    } else {
      return `${p.id}`;
    }
  };

  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true;

      if (!user) {
        const dbUser = await api.getUser();
        if (!isCancelled) {
          setUser(dbUser);
        }
      }

      if (user && user.participants && user.participants.length > 1) {
        if (!participants && !isCancelled) {
          setParticipants(user.participants.filter(p => p.relationship === 'dependent'));
        }
      }

      if (!isCancelled) {
        const selectedParticipant = await api.getSelectedParticipant();
        const shouldSetSelectedParticipant =
          !isCancelled &&
          (!participant || (selectedParticipant && participant.id !== selectedParticipant.id));

        if (shouldSetSelectedParticipant) {
          setParticipant(selectedParticipant);
        }
      }
    };

    if (!isLoading) {
      _load().then(() => {
        isLoading = false;
        if (participants && participants.length > 0) {
          const items = participants.map((p: Participant) => {
            return (
              <Menu.Item
                onPress={() => selectParticipant(p)}
                title={participantName(p)}
                key={'participant_' + p.id}
                style={styles.menuItem}
              />
            );
          });
          if (!isCancelled) {
            setMenuItems(items);
          }
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [participant, participants]);

  const btnLabel = participant
    ? `Participant: ${participantName(participant)}`
    : 'Select Participant';

  const key = `select_participant_menu_${menuItems && menuItems.length > 0 ? menuItems.length : 0}`;

  const renderLoading = () => {
    return <Text style={{ marginRight: 100 }}>Loading...</Text>;
  };

  const renderMenu = () => {
    return (
      <Menu
        contentStyle={styles.menuContent}
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={
          <Button onPress={openMenu} color={CustomColors.uva.orange} style={styles.menuButton}>
            {btnLabel}
            <View style={styles.iconContainer}>
              <MaterialIcons name='arrow-drop-down' size={24} color={CustomColors.uva.orange} />
            </View>
          </Button>
        }
      >
        {menuItems}
      </Menu>
    );
  };

  return (
    <View style={styles.menuContainer} key={key}>
      {menuItems && menuItems.length > 0 ? renderMenu() : renderLoading()}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingTop: 8,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: -16,
    height: 60,
    padding: 0,
  },
  menuButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  menuContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    padding: 10,
  },
  menuItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    height: 50,
    padding: 10,
  },
});

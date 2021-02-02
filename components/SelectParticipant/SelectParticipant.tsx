import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Divider, Menu } from 'react-native-paper';
import { useChainMasteryDispatch } from '../../context/ChainMasteryProvider';
import { useParticipantContext } from '../../context/ParticipantProvider';
import { useUserContext } from '../../context/UserProvider';
import { ApiService } from '../../services/ApiService';
import { ChainMastery } from '../../services/ChainMastery';
import CustomColors from '../../styles/Colors';
import { ChainData, SkillstarChain } from '../../types/chain/ChainData';
import { ChainStep } from '../../types/chain/ChainStep';
import { Participant } from '../../types/User';

export interface SelectParticipantProps {
  onChange: (participant: Participant) => void;
}

export const SelectParticipant = (props: SelectParticipantProps): ReactElement => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [participants, setParticipants] = useState<Participant[]>();
  const [shouldGoHome, setShouldGoHome] = useState<boolean>(false);
  const { onChange } = props;
  const closeMenu = () => setIsVisible(false);
  const openMenu = () => setIsVisible(true);
  const [userState, userDispatch] = useUserContext();
  const [participantState, participantDispatch] = useParticipantContext();
  const chainMasteryDispatch = useChainMasteryDispatch();

  /** LIFECYCLE METHODS */

  // Only runs when selectedParticipant is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        // Load chain steps
        if (!chainSteps) {
          await ApiService.load<ChainStep[]>('chainSteps', ApiService.getChainSteps, setChainSteps, isCancelled);
        }

        const dbSelectedParticipant = await ApiService.getSelectedParticipant();
        if (!isCancelled && dbSelectedParticipant && !participantState.participant && !shouldGoHome) {
          participantDispatch({ type: 'participant', payload: dbSelectedParticipant });
        }

        if (!isCancelled && chainSteps) {
          const dbChainData = await ApiService.getChainDataForSelectedParticipant();

          if (dbChainData && dbChainData.sessions) {
            const newChainData = new ChainData(dbChainData);
            const newChainMastery = new ChainMastery(chainSteps, newChainData);

            // Update the Chain Mastery Provider
            chainMasteryDispatch({ type: 'chainMastery', payload: newChainMastery });
          }
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [participantState.participant]);

  // Only runs when shouldGoHome is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && shouldGoHome && participantState.participant) {
        onChange(participantState.participant);
        navigation.navigate('ChainsHomeScreen', {});
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [shouldGoHome]);

  // Only runs when user or participants list are updated
  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true;

      if (!userState.user) {
        const contextUser = userState.user;
        if (!isCancelled && !contextUser) {
          const dbUser = await ApiService.getUser();
          if (!isCancelled && dbUser) {
            userDispatch({ type: 'user', payload: dbUser });
          } else {
            // User session has expired. Log out.
            await ApiService.logout();
          }
        }
      }

      if (!chainSteps) {
        const contextChainSteps = await ApiService.contextState('chainSteps');
        if (!isCancelled && contextChainSteps) {
          setChainSteps(contextChainSteps as ChainStep[]);
        } else {
          const dbChainSteps = await ApiService.getChainSteps();
          if (!isCancelled && dbChainSteps) {
            setChainSteps(dbChainSteps);
          }
        }
      }

      if (userState.user && userState.user.participants && userState.user.participants.length > 1) {
        if (!participants && !isCancelled) {
          setParticipants(userState.user.participants.filter((p) => p.relationship === 'dependent'));
        }
      }
    };

    if (!isCancelled && !isLoading) {
      _load().then(() => {
        isLoading = false;
        if (!isCancelled && participants && participants.length > 0) {
          const items = participants.map((p: Participant) => {
            return (
              <View key={'participant_' + p.id}>
                <Menu.Item onPress={() => selectParticipant(p)} title={participantName(p)} style={styles.menuItem} />
                <Divider />
              </View>
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
  }, [userState.user, participants]);

  /** END LIFECYCLE METHODS */

  const selectParticipant = async (selectedParticipant: Participant) => {
    const newDbParticipant = await ApiService.selectParticipant(selectedParticipant.id);

    if (newDbParticipant) {
      closeMenu();

      // Check that the current participant has chain data. If not, add it.
      const dbData = await ApiService.getChainDataForSelectedParticipant();

      if (!dbData || (dbData && dbData.id === undefined)) {
        const newData: SkillstarChain = {
          participant_id: newDbParticipant.id,
          sessions: [],
        };

        try {
          const newDbData = await ApiService.addChainData(newData);
        } catch (e) {
          console.error(e);
        }
      }

      // Update the participant in the Participant Provider
      participantDispatch({ type: 'participant', payload: newDbParticipant });
      setShouldGoHome(true);
    } else {
      closeMenu();
    }
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

  const btnLabel = participantState.participant
    ? `Participant: ${participantName(participantState.participant)}`
    : 'Select Participant';

  const key = `select_participant_menu_${menuItems && menuItems.length > 0 ? menuItems.length : 0}`;

  const renderLoading = () => {
    return <Text style={{ marginRight: 100 }}>{`Loading...`}</Text>;
  };

  const renderMenu = () => {
    return (
      <Menu
        contentStyle={menuItems?.length ? menuContent(menuItems?.length).menu : menuContent(1).menu}
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={
          <View style={styles.anchorBtn}>
            <Button onPress={openMenu} color={CustomColors.uva.orange}>
              {btnLabel}
              <MaterialIcons name={'arrow-drop-down'} size={40} color={CustomColors.uva.orange} />
            </Button>
          </View>
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
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  anchorBtn: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  menuItem: {
    margin: 1,
    marginHorizontal: 5,
    backgroundColor: CustomColors.uva.white,
  },
});

const menuContent = (items: number) => {
  return StyleSheet.create({
    menu: {
      padding: 5,
      backgroundColor: 'rgba(255,255,255,0.5)',
      top: 160,
      height: 55 * items,
      width: 277,
    },
  });
};

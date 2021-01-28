import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { useChainMasteryDispatch } from '../../context/ChainMasteryProvider';
import { useParticipantDispatch, useParticipantState } from '../../context/ParticipantProvider';
import { ApiService } from '../../services/ApiService';
import { ChainMastery } from '../../services/ChainMastery';
import CustomColors from '../../styles/Colors';
import { ChainData, SkillstarChain } from '../../types/chain/ChainData';
import { ChainStep } from '../../types/chain/ChainStep';
import { Participant, User } from '../../types/User';

export interface SelectParticipantProps {
  onChange: (participant: Participant) => void;
}

export const SelectParticipant = (props: SelectParticipantProps): ReactElement => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [user, setUser] = useState<User>();
  const [participants, setParticipants] = useState<Participant[]>();
  const [shouldGoHome, setShouldGoHome] = useState<boolean>(false);
  const { onChange } = props;
  const closeMenu = () => setIsVisible(false);
  const openMenu = () => setIsVisible(true);
  const participantState = useParticipantState();
  const participantDispatch = useParticipantDispatch();
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
          console.log('SelectParticipant.tsx > Participant changed');
          const dbChainData = await ApiService.getChainDataForSelectedParticipant();

          console.log('dbChainData retrieved?', !!dbChainData);

          if (dbChainData && dbChainData.sessions) {
            console.log('chainSteps.length', chainSteps.length);

            const newChainData = new ChainData(dbChainData);
            console.log('newChainData instantiated?', !!newChainData);

            const newChainMastery = new ChainMastery(chainSteps, newChainData);

            console.log('newChainMastery instantiated?', !!newChainMastery);

            console.log('last session:', dbChainData.lastSession);

            // Update the Chain Mastery Provider
            chainMasteryDispatch({ type: 'chainMastery', payload: newChainMastery });
          }
        }

        if (!isCancelled && shouldGoHome) {
          if (participantState.participant) {
            onChange(participantState.participant);
          }
          navigation.navigate('ChainsHomeScreen', {});
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

  // Only runs when user or participants list are updated
  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true;

      if (!user) {
        const contextUser = await ApiService.contextState('user');
        if (!isCancelled && contextUser) {
          setUser(contextUser as User);
        } else {
          const dbUser = await ApiService.getUser();
          if (!isCancelled && dbUser) {
            setUser(dbUser as User);
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

      if (user && user.participants && user.participants.length > 1) {
        if (!participants && !isCancelled) {
          setParticipants(user.participants.filter(p => p.relationship === 'dependent'));
        }
      }
    };

    if (!isCancelled && !isLoading) {
      _load().then(() => {
        isLoading = false;
        if (!isCancelled && participants && participants.length > 0) {
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
  }, [user, participants]);

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
        contentStyle={styles.menuContent}
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={
          <Button onPress={openMenu} color={CustomColors.uva.orange} style={styles.menuButton}>
            {btnLabel}
            <View style={styles.iconContainer}>
              <MaterialIcons name={'arrow-drop-down'} size={24} color={CustomColors.uva.orange} />
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

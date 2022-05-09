import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { useChainMasteryDispatch } from '../../context/ChainMasteryProvider';
import { useParticipantContext } from '../../context/ParticipantProvider';
import { useUserState } from '../../context/UserProvider';
import { ApiService } from '../../services/ApiService';
import { ChainMastery } from '../../services/ChainMastery';
import CustomColors from '../../styles/Colors';
import { ChainData, SkillstarChain } from '../../types/chain/ChainData';
import { RootStackParamList } from '../../types/NavigationOptions';
import { Participant } from '../../types/User';
import { participantName } from '../../_util/ParticipantName';
import { Loading } from '../Loading/Loading';

export const SelectParticipant = (): ReactElement => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [menuItems, setMenuItems] = useState<ReactElement[]>();
  const [participants, setParticipants] = useState<Participant[]>();
  const userState = useUserState();
  const [participantState, participantDispatch] = useParticipantContext();
  const chainMasteryDispatch = useChainMasteryDispatch();

  /** LIFECYCLE METHODS */

  // Only runs when user is updated
  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;
    let isLoading = false;

    const _load = async () => {
      isLoading = true;

      // Check whether there is a user and if they have participants
      if (userState.user && userState.user.participants && userState.user.participants.length > 1) {
        // Get the participants list from the user object.
        if (!participants && !isCancelled) {
          setParticipants(userState.user.participants.filter((p) => p.relationship === 'dependent'));
        }

        // Get selected participant from local storage
        const dbSelectedParticipant = await ApiService.getSelectedParticipant();

        // If no participant has been selected yet, set it.
        if (!isCancelled && dbSelectedParticipant && !participantState.participant) {
          participantDispatch({ type: 'participant', payload: dbSelectedParticipant });
        }
      }
    };

    if (!isCancelled && !isLoading) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [userState.user]);

  // Only runs when participants list is updated
  useEffect(() => {
    // Prevents React state updates on unmounted components
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && participants && participants.length > 0) {
        const items = participants.map((p: Participant) => {
          return (
            <View key={'participant_' + p.id}>
              <Button onPress={() => selectParticipant(p)}>{participantName(p)}</Button>
              <Divider />
            </View>
          );
        });
        if (!isCancelled) {
          setMenuItems(items);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [participants]);

  /** END LIFECYCLE METHODS */

  const selectParticipant = async (selectedParticipant: Participant) => {
    const newDbParticipant = await ApiService.selectParticipant(selectedParticipant.id);

    if (newDbParticipant) {
      // Check that the current participant has chain data. If not, add it.
      let dbData = await ApiService.getChainDataForSelectedParticipant();

      // No data was found in the database for this participant. Create it.
      if (!dbData || (dbData && dbData.id === undefined)) {
        const newData: SkillstarChain = {
          participant_id: newDbParticipant.id,
          sessions: [],
        };

        try {
          const dbNewData = await ApiService.addChainData(newData);
          if (dbNewData) {
            dbData = new ChainData(dbNewData);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Initialize the chainMasteryState with the selected participant's chain data.
      const dbChainSteps = await ApiService.getChainSteps();

      if (dbChainSteps) {
        if (dbData && dbData.sessions) {
          const newChainMastery = new ChainMastery(dbChainSteps, dbData);

          // Update the Chain Mastery Provider
          chainMasteryDispatch({ type: 'chainMastery', payload: newChainMastery });

          // Update the participant in the Participant Provider
          participantDispatch({ type: 'participant', payload: newDbParticipant });

          navigation.navigate({ name: 'ChainsHomeScreen', params: undefined });
        } else {
          console.error('No chain data found in the database!');
        }
      } else {
        console.error('No chain steps found in the database!');
      }
    } else {
      console.error('No participant found in the database!');
    }
  };

  return menuItems && menuItems.length > 0 ? <View style={styles.menuContainer}>{menuItems}</View> : <Loading />;
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  anchorBtn: {
    // width: 300,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: '#f0f',
  },
  menuItem: {
    margin: 1,
    marginHorizontal: 5,
    backgroundColor: CustomColors.uva.white,
  },
  btnText: {
    color: CustomColors.uva.orange,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  icon: {
    height: 50,
  },
});

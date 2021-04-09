import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';

export const ConfirmExitSession = (): ReactElement => {
  const navigation = useNavigation();
  const chainMasteryState = useChainMasteryState();
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const showModal = () => {
    // Display the modal
    setShouldShowModal(true);
  };

  const confirm = () => {
    // Hide the modal
    setShouldShowModal(false);

    // Clear the draft session data
    if (chainMasteryState.chainMastery) {
      chainMasteryState.chainMastery.resetDraftSession();
    }

    // Navigate to chains home screen
    navigation.navigate('ChainsHomeScreen');
  };

  const cancel = () => {
    // Just hide the modal
    setShouldShowModal(false);
  };

  return (
    <View>
      <Modal visible={shouldShowModal} animationType={'slide'} presentationStyle={'fullScreen'}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{'Wait!'}</Text>
          <Text style={styles.headline}>
            {'Exiting now will delete any data from the current session. Are you sure you want to exit?'}
          </Text>
          <View style={styles.btnContainer}>
            <Button
              style={styles.closeBtn}
              labelStyle={{ fontSize: 16 }}
              color={CustomColors.uva.orange}
              mode={'contained'}
              onPress={confirm}
            >{`Yes`}</Button>
            <Button
              style={styles.closeBtn}
              labelStyle={{ fontSize: 16 }}
              color={CustomColors.uva.blue}
              mode={'contained'}
              onPress={cancel}
            >{`No`}</Button>
          </View>
        </View>
      </Modal>
      <Button labelStyle={{ fontSize: 16, textTransform: 'capitalize' }} color={'white'} onPress={showModal}>
        {'Exit Session'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 200,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 48,
    marginBottom: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  headline: {
    fontSize: 24,
    marginBottom: 40,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  closeBtn: {
    width: 200,
    margin: 10,
    alignSelf: 'center',
  },
});

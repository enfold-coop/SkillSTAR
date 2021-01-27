import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, Button } from 'react-native-paper';
import { randomId } from '../_util/RandomId';
import { DataVerifItem } from '../components/DataVerification';
import ColumnLabels from '../components/DataVerification/ColumnLabels';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { useChainMasteryState } from '../context/ChainMasteryProvider';
import CustomColors from '../styles/Colors';

const DataVerificationScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const chainMasteryState = useChainMasteryState();

  // Called on 2nd press of Submit button
  const submitAndNavigate = () => {
    setConfirmSubmit(false);
    postData();
    navigation.navigate('ChainsHomeScreen');
  };

  // Post state data to API
  const postData = () => {
    console.log('POSTING DATA');
  };

  return (
    <View style={styles.container}>
      <AppHeader name={'Brushing Teeth'} />
      <View style={styles.instructionContainer}>
        <Text style={[scrolling ? styles.smallHeader : styles.screenHeader]}>{`Probe Session`}</Text>
        <Animatable.Text
          transition={'fontSize'}
          duration={1000}
          style={[scrolling ? styles.smallInstruction : styles.instruction]}
        >{`Please instruct the child to brush their teeth. As they do, please complete this survey for each step.`}</Animatable.Text>
      </View>
      <View style={styles.formContainer}>
        <ColumnLabels />
        {chainMasteryState.chainMastery ? (
          <FlatList
            onScrollBeginDrag={() => {
              setScrolling(true);
              setReadyToSubmit(true);
            }}
            data={chainMasteryState.chainMastery.draftSession.step_attempts}
            renderItem={item => {
              return chainMasteryState.chainMastery ? (
                <DataVerifItem stepAttempt={item.item} chainSteps={chainMasteryState.chainMastery.chainSteps} />
              ) : (
                <Loading />
              );
            }}
            keyExtractor={randomId}
          />
        ) : (
          <View>
            <ActivityIndicator animating={true} color={CustomColors.uva.mountain} />
          </View>
        )}
      </View>

      {readyToSubmit && (
        <View style={styles.btnContainer}>
          <Text style={styles.btnContainerText}>{`Please confirm your selections, then press Submit.`}</Text>
          <Button
            mode={'contained'}
            color={CustomColors.uva.orange}
            labelStyle={{
              fontSize: 28,
              //   fontWeight: '600',
              color: CustomColors.uva.white,
              paddingVertical: 15,
            }}
            style={styles.nextButton}
            onPress={() => {
              if (confirmSubmit) {
                submitAndNavigate();
              } else {
                setConfirmSubmit(true);
              }
            }}
          >
            {confirmSubmit ? 'Confirm and Submit' : 'Confirm and Submit'}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 100,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  instructionContainer: {
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  smallinstructionContainer: {
    margin: 20,
    marginBottom: 1,
    marginTop: 1,
    fontSize: 16,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  screenHeader: {
    marginTop: 20,
    paddingBottom: 20,
    fontSize: 22,
    fontWeight: '600',
  },
  smallHeader: {
    display: 'none',
  },

  instruction: {
    padding: 40,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 22,
  },
  smallInstruction: {
    padding: 20,
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 18,
  },
  formContainer: {
    height: '80%',
  },
  formItemContainer: {},
  formItemLabel: {},
  btnContainer: {},
  formItemButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 100,
    marginRight: 20,
    marginTop: 100,
  },
  btnContainerText: {
    display: 'none',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
  },
  nextButton: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default DataVerificationScreen;

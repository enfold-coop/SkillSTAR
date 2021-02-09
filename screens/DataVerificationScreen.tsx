import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-paper';
import { randomId } from '../_util/RandomId';
import { DataVerifItem } from '../components/DataVerification';
import ColumnLabels from '../components/DataVerification/ColumnLabels';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { useChainMasteryContext } from '../context/ChainMasteryProvider';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSessionTypeLabels, ChainSessionTypeMap } from '../types/chain/ChainSession';

const DataVerificationScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionTypeLabel, setSessionTypeLabel] = useState<ChainSessionTypeLabels>();
  const [chainMasteryState, chainMasteryDispatch] = useChainMasteryContext();

  useEffect(() => {
    if (chainMasteryState.chainMastery) {
      const sessionType = chainMasteryState.chainMastery.draftSession.session_type;
      setSessionTypeLabel(ChainSessionTypeMap[sessionType as string].value as ChainSessionTypeLabels);
    }
  }, []);

  // Post state data to API
  const postData = async () => {
    console.log('POSTING DATA');
    if (chainMasteryState.chainMastery) {
      setIsSubmitted(true);
      const draftSession = chainMasteryState.chainMastery.draftSession;
      const chainData = chainMasteryState.chainMastery.chainData;
      draftSession.completed = true;
      chainData.sessions.push(draftSession);
      const dbChainData = await ApiService.upsertChainData(chainData);

      if (dbChainData) {
        chainMasteryState.chainMastery.updateChainData(dbChainData);
        chainMasteryDispatch({ type: 'chainMastery', payload: chainMasteryState.chainMastery });
        navigation.navigate('ChainsHomeScreen', {});
      }
    }
  };

  return chainMasteryState.chainMastery ? (
    <View style={styles.container}>
      <AppHeader name={'Brushing Teeth'} />
      <View style={styles.instructionContainer}>
        <Text style={[scrolling ? styles.smallHeader : styles.screenHeader]}>{`${sessionTypeLabel} Session`}</Text>
        <Text
          style={[scrolling ? styles.smallInstruction : styles.smallInstruction]}
        >{`Please review the following data.  If you see something that is incorrect, you may change by selecting an alternative option.`}</Text>
      </View>
      <View style={styles.formContainer}>
        <ColumnLabels />
        {chainMasteryState.chainMastery ? (
          <FlatList
            // onScrollBeginDrag={() => {
            //   setScrolling(true);
            // }}
            data={chainMasteryState.chainMastery.draftSession.step_attempts}
            renderItem={(item) => {
              return <DataVerifItem chainStepId={item.item.chain_step_id} />;
            }}
            keyExtractor={randomId}
            maxToRenderPerBatch={chainMasteryState.chainMastery.chainSteps.length}
          />
        ) : (
          <Loading />
        )}
      </View>

      <View style={styles.btnContainer}>
        <Text style={styles.btnContainerText}>{`Please confirm your selections, then press Submit.`}</Text>
        <Button
          mode={'contained'}
          color={CustomColors.uva.orange}
          labelStyle={{
            fontSize: 24,
            color: CustomColors.uva.white,
            paddingVertical: 5,
          }}
          style={styles.nextButton}
          onPress={postData}
        >
          {!isSubmitted ? 'Confirm and Submit' : 'Thanks'}
        </Button>
      </View>
    </View>
  ) : (
    <Loading />
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
  btnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formItemButton: {},
  nextBackBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 100,
    marginRight: 20,
    marginTop: 100,
  },
  btnContainerText: {
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

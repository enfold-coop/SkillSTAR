import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sessionTypeLabel, setSessionTypeLabel] = useState<ChainSessionTypeLabels>();
  const [chainMasteryState, chainMasteryDispatch] = useChainMasteryContext();

  useEffect(() => {
    if (chainMasteryState.chainMastery) {
      const sessionType = chainMasteryState.chainMastery.draftSession.session_type;
      //   console.log(chainMasteryState.chainMastery.draftSession);
      setSessionTypeLabel(ChainSessionTypeMap[sessionType as string].value as ChainSessionTypeLabels);
    }
  }, [chainMasteryState.chainMastery]);

  // Post state data to API
  const postData = async () => {
    console.log('POSTING DATA');
    if (chainMasteryState.chainMastery) {
      setIsSubmitted(true);
      chainMasteryState.chainMastery.draftSession.completed = true;
      chainMasteryState.chainMastery.saveDraftSession();
      const dbChainData = await ApiService.upsertChainData(chainMasteryState.chainMastery.chainData);

      if (dbChainData) {
        chainMasteryState.chainMastery.updateChainData(dbChainData);
        chainMasteryDispatch({ type: 'chainMastery', payload: chainMasteryState.chainMastery });
        navigation.navigate('ChainsHomeScreen', {});
      }
    }
  };

  const getDraftStepData = (id: number) => {
    return chainMasteryState.chainMastery?.getDraftSessionStep(id);
  };

  return chainMasteryState.chainMastery ? (
    <View style={styles.container}>
      <AppHeader name={'Brushing Teeth'} />
      <View style={styles.instructionContainer}>
        <Text style={[styles.smallHeader]}>{`${sessionTypeLabel} Session`}</Text>
        <Text
          style={[styles.smallInstruction]}
        >{`Please review the following data.  If you see something that is incorrect, you may change by selecting an alternative option.`}</Text>
      </View>
      <View style={styles.formContainer}>
        <ColumnLabels />
        {chainMasteryState.chainMastery ? (
          <FlatList
            data={chainMasteryState.chainMastery.draftSession.step_attempts}
            renderItem={(item) => {
              return <DataVerifItem chainStepId={item.item.chain_step_id} />;
            }}
            keyExtractor={(item) => item.chain_step_id.toString()}
            maxToRenderPerBatch={chainMasteryState.chainMastery.chainSteps.length}
          />
        ) : (
          <Loading />
        )}
      </View>

      <View style={styles.btnContainer}>
        <Text style={styles.btnContainerText}>{`Please confirm your selections, then press Submit.`}</Text>
        {!isSubmitted ? (
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
            {'Confirm and Submit'}
          </Button>
        ) : (
          <Button
            mode={'contained'}
            color={CustomColors.uva.gray}
            labelStyle={{
              fontSize: 24,
              color: CustomColors.uva.white,
              paddingVertical: 5,
            }}
            style={styles.nextButton}
            onPress={() => {
              console.log('Data Submitted');
            }}
          >
            {'Thanks'}
          </Button>
        )}
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

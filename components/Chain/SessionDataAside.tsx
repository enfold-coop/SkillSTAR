import date from 'date-and-time';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { ChainSessionType } from '../../types/chain/ChainSession';
import ChainMasteryGraph from '../DataGraph/ChainMasteryGraph';
import GraphModal from '../DataGraph/GraphModal';
import { Loading } from '../Loading/Loading';
import ProbeAside from './ProbeAside';
import TrainingAside from './TrainingAside';

/**
 * NEEDS:
 * ** Session type: Probe or Training,
 * ** today's FOCUS STEP (instructions, stepnumber)
 * ** today's PROMPT LEVEL
 * **
 */

const SessionDataAside = (): JSX.Element => {
  // eslint-disable-next-line react/prop-types
  const [modalVis, setModalVis] = useState(false);
  const chainMasteryState = useChainMasteryState();

  const handleModal = () => {
    setModalVis(!modalVis);
  };

  return chainMasteryState.chainMastery &&
    chainMasteryState.chainMastery.draftSession &&
    chainMasteryState.chainMastery.draftSession.date ? (
    <View style={styles.container}>
      <GraphModal visible={modalVis} handleVis={handleModal} />
      <View>
        <View>
          <Card>
            <View style={styles.sessionNumbAndDateContainer}>
              <Text style={styles.sessionNum}>{`Session #${
                chainMasteryState.chainMastery.chainData.sessions.length + 1
              }`}</Text>
              <Text style={styles.date}>
                {date.format(chainMasteryState.chainMastery.draftSession.date, 'MM/DD/YYYY')}
              </Text>
            </View>
            <View style={styles.taskInfoContainer}>
              {chainMasteryState.chainMastery.draftSession.session_type === ChainSessionType.training ? (
                <TrainingAside />
              ) : (
                <ProbeAside />
              )}
            </View>
          </Card>
        </View>
        {chainMasteryState.chainMastery.chainData.sessions.length > 0 && (
          <Card style={styles.graphIconContainer}>
            <ChainMasteryGraph width={280} height={420} margin={10} />
            <Button
              onPress={() => {
                setModalVis(true);
              }}
              color={CustomColors.uva.grayDark}
              style={styles.graphModalBtn}
            >
              {`More detail`}
            </Button>
          </Card>
        )}
      </View>
    </View>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 22,
  },
  subContainer: {
    marginTop: 0,
    flexDirection: 'row',
  },
  sessionNumbAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionNum: {
    fontWeight: '600',
    fontSize: 18,
  },
  taskInfoContainer: {
    padding: 10,
  },
  isProbeTrainingSession: {
    fontWeight: '600',
    fontSize: 18,
    padding: 5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: CustomColors.uva.grayMedium,
  },
  upNextContainer: { padding: 10 },
  upNextLabel: {
    fontWeight: '600',
    fontSize: 18,
  },
  focusStep: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  focusStepInstruction: {
    fontWeight: '400',
  },
  promptLevelLabel: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  promptLevel: {
    fontWeight: '400',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  masteryLevelLabel: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  masteryLevel: {
    fontWeight: '400',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  moreDetailsBtn: {
    padding: 1,
    margin: 10,
  },
  graphIconContainer: {
    width: 280,
    height: 480,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  graphModalBtn: {
    fontSize: 18,
    alignSelf: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: CustomColors.uva.grayMedium,
  },
});

export default SessionDataAside;

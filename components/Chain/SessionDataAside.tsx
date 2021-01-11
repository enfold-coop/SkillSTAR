import date from 'date-and-time';
import React, { FC, useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useChainState } from '../../context/ChainProvider';
import CustomColors from '../../styles/Colors';
import GraphModal from '../DataGraph/GraphModal';
import { ChainsHomeGraph } from '../DataGraph/index';
import { ProbeAside, TrainingAside } from './index';

type Props = {
  asideContent: string;
};

/**
 * NEEDS:
 * ** Session type: Probe or Training,
 * ** today's FOCUS STEP (instructions, stepnumber)
 * ** today's PROMPT LEVEL
 * **
 */

const SessionDataAside: FC<Props> = props => {
  const { asideContent } = props;
  const contextState = useChainState();
  const { sessionNumber } = contextState;
  const [isTraining, setIsTraining] = useState(false);
  const [today, setToday] = useState(date.format(new Date(), 'MM/DD/YYYY'));
  const [promptLevel, setPromptLevel] = useState('Full Physical');
  const [masteryLevel, setMasteryLevel] = useState('Focus');
  const [graphContainerDimens, setGraphContainerDimens] = useState<LayoutRectangle>();
  const [modalVis, setModalVis] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled && contextState.sessionType === 'training') {
      setIsTraining(true);
    }

    return () => {
      isCancelled = true;
    };
  }, [contextState]);

  const handleModal = () => {
    setModalVis(!modalVis);
  };

  const setAsideContent = () => {
    if (isTraining) {
      return <TrainingAside />;
    } else {
      return <ProbeAside />;
    }
  };

  return (
    <View style={styles.container}>
      <GraphModal visible={modalVis} handleVis={handleModal} />
      <View>
        <View>
          <Card>
            <View style={styles.sessionNumbAndDateContainer}>
              <Text style={styles.sessionNum}>Session #{(sessionNumber || 0) + 1}</Text>
              <Text style={styles.date}>{today}</Text>
            </View>
            <View style={styles.taskInfoContainer}>{setAsideContent()}</View>
          </Card>
        </View>
        <View
          style={styles.graphIconContainer}
          onLayout={e => {
            const dimensions = e.nativeEvent.layout;
            console.log('dimensions', dimensions);
            setGraphContainerDimens(dimensions);
          }}
        >
          <Card>
            <ChainsHomeGraph dimensions={graphContainerDimens} />
            <TouchableOpacity
              onPress={() => {
                setModalVis(true);
              }}
            >
              <Text style={styles.graphText}>View your progress</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </View>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  graphText: {
    fontSize: 18,
    color: CustomColors.uva.grayDark,
    alignSelf: 'center',
    padding: 5,
  },
});

export default SessionDataAside;

import React, { useEffect, useState } from 'react';
import { LayoutRectangle, Modal, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { ChainData } from '../../types/chain/ChainData';
import { ChainSession } from '../../types/chain/ChainSession';
import PlotlyLineGraph from './PlotlyLineGraph';

interface GraphModalProps {
  visible: boolean;
  handleVis: () => void;
  sessionsData: ChainSession[];
}

const GraphModal = (props: GraphModalProps): JSX.Element => {
  const { visible, handleVis, sessionsData } = props;

  const [graphDimens, setGraphDimens] = useState<LayoutRectangle>();
  const [vis, setVisible] = useState(false);

  const handleIsVis = () => {
    setVisible(!vis);
    return handleVis();
  };

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  return (
    <Modal
      visible={vis}
      animationType={'slide'}
      presentationStyle={'fullScreen'}
      // transparent={true}
    >
      <View
        style={styles.graphContainer}
        onLayout={(e) => {
          setGraphDimens(e.nativeEvent.layout);
        }}
      >
        {graphDimens && graphDimens.height && sessionsData && (
          <PlotlyLineGraph modal={true} dimensions={graphDimens} sessions={sessionsData} />
        )}
        <Button
          style={styles.closeBtn}
          labelStyle={{ fontSize: 16 }}
          color={CustomColors.uva.graySoft}
          mode={'outlined'}
          onPress={() => {
            setVisible(!vis);
            handleIsVis();
          }}
        >{`Close`}</Button>
      </View>
    </Modal>
  );
};

export default GraphModal;

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeBtn: {
    width: 200,
    alignSelf: 'center',
  },
});

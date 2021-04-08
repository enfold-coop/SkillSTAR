import React, { useEffect, useState } from 'react';
import { LayoutRectangle, Modal, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import ChainMasteryGraph from './ChainMasteryGraph';

interface GraphModalProps {
  visible: boolean;
  handleVis: () => void;
}

const GraphModal = (props: GraphModalProps): JSX.Element => {
  const { visible, handleVis } = props;
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
        {graphDimens && graphDimens.height && (
          <ChainMasteryGraph width={graphDimens.width} height={graphDimens.height - 80} margin={16} />
        )}
        <Button
          style={styles.closeBtn}
          labelStyle={{ fontSize: 16 }}
          color={'white'}
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
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  closeBtn: {
    width: 200,
    alignSelf: 'center',
    backgroundColor: CustomColors.uva.grayDark,
  },
});

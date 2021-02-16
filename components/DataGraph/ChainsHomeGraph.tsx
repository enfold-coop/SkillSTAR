import React, { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import CustomColors from '../../styles/Colors';
import { ChainSessionType } from '../../types/chain/ChainSession';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainData } from '../../types/chain/ChainData';

interface ChainsHomeGraphProps {
  dimensions?: LayoutRectangle;
  chainData: ChainData;
}

const ChainsHomeGraph = (props: ChainsHomeGraphProps): JSX.Element => {
  const { dimensions, chainData } = props;
  const [dimens, setDimens] = useState<LayoutRectangle>();

  useEffect(() => {
    if (dimensions && !dimens) {
      setDimens(dimensions);
    }
  }, []);

  const data = [
    {
      x: [],
      y: [],
      mode: 'markers',
      name: 'Probe Session',
      marker: {
        color: 'rgb(164, 194, 244)',
        size: 12,
        line: {
          color: 'white',
          width: 0.5,
        },
      },
    },
    {
      x: [],
      y: [],
      mode: 'lines',
      name: 'Training Session',
    },
    {
      x: [],
      y: [],
      mode: 'lines',
      name: 'Challenging Behavior',
    },
  ];

  const layout = {
    width: dimens ? dimens.width : 270,
    height: dimens ? dimens.width : 190,
    plot_bgcolor: CustomColors.uva.sky,
    margin: {
      r: 0,
      l: 15,
      b: 0,
      t: 10,
      pad: 0,
    },
    showlegend: false,
    xaxis: {
      title: '',
      ticks: '',
      ticktext: '',
      tickformat: '',
      showticklabels: false,
    },
    yaxis: {
      ticks: '',
      ticktext: '',
      title: '',
      tickformat: '',
      showticklabels: false,
    },
  };

  const handleUpdate = () => {
    // TODO
  };

  return (
    <View style={[styles.container]}>
      <Plotly
        update={handleUpdate}
        data={data}
        layout={layout}
        enableFullPlotly={true}
        config={{
          displayModeBar: false,
        }}
      />
    </View>
  );
};

export default ChainsHomeGraph;

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 200,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import CustomColors from '../../styles/Colors';

type Props = {
  dimensions: {};
};

const ChainsHomeGraph: FC<Props> = props => {
  const { dimensions } = props;
  const [dimens, setDimens] = useState({});

  useEffect(() => {
    setDimens(dimensions);
  }, []);

  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 4, 3, 4, 8],
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
      x: [4, 2, 4, 4, 5],
      y: [2, 3, 4, 5, 6],
      mode: 'lines',
      name: 'Training Session',
    },
    {
      x: [4, 2, 4, 4, 5],
      y: [1, 2, 3, 4, 5],
      mode: 'lines',
      name: 'Challenging Behavior',
    },
  ];

  const layout = {
    width: 270,
    height: 190,
    plot_bgcolor: CustomColors.uva.sky,
    margin: {
      r: 0,
      l: 15,
      b: 0,
      t: 10,
      pad: 0,
    },
    showlegend: false,
    xAxis: {
      ticks: '',
      ticktext: '',
    },
    yAxis: {
      ticks: '',
      ticktext: '',
    },
  };

  useEffect(() => {});

  return (
    <View style={[styles.container]}>
      <Plotly
        update={() => {}}
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

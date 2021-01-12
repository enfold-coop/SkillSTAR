import React, { FC, useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import CustomColors from '../../styles/Colors';

type Props = {
  dimensions?: LayoutRectangle;
};

const ChainsHomeGraph: FC<Props> = props => {
  const { dimensions } = props;
  const [dimens, setDimens] = useState<LayoutRectangle>();

  useEffect(() => {
    if (dimensions && !dimens) {
      setDimens(dimensions);
    }
  }, []);

  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 3, 4, 5],
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
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 3, 4, 5],
      mode: 'lines',
      name: 'Training Session',
    },
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 3, 4, 5],
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

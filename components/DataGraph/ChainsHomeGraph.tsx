import React, { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import CustomColors from '../../styles/Colors';
import { ChainSession, ChainSessionType } from '../../types/chain/ChainSession';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainData } from '../../types/chain/ChainData';
import { SetGraphData, HandleGraphPopulation } from '../../_util/CreateGraphData';

interface ChainsHomeGraphProps {
  dimensions?: LayoutRectangle;
  chainData: ChainData;
  sessionData: ChainSession[];
}

const PROBE_NAME = 'Probe Session';
const TRAINING_NAME = 'Training Session';
const CB_NAME = 'Challenging Behavior';

const ChainsHomeGraph = (props: ChainsHomeGraphProps): JSX.Element => {
  const { dimensions, chainData, sessionData } = props;
  const [dimens, setDimens] = useState<LayoutRectangle>();
  const [sessions, setSesionData] = useState<ChainSession[]>([]);
  const [data, setData] = useState([
    {
      x: [],
      y: [],
      mode: 'markers',
      name: PROBE_NAME,
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
      name: TRAINING_NAME,
    },
    {
      x: [],
      y: [],
      mode: 'lines',
      name: CB_NAME,
    },
  ]);

  useEffect(() => {
    if (dimensions && !dimens) {
      setDimens(dimensions);
    }
    if (sessions != undefined) {
      setSesionData(sessionData);
      setGraphData(sessionData);
    }
  }, []);

  const setGraphData = (sessions: ChainSession[]) => {
    const calculatedDataArray = SetGraphData(sessions);
    if (calculatedDataArray) {
      handleGraphPopulation(calculatedDataArray);
    }
  };

  const handleGraphPopulation = (d: []) => {
    const newGraphData = HandleGraphPopulation(data, d);
    setData(newGraphData);
  };

  //   const data = [
  //     {
  //       x: [],
  //       y: [],
  //       mode: 'markers',
  //       name: 'Probe Session',
  //       marker: {
  //         color: 'rgb(164, 194, 244)',
  //         size: 12,
  //         line: {
  //           color: 'white',
  //           width: 0.5,
  //         },
  //       },
  //     },
  //     {
  //       x: [],
  //       y: [],
  //       mode: 'lines',
  //       name: 'Training Session',
  //     },
  //     {
  //       x: [],
  //       y: [],
  //       mode: 'lines',
  //       name: 'Challenging Behavior',
  //     },
  //   ];

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

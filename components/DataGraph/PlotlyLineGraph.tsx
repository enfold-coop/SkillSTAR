import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import { CB_NAME, PROBE_NAME, TRAINING_NAME } from '../../constants/chainshome_text';
import CustomColors from '../../styles/Colors';
import { ChainSession } from '../../types/chain/ChainSession';
import { GraphData, HandleGraphPopulation, SetGraphData } from '../../_util/CreateGraphData';

interface PlotlyGraphDimensions {
  width: number;
  height: number;
}

type PlotlyLineGraphProps = {
  dimensions: PlotlyGraphDimensions;
  modal: boolean;
  sessions: ChainSession[];
};

const PlotlyLineGraph = (props: PlotlyLineGraphProps): JSX.Element => {
  const { dimensions, modal, sessions } = props;
  const [thisHeight, setHeight] = useState<number>();
  const [thisWidth, setWidth] = useState<number>();
  const [isModal, setIsModal] = useState<boolean>(false);

  const [data, setData] = useState<GraphData[]>([
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
    if (sessions !== undefined) {
      setGraphData(sessions);
    }
  }, [isModal]);

  const setGraphData = (sessions: ChainSession[]) => {
    const calculatedDataArray = SetGraphData(sessions);
    if (calculatedDataArray) {
      handleGraphPopulation(calculatedDataArray);
    }
  };

  const handleGraphPopulation = (d: GraphData[]) => {
    const newGraphData = HandleGraphPopulation(data, d);
    setData(newGraphData);
  };

  const layout = {
    title: 'SkillStar',
    height: thisHeight,
    width: thisWidth,
    plot_bgcolor: CustomColors.uva.sky,
    xaxis: {
      title: 'Session Number',
      dtick: 1,
    },
    yaxis: {
      title: '% of steps',
      dtick: 5,
    },
  };

  const setDimensions = () => {
    setHeight(dimensions.height - 100);
    setWidth(dimensions.width - 40);
  };

  useEffect(() => {
    setIsModal(modal);
    setDimensions();
  });

  return (
    <View style={[styles.container]}>
      <Plotly
        update={() => {
          // TODO: needs current data piped in and applied to graph.
        }}
        data={data}
        layout={layout}
        enableFullPlotly={true}
      />
    </View>
  );
};

export default PlotlyLineGraph;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '96%',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

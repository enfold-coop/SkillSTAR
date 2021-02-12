import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import { FilterSessionsByType } from '../../_util/FilterSessionType';
import { ApiService } from '../../services/ApiService';
import CustomColors from '../../styles/Colors';
import { ChainSession } from '../../types/chain/ChainSession';
import { ChainData } from '../../types/chain/ChainData';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { CalcMasteryPercentage, CalcChalBehaviorPercentage } from '../../_util/CalculateMasteryPercentage';

interface PlotlyGraphDimensions {
  width: number;
  height: number;
}

type PlotlyLineGraphProps = {
  dimensions: PlotlyGraphDimensions;
  modal: boolean;
};

const PlotlyLineGraph = (props: PlotlyLineGraphProps): JSX.Element => {
  const { dimensions, modal } = props;
  const [thisHeight, setHeight] = useState<number>();
  const [thisWidth, setWidth] = useState<number>();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [chainData, setChainData] = useState<ChainData>();
  const [trainingGraphData, setTrainingGraphData] = useState<ChainSession[]>();
  const [probeGraphData, setProbeGraphData] = useState<ChainSession[]>();
  const [chalBehavGraphData, setChalBehavGraphData] = useState<ChainSession[]>([]);
  const chainMasteryState = useChainMasteryState();

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        const contextChainData = await ApiService.contextState('chainData');
        if (contextChainData !== undefined) {
          setChainData(contextChainData as ChainData);
        }
        if (chainData && chainData.sessions) {
          setGraphData(chainData.sessions);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  const setGraphData = (sessions: ChainSession[]) => {
    const { probeArr, trainingArr } = FilterSessionsByType(sessions);
    if (trainingArr && trainingArr.length > 0) {
      const tGD = CalcMasteryPercentage(trainingArr);
      setTrainingGraphData(tGD);
    }
    if (probeArr && probeArr.length > 0) {
      const pGD = CalcMasteryPercentage(probeArr);
      setProbeGraphData(pGD);
    }
  };

  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [5, 4, 4, 4, 4],
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
      y: [5, 2, 5, 1, 2],
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
    title: 'SkillStar',
    height: thisHeight,
    width: thisWidth,
    plot_bgcolor: CustomColors.uva.sky,
    xaxis: {
      title: 'Session Number',
    },
    yaxis: {
      title: 'Mastery (%)',
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

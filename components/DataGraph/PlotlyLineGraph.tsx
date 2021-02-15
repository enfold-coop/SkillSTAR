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

const PROBE_NAME = 'Probe Session';
const TRAINING_NAME = 'Training Session';
const CB_NAME = 'Challenging Behavior';

const PlotlyLineGraph = (props: PlotlyLineGraphProps): JSX.Element => {
  const { dimensions, modal } = props;
  const [thisHeight, setHeight] = useState<number>();
  const [thisWidth, setWidth] = useState<number>();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [chainData, setChainData] = useState<ChainData>();
  const [trainingGraphData, setTrainingGraphData] = useState<ChainSession[]>();
  const [probeGraphData, setProbeGraphData] = useState<ChainSession[]>();
  const [chalBehavGraphData, setChalBehavGraphData] = useState<ChainSession[]>([]);
  const [data, setData] = useState([
    {
      x: [0],
      y: [0],
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
      x: [0],
      y: [0],
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
  const chainMasteryState = useChainMasteryState();

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        const contextChainData = await ApiService.contextState('chainData');
        if (contextChainData !== undefined) {
          setChainData(contextChainData as ChainData);
        }
        if (chainMasteryState.chainMastery?.chainData.sessions) {
          setGraphData(chainMasteryState.chainMastery?.chainData.sessions);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [chainMasteryState.chainMastery?.chainData.sessions]);

  const setGraphData = (sessions: ChainSession[]) => {
    if (sessions) {
      const cBD = CalcChalBehaviorPercentage(sessions);
      handleGraphPopulation(cBD);
    }

    const { probeArr, trainingArr } = FilterSessionsByType(sessions);
    if (trainingArr && trainingArr.length > 0) {
      const tGD = CalcMasteryPercentage(trainingArr);
      setTrainingGraphData(tGD);
      handleGraphPopulation(tGD);
    }
    if (probeArr && probeArr.length > 0) {
      const pGD = CalcMasteryPercentage(probeArr);
      setProbeGraphData(pGD);
      handleGraphPopulation(pGD);
    }
  };

  const handleGraphPopulation = (d: []) => {
    data.find((e) => {
      if (e.name === PROBE_NAME) {
        d.forEach((f) => {
          data[0].y.push(f['mastery']);
          data[0].x.push(f['session_number']);
        });
      } else if (e.name === TRAINING_NAME) {
        d.forEach((f) => {
          data[1].y.push(f['mastery']);
          data[1].x.push(f['session_number']);
        });
      } else if (e.name === CB_NAME) {
        d.forEach((f) => {
          data[2].y.push(f['challenging_behavior']);
          data[2].x.push(f['session_number']);
        });
      }
    });
  };

  //   const data = [
  //     {
  //       x: [],
  //       y: [],
  //       mode: 'markers',
  //       name: PROBE_NAME,
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
  //       name: TRAINING_NAME,
  //     },
  //     {
  //       x: [],
  //       y: [],
  //       mode: 'lines',
  //       name: CB_NAME,
  //     },
  //   ];

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

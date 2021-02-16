import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import { FilterSessionsByType, FilteredSessionWithSessionIndex } from '../../_util/FilterSessionType';
import { ApiService } from '../../services/ApiService';
import CustomColors from '../../styles/Colors';
import { ChainSession } from '../../types/chain/ChainSession';
import { ChainData } from '../../types/chain/ChainData';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { CalcMasteryPercentage, CalcChalBehaviorPercentage } from '../../_util/CalculateMasteryPercentage';
import { loadPartialConfig } from '@babel/core';

interface PlotlyGraphDimensions {
  width: number;
  height: number;
}

type PlotlyLineGraphProps = {
  dimensions: PlotlyGraphDimensions;
  modal: boolean;
  sessions: ChainSession[];
};

const PROBE_NAME = 'Probe Session';
const TRAINING_NAME = 'Training Session';
const CB_NAME = 'Challenging Behavior';

const PlotlyLineGraph = (props: PlotlyLineGraphProps): JSX.Element => {
  const { dimensions, modal, sessions } = props;
  const [thisHeight, setHeight] = useState<number>();
  const [thisWidth, setWidth] = useState<number>();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [chainData, setChainData] = useState<ChainData>();
  const [trainingGraphData, setTrainingGraphData] = useState<ChainSession[]>();
  const [probeGraphData, setProbeGraphData] = useState<ChainSession[]>();
  const [chalBehavGraphData, setChalBehavGraphData] = useState<ChainSession[]>([]);
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
  const chainMasteryState = useChainMasteryState();

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        const contextChainData = await ApiService.contextState('chainData');
        if (sessions !== undefined) {
          setGraphData(sessions.sessions);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [sessions]);

  const setGraphData = (sessions: ChainSession[]) => {
    const temp = [];
    if (sessions != undefined) {
      const calculatedChalBehavPerc = CalcChalBehaviorPercentage(sessions);

      if (calculatedChalBehavPerc != undefined) {
        temp.push({ data: calculatedChalBehavPerc, name: CB_NAME });
      }

      const { probeArr, trainingArr } = FilteredSessionWithSessionIndex(sessions);

      if (probeArr && probeArr.length > 0) {
        const calculatedProbeMasteryPerc = CalcMasteryPercentage(probeArr);
        if (calculatedProbeMasteryPerc != undefined) {
          temp.push({ data: calculatedProbeMasteryPerc, name: PROBE_NAME });
        }
      }
      if (trainingArr && trainingArr.length > 0) {
        const calculatedTrainingMasteryPerc = CalcMasteryPercentage(trainingArr);
        if (calculatedTrainingMasteryPerc != undefined) {
          temp.push({ data: calculatedTrainingMasteryPerc, name: TRAINING_NAME });
        }
      }

      if (temp.length > 0) {
        handleGraphPopulation(temp);
      }
    }
  };

  const handleGraphPopulation = (d: []) => {
    const tempData = data.slice();

    d.forEach((e) => {
      if (e && e.name) {
        const dE = tempData.find((f) => f.name === e.name);
        if (dE && e.data) {
          const keys = Object.keys(e.data[0]);
          dE.x.splice(0, dE.x.length);
          dE.y.splice(0, dE.y.length);
          e.data.forEach((dataObj, i) => {
            dE.x[i] = dataObj[keys[0]];
            dE.y[i] = dataObj[keys[1]];
          });
        }
      }
    });

    setGraphData(tempData);
  };

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

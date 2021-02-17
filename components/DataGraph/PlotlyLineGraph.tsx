import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Plotly from 'react-native-plotly';
import { FilteredSessionWithSessionIndex } from '../../_util/FilterSessionType';
import CustomColors from '../../styles/Colors';
import { ChainSession } from '../../types/chain/ChainSession';
import { CalcMasteryPercentage, CalcChalBehaviorPercentage } from '../../_util/CalculateMasteryPercentage';
import { HandleGraphPopulation, SetGraphData } from '../../_util/CreateGraphData';

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
    if (sessions !== undefined) {
      setGraphData(sessions);
    }
  }, [isModal]);

  //   const setGraphData = (sessions: ChainSession[]) => {
  //     const temp = [];
  //     if (sessions != undefined) {
  //       const calculatedChalBehavPerc = CalcChalBehaviorPercentage(sessions);

  //       if (calculatedChalBehavPerc != undefined) {
  //         temp.push({ data: calculatedChalBehavPerc, name: CB_NAME });
  //       }

  //       const { probeArr, trainingArr } = FilteredSessionWithSessionIndex(sessions);

  //       if (probeArr && probeArr.length > 0) {
  //         const calculatedProbeMasteryPerc = CalcMasteryPercentage(probeArr);
  //         if (calculatedProbeMasteryPerc != undefined) {
  //           temp.push({ data: calculatedProbeMasteryPerc, name: PROBE_NAME });
  //         }
  //       }
  //       if (trainingArr && trainingArr.length > 0) {
  //         const calculatedTrainingMasteryPerc = CalcMasteryPercentage(trainingArr);
  //         if (calculatedTrainingMasteryPerc != undefined) {
  //           temp.push({ data: calculatedTrainingMasteryPerc, name: TRAINING_NAME });
  //         }
  //       }
  //       handleGraphPopulation(temp);
  //     }
  //   };

  const setGraphData = (sessions: ChainSession[]) => {
    let calculatedDataArray = SetGraphData(sessions);
    console.log(calculatedDataArray);
  };

  const handleGraphPopulation = (d: []) => {
    const newGraphData = HandleGraphPopulation(data, d);
    console.log('setting new graph data');
    setData(newGraphData);
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

import { ChainSession } from '../types/chain/ChainSession';
import { CalcChalBehaviorPercentage, CalcMasteryPercentage } from './CalculateMasteryPercentage';
import { FilteredSessionWithSessionIndex } from './FilterSessionType';

const PROBE_NAME = 'Probe Session';
const TRAINING_NAME = 'Training Session';
const CB_NAME = 'Challenging Behavior';

/**
 * Returns array with computed mastery and CB percentages;
 * @param sessions : array of ChainSessions to be provides to mastery calculations
 */
export const SetGraphData = (sessions: ChainSession[]) => {
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
  }
  return temp;
};

/**
 *
 * @param currGraphData: data that is already present in graph's "data" state property
 * @param incomingData: data that includes new calculated mastery and challenging behavior percentages
 *  -- Combines new data into the Plotly "data" array
 */
export const HandleGraphPopulation = (currGraphData: [], incomingData: []) => {
  const tempData = currGraphData.slice();
  if (incomingData) {
    incomingData.forEach((e) => {
      if (e && e.name && e.data.length > 0) {
        const dE = tempData.find((f) => f.name === e.name);
        const keys = Object.keys(e.data[0]);
        if (keys != undefined) {
          dE.x.splice(0, dE.x.length);
          dE.y.splice(0, dE.y.length);
          e.data.forEach((dataObj, i) => {
            dE.x[i] = dataObj[keys[0]];
            dE.y[i] = dataObj[keys[1]];
          });
        }
      }
    });
  }
  return tempData;
};

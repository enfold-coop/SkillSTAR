import { CB_NAME, PROBE_NAME, TRAINING_NAME } from '../constants/chainshome_text';
import CustomColors from '../styles/Colors';
import { ChainSession } from '../types/chain/ChainSession';
import {
  calculatePercentChallengingBehavior,
  calculatePercentMastery,
  SessionPercentage,
} from './CalculateMasteryPercentage';
import { FilteredSessionWithSessionIndex } from './FilterSessionType';

export interface GraphData {
  data: SessionPercentage[];
  name: string;
  x: string;
  y: string;
  color: string;
  type: string;
}

/**
 * Returns array with computed mastery and CB percentages;
 * @param sessions : array of ChainSessions to be provides to mastery calculations
 */
export const SetGraphData = (sessions: ChainSession[]): GraphData[] => {
  const temp: GraphData[] = [];

  if (sessions && sessions.length > 0) {
    const { probeArr, trainingArr } = FilteredSessionWithSessionIndex(sessions);

    if (probeArr && probeArr.length > 0) {
      const calculatedProbeMasteryPerc = calculatePercentMastery(probeArr);

      if (calculatedProbeMasteryPerc !== undefined) {
        temp.push({
          data: calculatedProbeMasteryPerc,
          name: PROBE_NAME,
          x: 'session_number',
          y: 'mastery',
          color: CustomColors.uva.mountain,
          type: 'scatter',
        });
      }
    }

    if (trainingArr && trainingArr.length > 0) {
      const calculatedTrainingMasteryPerc = calculatePercentMastery(trainingArr);

      if (calculatedTrainingMasteryPerc !== undefined) {
        temp.push({
          data: calculatedTrainingMasteryPerc,
          name: TRAINING_NAME,
          x: 'session_number',
          y: 'mastery',
          color: CustomColors.uva.blue,
          type: 'line',
        });
      }
    }

    const calculatedChalBehavPerc = calculatePercentChallengingBehavior(sessions);

    if (calculatedChalBehavPerc !== undefined) {
      temp.push({
        data: calculatedChalBehavPerc,
        name: CB_NAME,
        x: 'session_number',
        y: 'challenging_behavior',
        color: CustomColors.uva.orange,
        type: 'line',
      });
    }
  }

  return temp;
};

/**
 *
 * @param currGraphData: data that is already present in graph's "data" state property
 * @param incomingData: data that includes new calculated mastery and challenging behavior percentages
 *  -- Combines new data into the GraphData "data" array
 */
export const HandleGraphPopulation = (currGraphData: GraphData[], incomingData: GraphData[]): GraphData[] => {
  // Clone the current graph data
  const tempData = currGraphData.slice();

  if (incomingData) {
    incomingData.forEach((incoming) => {
      if (incoming && incoming.name && incoming.data && incoming.data.length > 0) {
        // Find data with matching name
        const j = tempData.findIndex((current) => current.name === incoming.name);

        // Get the attribute names in the current data
        if (j !== -1 && incoming.data) {
          // Clear out the current graph data
          tempData[j].data.splice(0, tempData[j].data.length);

          // Replace it with incoming data
          incoming.data.forEach((sessionPercentage: SessionPercentage, i: number) => {
            tempData[j].data[i] = { session_number: sessionPercentage.session_number };

            if (sessionPercentage.mastery !== undefined) {
              tempData[j].data[i].mastery = sessionPercentage.mastery;
            } else if (sessionPercentage.challenging_behavior !== undefined) {
              tempData[j].data[i].challenging_behavior = sessionPercentage.challenging_behavior;
            }
          });
        }
      }
    });
  }

  return tempData;
};

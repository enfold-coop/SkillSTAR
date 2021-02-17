/**
 *
 * @param currGraphData: data that is already present in graph's "data" state property
 * @param incomingData: data that includes new calculated mastery and challenging behavior percentages
 *  -- Combines new data into the Plotly "data" array
 */
export const HandleGraphPopulation = (currGraphData: [], incomingData: []) => {
  const tempData = currGraphData.slice();
  incomingData.forEach((e) => {
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
  return tempData;
};

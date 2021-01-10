import session_data from './sketch_of_all_data.json';

let session = {
  date: '',
  sessionType: '',
  completed: false,
  stepAttempts: [
    {
      date: '',
      stepId: 0,
      stepStatus: 'not_complete',
      instruction: '',
      completed: false,
      wasPrompted: false,
      promptLevel: 0,
      challengingBehavior: {
        didOccur: false,
        severity: 0,
      },
    },
  ],
};

const initState = () => {
  let stringedUp = JSON.stringify(session_data);
  let data = JSON.parse(stringedUp);
  return data;
};
export { initState, session };

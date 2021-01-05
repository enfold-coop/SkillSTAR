import React, {useReducer} from "react";
import {ChainQuestionnaire} from '../types/CHAIN/ChainQuestionnaire';
import {ChainSession, ChainSessionType} from '../types/CHAIN/ChainSession';
import {ADD_CURR_SESSION_NMBR, ADD_SESSION, ADD_SESSION_TYPE, ADD_USER_DATA,} from "./constants/actions";

type ChainProviderProps = {
  dispatch?: any;
  sessionType: string;
  session?: ChainSession;
  userData?: ChainQuestionnaire;
  currSessionNmbr: number;
  state?: any;
};

const initialState: ChainProviderProps = {
  sessionType: ChainSessionType.probe,
  currSessionNmbr: 0,
};

const store = React.createContext<ChainProviderProps>(initialState);

const {Provider} = store;

const ChainProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case ADD_SESSION_TYPE:
        return {...state, sessionType: action.payload};
      case ADD_SESSION:
        return {...state, session: action.payload};
      case ADD_USER_DATA:
        return {...state, userData: action.payload};
      case ADD_CURR_SESSION_NMBR:
        return {...state, currSessionNmbr: action.payload};
      default:
        throw new Error();
    }
  }, []);

  return <Provider value={{state, dispatch}}>{children}</Provider>;
};

export {store, ChainProvider};
/**
 * - initialize Session Context Provider
 * - setting/getting state in Context API
 *
 */

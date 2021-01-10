import react, { FC } from 'react';
import { ApiService } from '../../services/ApiService';
import {
  SESSION_DATA_ERROR,
  SESSION_DATA_LOADING,
  SESSION_DATA_SUCCESS,
} from '../../constants/action_types';

export default () => dispatch => {
  dispatch({
    type: SESSION_DATA_LOADING,
  });
};

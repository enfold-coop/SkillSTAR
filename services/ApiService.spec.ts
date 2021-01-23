import AsyncStorage from '@react-native-async-storage/async-storage';
import fetch from 'jest-fetch-mock';
import { mockChainQuestionnaire } from '../_util/testing/mockChainQuestionnaire';
import { mockChainSteps } from '../_util/testing/mockChainSteps';
import { mockUser, mockUserToken } from '../_util/testing/mockUser';
import { wait } from '../_util/testing/wait';
import { ApiService } from './ApiService';

describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  afterEach(async () => {
    await wait();
  });

  it('should get Chain Data for the Selected Participant', async () => {
    // Returns undefined when no chain data is available in AsyncStorage.
    const result = await ApiService.getChainDataForSelectedParticipant();
    expect(result).toEqual(undefined);

    // TODO: Mock offline mode.
    //  Add user, selected participant, and chain data to AsyncStorage mock.
    //  Should return chain data from AsyncStorage mock.

    await AsyncStorage.setItem('selected_participant_questionnaire_id', JSON.stringify(mockChainQuestionnaire.id));
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('user_token', JSON.stringify(mockUserToken));

    expect(AsyncStorage.getItem).toBeCalledWith('selected_participant_questionnaire_id');
    expect(AsyncStorage.getItem).toBeCalledWith('user');
    expect(AsyncStorage.getItem).toBeCalledWith('user_token');

    // TODO: Mock online mode.
    //  Add user, selected participant, and chain data to AsyncStorage mock.
    //  Mock fetch requests for user, participant, and chain data calls.
    //  Should return chain data from fetch mock, not AsyncStorage mock.
  });

  it('should get the list of Chain Steps', async () => {
    await AsyncStorage.setItem('user_token', JSON.stringify(mockUserToken));
    const stringified = JSON.stringify(mockChainSteps);
    const parsed = JSON.parse(stringified);
    fetch.mockResponseOnce(stringified);
    const result = await ApiService.getChainSteps();
    expect(AsyncStorage.getItem).toBeCalledWith('user_token');
    expect(result).toEqual(parsed);
  });

  it('should get the Chain Questionnaire ID', async () => {
    await AsyncStorage.setItem('selected_participant_questionnaire_id', JSON.stringify(mockChainQuestionnaire.id));
    const result = await ApiService.getChainQuestionnaireId();
    expect(AsyncStorage.getItem).toBeCalledWith('selected_participant_questionnaire_id');
    expect(result).toEqual(mockChainQuestionnaire.id);
  });

  it('should delete Chain Data', async () => {
    await AsyncStorage.setItem('user_token', JSON.stringify(mockUserToken));
    const stringified = JSON.stringify(mockChainQuestionnaire);
    const parsed = JSON.parse(stringified);
    fetch.mockResponseOnce(stringified);
    const result = await ApiService.deleteChainData(mockChainQuestionnaire, mockChainQuestionnaire.participant_id);
    expect(AsyncStorage.getItem).toBeCalledWith('user_token');
    expect(result).toEqual(parsed);
  });

  it('should  check if device is connected to the internet', async () => {
    // _isConnected
    const result = await ApiService._isConnected();
    expect(result).toEqual(true);
  });
});

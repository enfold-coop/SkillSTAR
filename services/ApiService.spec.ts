import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import fetch from 'jest-fetch-mock';
import {mockChainQuestionnaire} from '../_util/testing/mockChainQuestionnaire';
import {mockUser, mockUserToken} from '../_util/testing/mockUser';
import {wait} from '../_util/testing/wait';
import {ChainStep} from '../types/CHAIN/ChainStep';
import {ApiService} from './ApiService';


describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });


  afterEach(async () => {
    await wait();
  })

  it('should get Chain Data for the Selected Participant', async () => {
    // Returns undefined when no chain data is available in AsyncStorage.
    const apiService = new ApiService();
    const result = await apiService.getChainDataForSelectedParticipant();
    expect(result).toEqual(undefined);

    // TODO: Mock offline mode.
    //  Add user, selected participant, and chain data to AsyncStorage mock.
    //  Should return chain data from AsyncStorage mock.

    AsyncStorage.setItem('selected_participant_questionnaire_id', JSON.stringify(mockChainQuestionnaire.id));
    AsyncStorage.setItem('user', JSON.stringify(mockUser));
    AsyncStorage.setItem('user_token', JSON.stringify(mockUserToken));

    expect(AsyncStorage.getItem).toBeCalledWith('selected_participant_questionnaire_id');
    expect(AsyncStorage.getItem).toBeCalledWith('user');
    expect(AsyncStorage.getItem).toBeCalledWith('user_token');

    // TODO: Mock online mode.
    //  Add user, selected participant, and chain data to AsyncStorage mock.
    //  Mock fetch requests for user, participant, and chain data calls.
    //  Should return chain data from fetch mock, not AsyncStorage mock.
  });

  it('should get the list of Chain Steps', async () => {
    // getChainSteps
    const mockChainSteps: ChainStep[] = [
      {
        id: 0,
        name: "toothbrushing_01",
        instruction: "Put toothpaste on your toothbrush",
        last_updated: new Date(),
      },
      {
        id: 1,
        name: "toothbrushing_02",
        instruction: "Put toothpaste away",
        last_updated: new Date(),
      },
      {
        id: 2,
        name: "toothbrushing_03",
        instruction: "Get toothpaste and toothbrush wet",
        last_updated: new Date(),
      },
    ]

    const stringified = JSON.stringify(mockChainSteps);
    const parsed = JSON.parse(stringified);
    fetch.mockResponseOnce(stringified);
    const apiService = new ApiService();
    const result = await apiService.getChainSteps();
    expect(result).toEqual(parsed);
  });

  it('should get the Chain Questionnaire ID', async () => {
    // getChainQuestionnaireId
    const apiService = new ApiService();
    const result = await apiService.getChainQuestionnaireId();
    expect(result).toEqual(true);
  });

  it('should get the Chain Data for a given Chain Questionnaire ID', async () => {
    // getChainData
    const apiService = new ApiService();
    const result = await apiService.getChainData(0);
    expect(result).toEqual(true);
  });

  it('should add new Chain Data or edit existing Chain Data', async () => {
    // upsertChainData
    const apiService = new ApiService();
    const result = await apiService.upsertChainData({participant_id: 0, sessions: []});
    expect(result).toEqual(undefined);
  });

  it('should add new Chain Data', async () => {
    // addChainData
    const apiService = new ApiService();
    const result = await apiService.addChainData({participant_id: 0, sessions: []});
    expect(result).toEqual(undefined);
  });

  it('should edit existing Chain Data', async () => {
    // editChainData
    const apiService = new ApiService();
    const result = await apiService.editChainData({participant_id: 0, sessions: []}, 0);
    expect(result).toEqual(undefined);
  });

  it('should delete Chain Data', async () => {
    // deleteChainData
    const apiService = new ApiService();
    const result = await apiService.deleteChainData();
    expect(result).toEqual(true);
  });

  it('should getUser', async () => {
    // getUser
    const apiService = new ApiService();
    const result = await apiService.getUser();
    expect(result).toEqual(true);
  });

  it('should refreshSession', async () => {
    // refreshSession
    const apiService = new ApiService();
    const result = await apiService.refreshSession();
    expect(result).toEqual(true);
  });

  it('should selectParticipant', async () => {
    // selectParticipant
    const apiService = new ApiService();
    const result = await apiService.selectParticipant();
    expect(result).toEqual(true);
  });

  it('should getSelectedParticipant', async () => {
    // getSelectedParticipant
    const apiService = new ApiService();
    const result = await apiService.getSelectedParticipant();
    expect(result).toEqual(true);
  });

  it('should login', async () => {
    // login
    const apiService = new ApiService();
    const result = await apiService.login();
    expect(result).toEqual(true);
  });

  it('should logout', async () => {
    // logout
    const apiService = new ApiService();
    const result = await apiService.logout();
    expect(result).toEqual(true);
  });

  it('should _getHeaders', async () => {
    // _getHeaders
    const apiService = new ApiService();
    const result = await apiService._getHeaders();
    expect(result).toEqual(true);
  });

  it('should _isConnected', async () => {
    // _isConnected
    const apiService = new ApiService();
    const result = await apiService._isConnected();
    expect(result).toEqual(true);
  });


});

import React from 'react';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { parse, stringify } from 'telejson';
import { ChainSession } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo } from '../types/chain/MasteryLevel';
import { ChainData, SkillstarChain } from '../types/chain/SkillstarChain';
import { StarDriveFlow } from '../types/chain/StarDriveFlow';
import { ContextDispatchAction, ContextStateValue } from '../types/Context';
import { Participant, User } from '../types/User';

export class ApiService {
  private static endpoints = {
    login: `${API_URL}/login_password`,
    resetPassword: `${API_URL}/reset_password`,
    refreshSession: `${API_URL}/session`,
    chainsForParticipant: `${API_URL}/flow/skillstar/<participant_id>`,
    chain: `${API_URL}/flow/skillstar/chain_questionnaire`,
    chainSession: `${API_URL}/q/chain_questionnaire/<questionnaire_id>`,
    chainSteps: `${API_URL}/chain_step`,
  };

  static async load<T>(
    actionType: string,
    apiMethod: () => Promise<T | undefined>,
    callback: React.Dispatch<React.SetStateAction<T | undefined>>,
    isCancelled: boolean,
  ): Promise<void> {
    const contextValue = await ApiService.contextState(actionType);
    if (!isCancelled && contextValue) {
      callback(contextValue as T);
    } else {
      const dbValue = await apiMethod();
      if (!isCancelled && dbValue) {
        callback(dbValue as T);
      }
    }
  }

  // Asynchronous replacement for Context API dispatch. Serializes the given value in AsyncStorage
  // as a JSON string.
  static async contextDispatch(action: ContextDispatchAction): Promise<void> {
    await ApiService._cache('__context__' + action.type, action.payload);
  }

  // Asynchronous replacement for Context API state. Deserializes the given key from AsyncStorage,
  // parses the cached JSON string value and returns it.
  static async contextState(key: string): Promise<ContextStateValue | void> {
    const value = await ApiService._getCached('__context__' + key);

    if (value === undefined) {
      return undefined;
    }

    switch (key) {
      case 'chainSteps':
        return value as ChainStep[];
      case 'sessionType':
        return value as string;
      case 'session':
        return value as ChainSession;
      case 'userData':
        return value as SkillstarChain;
      case 'sessionNumber':
        return value as number;
      case 'user':
        return value as User;
      case 'participant':
        return value as Participant;
      case 'chainData':
        return new ChainData(value);
      case 'masteryInfo':
        return value as MasteryInfo;
      default:
        throw new Error(`Unhandled context key: ${key}`);
    }
  }

  static async getChainDataForSelectedParticipant(): Promise<ChainData | undefined> {
    console.log('*** ApiService.getChainDataForSelectedParticipant ***');
    const questionnaireId = await ApiService.getChainQuestionnaireId();

    if (questionnaireId !== undefined) {
      return ApiService.getChainData(questionnaireId);
    }
  }

  static async getChainSteps(): Promise<ChainStep[] | undefined> {
    console.log('*** ApiService.getChainSteps ***');
    // Check if we are online
    const isConnected = ApiService._isConnected();

    if (!isConnected) {
      // Return the locally cached steps, if they are there.
      const cachedStepsJson = await AsyncStorage.getItem('chainSteps');

      if (cachedStepsJson) {
        return parse(cachedStepsJson) as ChainStep[];
      }
    } else {
      // Get the steps from the server.
      const url = ApiService.endpoints.chainSteps;
      try {
        const headers = await ApiService._getHeaders('GET');
        const response = await fetch(url, headers);
        const dbData = await ApiService._parseResponse(response, 'getChainSteps', headers.method);

        // Cache them locally.
        if (dbData) {
          await ApiService._cache('chainSteps', dbData);
          await ApiService.contextDispatch({ type: 'chainSteps', payload: dbData });
          return dbData as ChainStep[];
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  static async getChainQuestionnaireId(): Promise<number | undefined> {
    console.log('*** getChainQuestionnaireId ***');

    // Check for a cached questionnaire ID
    const skillstarChainId = await AsyncStorage.getItem('selected_participant_questionnaire_id');
    // console.log('cached skillstarChainId', skillstarChainId);

    // If it's been cached, just return it.
    if (skillstarChainId !== null) {
      return parseInt(skillstarChainId, 10);
    }

    // No cached questionnaire ID. Get the questionnaire ID from the backend, if connected.
    const isConnected = await ApiService._isConnected();

    // Not connected to the internet. Just return undefined.
    if (!isConnected) {
      return;
    }

    // We're connected to the internet. Get the selected participant and ask the backend for their questionnaire ID.
    const participant = await ApiService.getSelectedParticipant();

    if (participant && participant.hasOwnProperty('id')) {
      const url = ApiService.endpoints.chainsForParticipant.replace('<participant_id>', participant.id.toString());

      try {
        const headers = await ApiService._getHeaders('GET');
        const response = await fetch(url, headers);
        const dbData = (await ApiService._parseResponse(
          response,
          'getChainQuestionnaireId',
          headers.method,
        )) as StarDriveFlow;

        if (
          dbData &&
          typeof dbData === 'object' &&
          dbData.hasOwnProperty('steps') &&
          dbData.steps &&
          dbData.steps.length > 0
        ) {
          const questionnaireId = dbData.steps[0].questionnaire_id;

          if (questionnaireId !== undefined && questionnaireId !== null) {
            await ApiService._cache('selected_participant_questionnaire_id', questionnaireId);
            // console.log('questionnaireId from backend', questionnaireId);
            return questionnaireId;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  static async getChainData(questionnaireId: number): Promise<ChainData | undefined> {
    console.log('*** ApiService.getChainData ***');
    const isConnected = await ApiService._isConnected();

    // If we're not connected to the internet, return any cached questionnaire data.
    if (!isConnected) {
      const cachedDataJson = await AsyncStorage.getItem('chain_data_' + questionnaireId);

      console.log('cachedDataJson', cachedDataJson);

      if (cachedDataJson) {
        const cachedData = new ChainData(parse(cachedDataJson) as SkillstarChain);
        await ApiService.contextDispatch({ type: 'chainData', payload: cachedData });
        return new ChainData(cachedData);
      } else {
        // Nothing cached. Return undefined.
        return;
      }
    }

    // We're connected to the internet. Get the latest from the backend.
    try {
      const url = ApiService.endpoints.chainSession.replace('<questionnaire_id>', questionnaireId.toString());

      //   console.log('url', url);

      const headers = await ApiService._getHeaders('GET');
      const response = await fetch(url, headers);
      const dbData = await ApiService._parseResponse(response, 'getChainData', headers.method);

      if (dbData && dbData.hasOwnProperty('id')) {
        // Cache the latest data
        await ApiService._cache('chain_data_' + questionnaireId, dbData);
        await ApiService.contextDispatch({ type: 'chainData', payload: new ChainData(dbData) });
        return new ChainData(dbData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Add a new chain if none exists. Otherwise updated an existing chain.
  static async upsertChainData(data: SkillstarChain): Promise<SkillstarChain | undefined> {
    const questionnaireId = data && data.hasOwnProperty('id') ? data.id : await ApiService.getChainQuestionnaireId();

    // console.log('questionnaireId =', questionnaireId);

    if (questionnaireId !== undefined) {
      // If there's an existing questionnaire, it's an update.
      return ApiService.editChainData(data, questionnaireId);
    } else {
      // No existing questionnaire yet. Insert a new chain.
      return ApiService.addChainData(data);
    }
  }

  // No questionnaire exists for the participant yet. If we're not online, we'll need to ChainProviderContext the
  // questionnaire data somewhere until we can upload it to the server and get a questionnaire ID for it.
  static async addChainData(data: SkillstarChain): Promise<SkillstarChain | undefined> {
    const dataHasParticipantId =
      data.hasOwnProperty('participant_id') && data.participant_id !== null && data.participant_id !== undefined;

    const participant = await ApiService.getSelectedParticipant();

    if (!(participant || dataHasParticipantId)) {
      console.error('Cannot save the chain data. No participant found to submit the data for.');
      return;
    }

    const participantId = dataHasParticipantId ? data.participant_id : participant && participant.id;

    // Check to see if we're online
    const isConnected = await ApiService._isConnected();

    if (!isConnected) {
      // We're not online. Just cache the data.
      await ApiService._cache('chain_data_draft_' + participantId, data);
      await ApiService.contextDispatch({ type: 'chainData', payload: new ChainData(data) });
    }

    const url = ApiService.endpoints.chain;
    try {
      const user = await ApiService.getUser();
      const participant = await ApiService.getSelectedParticipant();

      if (user && participant) {
        data.user_id = user.id;
        data.participant_id = participant.id;
      }
      const headers = await ApiService._getHeaders('POST', data);
      const response = await fetch(url, headers);
      const dbData = await ApiService._parseResponse(response, 'addChainData', headers.method);

      // Cache the chain data.
      if (dbData) {
        await ApiService._cache('selected_participant_questionnaire_id', dbData.id);

        await ApiService._cache('chain_data_' + dbData.id, dbData);
        await ApiService.contextDispatch({ type: 'chainData', payload: new ChainData(dbData) });

        // We can delete the cached draft now.
        await AsyncStorage.removeItem('chain_data_draft_' + participantId);
        return dbData as SkillstarChain;
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async editChainData(data: SkillstarChain, questionnaireId: number): Promise<SkillstarChain | undefined> {
    console.log('*** editChainData ***');
    const url = ApiService.endpoints.chainSession.replace('<questionnaire_id>', questionnaireId.toString());
    console.log('url', url);
    try {
      const headers = await ApiService._getHeaders('PUT', data);
      const response = await fetch(url, headers);
      const dbData = await ApiService._parseResponse(response, 'editChainData', headers.method);
      return dbData as SkillstarChain;
    } catch (e) {
      console.error(e);
    }
  }

  static async deleteChainData(data: SkillstarChain, participantId: number): Promise<SkillstarChain | undefined> {
    const url = ApiService.endpoints.chain + '/' + participantId;
    try {
      const headers = await ApiService._getHeaders('DELETE', data);
      const response = await fetch(url, headers);
      const dbData = await ApiService._parseResponse(response, 'deleteChainData', headers.method);
      return dbData as SkillstarChain;
    } catch (e) {
      console.error(e);
    }
  }

  static async getUser(): Promise<User | undefined> {
    const cachedUserJson = await AsyncStorage.getItem('user');
    const cachedUserTokenJson = await AsyncStorage.getItem('user_token');

    if (cachedUserJson) {
      const user = parse(cachedUserJson) as User;

      if (user) {
        // Check for connection to the server.
        const isConnected = await ApiService._isConnected();

        if (isConnected && cachedUserTokenJson) {
          // If connected, get the latest user object from the refreshSession endpoint.
          const updatedUser = await ApiService.refreshSession();

          // Return the updated user if defined. Otherwise, just return the cached one.
          return updatedUser || user;
        } else {
          // If not connected to the internet, just return the cached user.
          return user;
        }
      }
    }
  }

  static async refreshSession(): Promise<User | undefined> {
    try {
      const headers = await ApiService._getHeaders('GET');
      const response = await fetch(ApiService.endpoints.refreshSession, headers);
      const user: User = await ApiService._parseResponse(response, 'refreshSession', headers.method);

      if (user) {
        await ApiService._cache('user', user);
        await ApiService.contextDispatch({ type: 'user', payload: user });
        return user;
      }
    } catch (e) {
      console.error('Login error:');
      console.error(e);
    }
  }

  static async selectParticipant(participantId: number): Promise<Participant | undefined> {
    // TODO: Make sure we don't accidentally delete draft/unsynced questionnaire data
    const user = await ApiService.getUser();

    if (user) {
      await AsyncStorage.removeItem('selected_participant_questionnaire_id');
      await AsyncStorage.removeItem('selected_participant');

      if (user.participants && user.participants.length > 0) {
        const dependents = user.participants.filter(p => p.relationship === 'dependent');

        // If there are no dependents yet, return undefined.
        if (!dependents || dependents.length === 0) {
          return;
        }

        const participant = dependents.find(d => d.id === participantId) as Participant;

        if (participant) {
          await ApiService._cache('selected_participant', participant);
          await ApiService.contextDispatch({ type: 'participant', payload: participant });

          const questionnaireId = await ApiService.getChainQuestionnaireId();

          if (questionnaireId !== undefined) {
            await ApiService._cache('selected_participant_questionnaire_id', questionnaireId);
          }

          return participant;
        }
      }
    }
  }

  static async getSelectedParticipant(): Promise<Participant | undefined> {
    const user = await ApiService.getUser();

    if (user) {
      if (user.participants && user.participants.length > 0) {
        const dependents = user.participants.filter(p => p.relationship === 'dependent');

        // If there are no dependents yet, return undefined.
        if (!dependents || dependents.length === 0) {
          return;
        }

        // Check for a cached selected participant.
        const cachedParticipantJson = await AsyncStorage.getItem('selected_participant');

        // If a selected participant is found, update the cache and return the participant.
        if (cachedParticipantJson) {
          const cachedParticipant = parse(cachedParticipantJson) as Participant;

          if (cachedParticipant && cachedParticipant.hasOwnProperty('id')) {
            const updatedParticipant = dependents.find(p => p.id === cachedParticipant.id);

            // Update the cached participant with what's in the user object.
            if (updatedParticipant) {
              await ApiService._cache('selected_participant', updatedParticipant);
              await ApiService.contextDispatch({
                type: 'participant',
                payload: updatedParticipant,
              });
            }
            return updatedParticipant;
          }
        }

        return await ApiService.selectParticipant(dependents[0].id);
      }
    } else {
      console.error('no user found.');
    }
  }

  static async login(email: string, password: string, email_token = ''): Promise<User | null> {
    console.log('*** login ***');

    try {
      const headers = await ApiService._getHeaders('POST', {
        email,
        password,
        email_token,
      });
      const response = await fetch(ApiService.endpoints.login, headers);
      const user: User = await ApiService._parseResponse(response, 'login', headers.method);

      console.log('user', user);

      if (user) {
        if (user.token) {
          console.log(user.token);

          await ApiService._cache('user_token', user.token);
        }

        await ApiService._cache('user', user);
        await ApiService.contextDispatch({ type: 'user', payload: user });
        return user;
      } else {
        return null;
      }
    } catch (e) {
      console.error('Login error:');
      console.error(e);
      return null;
    }
  }

  static async logout(): Promise<void> {
    // Delete EVERYTHING in AsyncStorage
    await AsyncStorage.clear();
  }

  static async _getHeaders(method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<RequestInit> {
    console.log('*** _getHeaders ***');
    const token = await ApiService._getCached('user_token');
    console.log('cached token =', token);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (method === 'GET') {
      return {
        method,
        headers,
      };
    } else {
      return {
        method,
        headers,
        body: JSON.stringify(data),
      };
    }
  }

  static async _isConnected(): Promise<boolean> {
    const netInfoState = await NetInfo.fetch();
    return netInfoState.isConnected;
  }

  static async _cache(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, stringify(value));
    } catch (e) {
      console.log('ApiService._cache Error');
      console.error(e);
    }
  }

  static async _getCached(key: string): Promise<any | void> {
    try {
      const cachedJson = await AsyncStorage.getItem(key);

      if (cachedJson) {
        return parse(cachedJson);
      }
    } catch (e) {
      console.log('ApiService._getCached Error');
      console.error(e);
    }
  }

  static async _parseResponse(response: Response, methodName: string, requestMethod: string | undefined): Promise<any> {
    console.log('*** _parseResponse ***');
    if (!response.ok) {
      console.error(response);
      throw new Error(`Error in ${methodName} ${requestMethod} response: ` + response.statusText);
    } else {
      return await response.json();
    }
  }
}

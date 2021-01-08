import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ChainStep } from '../types/CHAIN/ChainStep';
import { SkillstarChain } from '../types/CHAIN/SkillstarChain';
import { StarDriveFlow } from '../types/CHAIN/StarDriveFlow';
import { Participant, User } from '../types/User';

export class ApiService {
  apiUrl = API_URL;
  endpoints = {
    login: `${this.apiUrl}/login_password`,
    resetPassword: `${this.apiUrl}/reset_password`,
    refreshSession: `${this.apiUrl}/session`,
    chainsForParticipant: `${this.apiUrl}/flow/skillstar/<participant_id>`,
    chain: `${this.apiUrl}/flow/skillstar/chain_questionnaire`,
    chainSession: `${this.apiUrl}/q/chain_questionnaire/<questionnaire_id>`,
    chainSteps: `${this.apiUrl}/chain_step`,
  };

  constructor() {}

  async getChainDataForSelectedParticipant(): Promise<SkillstarChain | undefined> {
    const questionnaireId = await this.getChainQuestionnaireId();

    if (questionnaireId !== undefined) {
      return this.getChainData(questionnaireId);
    }
  }

  async getChainSteps(): Promise<ChainStep[] | undefined> {
    // Check if we are online
    const isConnected = this._isConnected();

    if (!isConnected) {
      // Return the locally cached steps, if they are there.
      const cachedStepsJson = await AsyncStorage.getItem('chainSteps');
      console.log(cachedStepsJson);
      

      if (cachedStepsJson) {
        return JSON.parse(cachedStepsJson) as ChainStep[];
      }
    } else {
      // Get the steps from the server.
      const url = this.endpoints.chainSteps;
      try {
        const headers = await this._getHeaders('GET');
        const response = await fetch(url, headers);
        const dbData = await response.json();

        // Cache them locally.
        await this._cache('chainSteps', dbData);
        return dbData as ChainStep[];
      } catch (e) {
        console.error(e);
      }
    }
  }

  async getChainQuestionnaireId(): Promise<number | undefined> {
    // Check for a cached questionnaire ID
    const skillstarChainId = await AsyncStorage.getItem('selected_participant_questionnaire_id');
    console.log(skillstarChainId);

    // If it's been cached, just return it.
    if (skillstarChainId) {
      return parseInt(skillstarChainId, 10);
    }

    // No cached questionnaire ID. Get the questionnaire ID from the backend, if connected.
    const isConnected = await this._isConnected();

    // Not connected to the internet. Just return undefined.
    if (!isConnected) {
      return;
    }

    // We're connected to the internet. Get the selected participant and ask the backend for their questionnaire ID.
    const participant = await this.getSelectedParticipant();

    if (participant && participant.hasOwnProperty('id')) {
      const url = this.endpoints.chainsForParticipant.replace(
        '<participant_id>',
        participant.id.toString(),
      );

      try {
        const header = await this._getHeaders('GET');
        const response = await fetch(url, header);
        const dbData = (await response.json()) as StarDriveFlow;

        if (
          dbData &&
          typeof dbData === 'object' &&
          dbData.hasOwnProperty('steps') &&
          dbData.steps &&
          dbData.steps.length > 0
        ) {
          const questionnaireId = dbData.steps[0].questionnaire_id;

          if (questionnaireId !== undefined && questionnaireId !== null) {
            await this._cache('selected_participant_questionnaire_id', questionnaireId);
            return questionnaireId;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  async getChainData(questionnaireId: number): Promise<SkillstarChain | undefined> {
    const url = this.endpoints.chainSession.replace(
      '<questionnaire_id>',
      questionnaireId.toString(),
    );

    const isConnected = await this._isConnected();

    // If we're not connected to the internet, return any cached questionnaire data.
    if (!isConnected) {
      const cachedDataJson = await AsyncStorage.getItem('chain_data_' + questionnaireId);

      if (cachedDataJson) {
        return JSON.parse(cachedDataJson) as SkillstarChain;
      } else {
        // Nothing cached. Return undefined.
        return;
      }
    }

    // We're connected to the internet. Get the latest from the backend.
    try {
      const header = await this._getHeaders('GET');
      const response = await fetch(url, header);

      const dbData = (await response.json()) as SkillstarChain;

      if (dbData && dbData.hasOwnProperty('id')) {
        // Cache the latest data
        await this._cache('chain_data_' + questionnaireId, dbData);
        return dbData;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Add a new chain if none exists. Otherwise updated an existing chain.
  async upsertChainData(data: SkillstarChain) {
    const questionnaireId = await this.getChainQuestionnaireId();

    if (questionnaireId !== undefined) {
      // If there's an existing questionnaire, it's an update.
      return this.editChainData(data, questionnaireId);
    } else {
      // No existing questionnaire yet. Insert a new chain.
      return this.addChainData(data);
    }
  }

  // No questionnaire exists for the participant yet. If we're not online, we'll need to store the
  // questionnaire data somewhere until we can upload it to the server and get a questionnaire ID for it.
  async addChainData(data: SkillstarChain) {
    const dataHasParticipantId =
      data.hasOwnProperty('participant_id') &&
      data.participant_id !== null &&
      data.participant_id !== undefined;

    const participant = await this.getSelectedParticipant();

    if (!(participant || dataHasParticipantId)) {
      console.error('Cannot save the chain data. No participant found to submit the data for.');
      return;
    }

    const participantId = dataHasParticipantId
      ? data.participant_id
      : participant && participant.id;

    // Check to see if we're online
    const isConnected = await this._isConnected();

    if (!isConnected) {
      // We're not online. Just cache the data.
      await this._cache('chain_data_draft_' + participantId, data);
    }

    const url = this.endpoints.chain;
    try {
      const user = await this.getUser();
      const participant = await this.getSelectedParticipant();

      if (user && participant) {
        data.user_id = user.id;
        data.participant_id = participant.id;
      }
      const headers = await this._getHeaders('POST', data);
      const response = await fetch(url, headers);
      const dbData = await response.json();
      await this._cache('selected_participant_questionnaire_id', dbData.id);

      // We can delete the cached draft now.
      await AsyncStorage.removeItem('chain_data_draft_' + participantId);

      // Cache the chain data.
      await this._cache('chain_data_' + dbData.id, dbData);

      return dbData as SkillstarChain;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async editChainData(data: SkillstarChain, questionnaireId: number) {
    const url = this.endpoints.chain + '/' + questionnaireId;
    try {
      const header = await this._getHeaders('PUT', data);
      const response = await fetch(url, header);
      const dbData = await response.json();
      return dbData as SkillstarChain;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteChainData(data: SkillstarChain, participantId: number) {
    const url = this.endpoints.chain + '/' + participantId;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const dbData = await response.json();
      return dbData as SkillstarChain;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getUser(): Promise<User | undefined> {
    const cachedUserJson = await AsyncStorage.getItem('user');
    const cachedUserTokenJson = await AsyncStorage.getItem('user_token');

    if (cachedUserJson) {
      const user = JSON.parse(cachedUserJson) as User;

      if (user) {
        // Check for connection to the server.
        const isConnected = await this._isConnected();

        if (isConnected && cachedUserTokenJson) {
          // If connected, get the latest user object from the refreshSession endpoint.
          const updatedUser = await this.refreshSession();

          // Return the updated user if defined. Otherwise, just return the cached one.
          return updatedUser || user;
        } else {
          // If not connected to the internet, just return the cached user.
          return user;
        }
      }
    }
  }

  async refreshSession(): Promise<User | undefined> {
    try {
      const headers = await this._getHeaders('GET');
      const response = await fetch(this.endpoints.refreshSession, headers);
      const user: User = await response.json();

      if (user) {
        await this._cache('user', user);
        return user;
      }
    } catch (e) {
      console.error('Login error:');
      console.error(e);
    }
  }

  async selectParticipant(participantId: number): Promise<Participant | undefined> {
    // TODO: Make sure we don't accidentally delete draft/unsynced questionnaire data
    const user = await this.getUser();

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
          await this._cache('selected_participant', participant);

          const questionnaireId = await this.getChainQuestionnaireId();

          if (questionnaireId !== undefined) {
            await this._cache('selected_participant_questionnaire_id', questionnaireId);
          }

          return participant;
        }
      }
    }
  }

  async getSelectedParticipant(): Promise<Participant | undefined> {
    const user = await this.getUser();

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
          const cachedParticipant = JSON.parse(cachedParticipantJson) as Participant;

          if (cachedParticipant && cachedParticipant.hasOwnProperty('id')) {
            const updatedParticipant = dependents.find(p => p.id === cachedParticipant.id);

            // Update the cached participant with what's in the user object.
            await this._cache('selected_participant', updatedParticipant);
            return updatedParticipant;
          }
        }

        return await this.selectParticipant(dependents[0].id);
      }
    } else {
      console.error('no user found.');
    }
  }

  async login(email: string, password: string, email_token = ''): Promise<User | null> {
    try {
      const headers = await this._getHeaders('POST', { email, password, email_token });
      const response = await fetch(this.endpoints.login, headers);
      const user: User = await response.json();

      if (user.token) {
        await this._cache('user_token', user.token);
        await this._cache('user', user);
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

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('user_token');
    return AsyncStorage.removeItem('user');
  }

  async _getHeaders(method: 'GET' | 'POST' | 'PUT', data?: any) {
    const tokenJson = await AsyncStorage.getItem('user_token');
    const token = tokenJson ? JSON.parse(tokenJson) : 'NO_TOKEN_ERROR';

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
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

  async _isConnected(): Promise<boolean> {
    const netInfoState = await NetInfo.fetch();
    return netInfoState.isConnected;
  }

  async _cache(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';
import {wait} from '../_util/testing/wait';
import {ApiService} from './ApiService';

describe('ApiService', () => {
  afterEach(async () => {
    await wait();
  })

  it('should get Chain Data for the Selected Participant', async () => {
    // getChainDataForSelectedParticipant
    const apiService = new ApiService();
    const result = await apiService.getChainDataForSelectedParticipant();
    expect(result).toEqual(true);
  });

  it('should get the list of Chain Steps', async () => {
    // getChainSteps
    const apiService = new ApiService();
    const result = await apiService.getChainSteps();
    expect(result).toEqual(true);
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
    const result = await apiService.upsertChainData({sessions: []});
    expect(result).toEqual(undefined);
  });

  it('should add new Chain Data', async () => {
    // addChainData
    const apiService = new ApiService();
    const result = await apiService.addChainData({sessions: []});
    expect(result).toEqual(undefined);
  });

  it('should edit existing Chain Data', async () => {
    // editChainData
    const apiService = new ApiService();
    const result = await apiService.editChainData({sessions: []}, 0);
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

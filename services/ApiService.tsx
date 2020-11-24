import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/User';

export class ApiService {
  apiUrl = 'http://localhost:5000/api';
  endpoints = {
    login: `${this.apiUrl}/login_password`,
    resetPassword: `${this.apiUrl}/reset_password`,
    refreshSession: `${this.apiUrl}/session`,
    // baselineAssessment: `${this.apiUrl}/baseline_assessment`,
  };

  constructor() {
  }

  async login(email: string, password: string, email_token = ''): Promise<User | null> {
    try {
      const response = await fetch(this.endpoints.login, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password, email_token})
      });

      const user: User = await response.json();
      console.log('login response user', user);

      if (user.token) {
        await AsyncStorage.setItem("user_token", user.token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        return user;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem("user_token");
    return AsyncStorage.removeItem("user");
  }

  // async addBaselineAssessment(data): Promise<void> {
  // }
}

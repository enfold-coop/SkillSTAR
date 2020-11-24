import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/User';

export class ApiService {
  apiUrl = 'http://localhost:5000/api';
  endpoints = {
    login: `${this.apiUrl}/login_password`,
    resetPassword: `${this.apiUrl}/reset_password`,
    refreshSession: `${this.apiUrl}/session`,
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
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

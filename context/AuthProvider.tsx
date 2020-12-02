import React from "react";
import {AuthProviderProps} from '../types/AuthProvider';

export const AuthContext = React.createContext<AuthProviderProps>({
  state: {
    user: null,
    participant: null,
  },
});

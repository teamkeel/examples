'use client';

import React, { createContext, useContext, useState } from 'react';
import store from 'store2';

interface UserContextProps {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  userId: string | null;
  setUserId: (id: string | null) => void;
  loading: Boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => store.get('token'));
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isAuthenticated = Boolean(token);

  React.useEffect(() => {
    if (token) {
      store.set('token', token);
      setLoading(false);
    } else {
      store.remove('token');
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        token,
        setToken,
        isAuthenticated,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

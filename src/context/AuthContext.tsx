import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  isPremium: boolean;
  savedPlaces: string[];
}

interface AuthContextType {
  user: User | null;
  loginPlaceholder: () => void;
  logoutPlaceholder: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginPlaceholder = () => {
    // Future actual auth implementation
    setUser({ id: '1', name: 'Nomad Traveler', isPremium: false, savedPlaces: [] });
  };

  const logoutPlaceholder = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginPlaceholder, logoutPlaceholder }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

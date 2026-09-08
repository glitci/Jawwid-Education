import React, { createContext, useState, ReactNode } from 'react';
import { users } from '../types/users';

interface UserContextValue {
  loggedInUser: users | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<users | null>>;
}

export const UserContext = createContext<UserContextValue>({
  loggedInUser: null,
  setLoggedInUser: () => {},
});

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<users | null>(null);

  const contextValue: UserContextValue = {
    loggedInUser,
    setLoggedInUser: (newLoggedInUser) => setLoggedInUser(newLoggedInUser),
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;

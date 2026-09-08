import { ReactNode, createContext, useState } from 'react';

interface RealUserContextValue {
  realUser: 'student' | 'teacher' | 'admin' | 'superAdmin' | 'guest';
  setRealUser: React.Dispatch<
    React.SetStateAction<
      'student' | 'teacher' | 'admin' | 'superAdmin' | 'guest'
    >
  >;
}

export const REALUSER = createContext<RealUserContextValue>({
  realUser: 'student',
  setRealUser: () => {},
});

const RealUserContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [realUser, setRealUser] = useState<
    'student' | 'teacher' | 'admin' | 'superAdmin' | 'guest'
  >('student');

  const contextValue: RealUserContextValue = {
    realUser,
    setRealUser: (newUser) => setRealUser(newUser),
  };

  return <REALUSER.Provider value={contextValue}>{children}</REALUSER.Provider>;
};

export default RealUserContext;

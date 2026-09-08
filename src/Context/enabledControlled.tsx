import { ReactNode, createContext, useState } from 'react';

interface AdminControlled {
  enabledControls: string[];
  setEnabledControls: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ENABLED = createContext<AdminControlled>({
  enabledControls: [],
  setEnabledControls: () => {},
});

const EnabledControlled: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enabledControls, setEnabledControls] = useState<string[]>([]);

  const contextValue: AdminControlled = {
    enabledControls,
    setEnabledControls: (roles) => setEnabledControls(roles),
  };

  return <ENABLED.Provider value={contextValue}>{children}</ENABLED.Provider>;
};

export default EnabledControlled;

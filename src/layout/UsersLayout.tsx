import { ReactNode } from 'react';
import DefaultLayout from './DefaultLayout';

const UsersLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DefaultLayout>
      <div>{children}</div>
    </DefaultLayout>
  );
};

export default UsersLayout;

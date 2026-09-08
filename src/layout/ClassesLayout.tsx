import { ReactNode, useContext } from 'react';
import InnerPageHeader from '../components/InnerPageHeader';
import DefaultLayout from './DefaultLayout';
import { REALUSER } from '../Context/realUser';

const ClassesLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inner Header Links
  const { realUser } = useContext(REALUSER);

  const links = [
    { title: 'Classes', path: 'my-classes' },
    ...(realUser !== 'teacher'
      ? [{ title: 'Assignments', path: 'my-assignments' }]
      : []),
    ...(realUser ? [{ title: 'Monthly Report', path: 'monthly-report' }] : []),
  ];

  return (
    <DefaultLayout>
      <InnerPageHeader pageLink="classes" links={links} />
      <div>{children}</div>
    </DefaultLayout>
  );
};

export default ClassesLayout;

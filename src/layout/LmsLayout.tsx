import { ReactNode } from 'react';
import InnerPageHeader from '../components/InnerPageHeader';
import DefaultLayout from './DefaultLayout';

const LmsLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inner Header Links
  const links = [
    { title: 'Products', path: 'products' },
    { title: 'Courses', path: 'courses' },
  ];
  return (
    <DefaultLayout>
      <InnerPageHeader pageLink="lms" links={links} />
      <div>{children}</div>
    </DefaultLayout>
  );
};

export default LmsLayout;

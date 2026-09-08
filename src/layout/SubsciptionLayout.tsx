import { ReactNode } from 'react';
import InnerPageHeader from '../components/InnerPageHeader';
import DefaultLayout from './DefaultLayout';

const SubsciptionLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inner Header Links
  const links = [
    { title: 'Invoice', path: 'invoices' },
    { title: 'ESTIMATES', path: 'estimates' },
  ];
  return (
    <DefaultLayout>
      {/* inner Header Component */}
      <InnerPageHeader pageLink="subscriptions" links={links} />
      <div>{children}</div>
    </DefaultLayout>
  );
};

export default SubsciptionLayout;

import { ReactNode } from 'react';
import InnerPageHeader from '../components/InnerPageHeader';
import DefaultLayout from './DefaultLayout';

const CalendarLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inner Header Links
  const links = [{ title: 'MY CALENDAR', path: 'my-calendar' }];
  return (
    <DefaultLayout>
      {/* inner Header Component */}
      <InnerPageHeader pageLink="calendar" links={links} />
      <div>{children}</div>
    </DefaultLayout>
  );
};

export default CalendarLayout;

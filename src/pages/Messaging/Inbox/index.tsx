import { useState } from 'react';
import { MenuOption, TableColumn } from '../../../types/table';
import DefaultLayout from '../../../layout/DefaultLayout';
import Table from '../../../components/Tables/Table';
import MessagingSidebar from '../../../layout/MessagingSidebar';
import { inbox } from '../../../types/messaging';

const Inbox = () => {
  const menuOptions: MenuOption[] = [];

  const inboxData: inbox[] = [
    {
      from: 'john.doe@example.com',
      cc: 'jane.doe@example.com',
      subject: 'Meeting Reminder',
      date: '2024-03-07T09:00:00Z',
    },
    {
      from: 'alice.smith@example.com',
      cc: 'bob.jones@example.com',
      subject: 'Project Update',
      date: '2024-03-06T15:30:00Z',
    },
    {
      from: 'info@newsletter.com',
      cc: '',
      subject: 'Weekly Newsletter',
      date: '2024-03-05T12:00:00Z',
    },
  ];
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);

  const header: TableColumn[] = [
    { key: 'from', name: 'From' },
    { key: 'cc', name: 'CC' },
    { key: 'subject', name: 'Subject' },
    { key: 'date', name: 'Date' },
  ];

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2">
        <div className="sm:col-span-1 md:col-span-1">
          <MessagingSidebar />
        </div>
        <div className="sm:col-span-1 md:col-span-3">
          <Table
            header={header}
            data={inboxData}
            ItemAdd="contact"
            limit={limit}
            page={page}
            setPage={setPage}
            setLimit={setLimit}
            optionsMenu={menuOptions}
            // filterInputs={filterInputs}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Inbox;

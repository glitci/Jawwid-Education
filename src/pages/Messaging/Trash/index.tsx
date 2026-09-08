import { useState } from 'react';
import Table from '../../../components/Tables/Table';
import DefaultLayout from '../../../layout/DefaultLayout';
import MessagingSidebar from '../../../layout/MessagingSidebar';
import { trash } from '../../../types/messaging';
import { TableColumn } from '../../../types/table';

const Trash = () => {
  const TrashData: trash[] = [
    {
      to: 'jane.doe@.com',
      cc: 'Admin',
      subject: 'Reminder: Project Deadline',
      date: '2024-03-07T13:45:00Z',
    },
    {
      to: 'bob.jones@.com',
      cc: '',
      subject: 'Meeting Agenda',
      date: '2024-03-08T10:00:00Z',
    },
    {
      to: 'client@company.com',
      cc: 'Admin',
      subject: 'Quarterly Report',
      date: '2024-03-09T09:30:00Z',
    },
  ];
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);

  const header: TableColumn[] = [
    { key: 'to', name: 'To' },
    { key: 'cc', name: 'CC' },
    { key: 'subject', name: 'Subject' },
    { key: 'date', name: 'Date' },
  ];

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-1">
        <div className="sm:col-span-1 md:col-span-1">
          <MessagingSidebar />
        </div>
        <div className="sm:col-span-1 md:col-span-3">
          <Table
            header={header}
            data={TrashData}
            ItemAdd="contact"
            limit={limit}
            page={page}
            setPage={setPage}
            setLimit={setLimit}
            // optionsMenu={menuOptions}
            // filterInputs={filterInputs}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Trash;

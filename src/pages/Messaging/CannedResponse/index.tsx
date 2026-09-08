import { useState } from 'react';
import { cannedResponse } from '../../../types/messaging';
import DefaultLayout from '../../../layout/DefaultLayout';
import MessagingSidebar from '../../../layout/MessagingSidebar';
import Table from '../../../components/Tables/Table';
import { TableColumn } from '../../../types/table';

const CannedResponse = () => {
  const inboxData: cannedResponse[] = [
    {
      name: 'Thank you for your inquiry',
      autoAdd: 'Yes',
      autoReplay: 'No',
    },
    {
      name: 'Apology for the inconvenience',
      autoAdd: 'No',
      autoReplay: 'Yes',
    },
  ];
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);

  const header: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'autoAdd', name: 'Auto Add' },
    { key: 'autoReplay', name: 'Auto Replay' },
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
            // optionsMenu={menuOptions}
            // filterInputs={filterInputs}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CannedResponse;

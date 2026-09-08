import { useState } from 'react';
import Table from '../../../components/Tables/Table';
import { GoDuplicate } from 'react-icons/go';
import { BsArchive } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { FilterInput, MenuOption, TableColumn } from '../../../types/table';
import DefaultLayout from '../../../layout/DefaultLayout';
import { session } from '../../../types/Lms';

const Session = () => {
  const sessionData: session[] = [
    {
      number: 1,
      period: 60,
      startDate: '2024-03-01',
      studentNumber: 20,
    },
    {
      number: 2,
      period: 90,
      startDate: '2024-03-15',
      studentNumber: 15,
    },
    {
      number: 3,
      period: 45,
      startDate: '2024-04-01',
      studentNumber: 25,
    },
    {
      number: 4,
      period: 120,
      startDate: '2024-04-15',
      studentNumber: 18,
    },
    {
      number: 5,
      period: 75,
      startDate: '2024-05-01',
      studentNumber: 22,
    },
  ];
  const menuOptions: MenuOption[] = [
    {
      title: 'View',
      icon: <FaEye />,
    },
    {
      title: 'Edit',
      icon: <CiEdit />,
    },
    {
      title: 'Duplicate',
      icon: <GoDuplicate />,
    },
    {
      title: 'Archive',
      icon: <BsArchive />,
    },
    {
      title: 'Delete',
      icon: <RiDeleteBinLine />,
    },
  ];
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);

  const header: TableColumn[] = [
    { key: 'number', name: 'Session Number' },
    { key: 'period', name: 'Session Period' },
    { key: 'startDate', name: 'Start Date' },
    { key: 'studentNumber', name: 'Student Number' },
  ];
  const filterInputs: FilterInput[] = [
    {
      header: { key: 'number', name: 'Session Number' },
      type: 'input',
      placeHolder: 'Session Number',
    },
    {
      header: { key: 'period', name: 'Session Period' },
      type: 'input',
      placeHolder: 'Session Period',
    },
    {
      header: { key: 'startDate', name: 'Start Date' },
      type: 'date',
      placeHolder: 'Start Date',
    },
    {
      header: { key: 'studentNumber', name: 'Student Number' },
      type: 'input',
      placeHolder: 'Student Number',
    },
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        data={sessionData}
        ItemAdd="session"
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        optionsMenu={menuOptions}
        filterInputs={filterInputs}
      />
    </DefaultLayout>
  );
};

export default Session;

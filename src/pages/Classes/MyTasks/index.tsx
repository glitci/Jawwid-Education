import { useState } from 'react';
import { myTasks } from '../../../types/classes';
import { FilterInput, MenuOption, TableColumn } from '../../../types/table';
import { FaEye } from 'react-icons/fa6';
import ClassesLayout from '../../../layout/ClassesLayout';
import Table from '../../../components/Tables/Table';

const MyTasks = () => {
  const [limit, setLimit] = useState<number>(2);
  const [page, setPage] = useState<number>(1);
  const myTasksData: myTasks[] = [
    {
      id: 1,
      priority: 'Normal',
      title: 'Omar & Maria',
      class: '',
      student: '',
      dueDate: '2024-03-03',
    },
    {
      id: 2,
      priority: 'Normal',
      title: 'Nageeb & Raneem',
      class: '',
      student: '',
      dueDate: '2024-03-03',
    },
  ];

  const header: TableColumn[] = [
    { key: 'id', name: 'Id' },
    { key: 'priority', name: 'Priority' },
    { key: 'title', name: 'Title' },
    { key: 'class', name: 'Class' },
    { key: 'student', name: 'Student' },
    { key: 'dueDate', name: 'Due Date' },
  ];

  const menuOptions: MenuOption[] = [
    {
      title: 'View',
      icon: <FaEye />,
    },
  ];
  const filterInputs: FilterInput[] = [
    {
      header: { key: 'name', name: 'Name' },
      type: 'input',
      placeHolder: 'Name',
    },
    {
      header: { key: 'status', name: 'Status' },
      type: 'select',
      placeHolder: 'Status',
      data: ['Working', 'Not Working'],
    },
    {
      header: { key: 'student', name: 'Student' },
      type: 'input',
      placeHolder: 'Student',
    },
    {
      header: { key: 'dueDate', name: 'Due Date' },
      type: 'date',
      placeHolder: 'Due Date',
    },
    {
      header: { key: 'progress', name: 'Progress' },
      type: 'input',
      placeHolder: 'Progress',
    },
  ];
  return (
    <ClassesLayout>
      <Table
        header={header}
        data={myTasksData}
        ItemAdd="task"
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        optionsMenu={menuOptions}
        filterInputs={filterInputs}
      />
    </ClassesLayout>
  );
};

export default MyTasks;

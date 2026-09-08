import { useState } from 'react';
import Table from '../../../../components/Tables/Table';

import { FilterInput, Options, TableColumn } from '../../../../types/table';
import { useQuery } from 'react-query';
import { Axios } from '../../../../Api/axios';
import { ASSIGNMENTS } from '../../../../Api/Api';
import ClassesLayout from '../../../../layout/ClassesLayout';

const Assignments = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');

  const menuOptions: Options[] = [];

  const { data, isLoading, refetch } = useQuery({
    queryFn: () =>
      Axios.get(`${ASSIGNMENTS}?page=${page}&limit=${limit}${query}`),
    queryKey: ['assignments', page, limit, query],
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    { key: 'assignmentFile', name: 'Assignment File' },
  ];

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'assignmentFile', name: 'Assignment File' },
      type: 'input',
      placeHolder: 'Assignment File',
    },
  ];

  return (
    <ClassesLayout>
      <Table
        header={header}
        data={data?.data?.assignments}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        filterInputs={filterInputs}
        isLoading={isLoading}
        optionsExists={false}
        comingOptions={menuOptions}
        ItemAdd="assignment"
        totalPages={data?.data?.totalPages!}
        handleClose={handleClose}
        hideFilter
      />
    </ClassesLayout>
  );
};

export default Assignments;

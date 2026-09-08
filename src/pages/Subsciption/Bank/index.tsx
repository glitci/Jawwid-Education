import { useState } from 'react';

import Table from '../../../components/Tables/Table';
import { FilterInput, Options, TableColumn } from '../../../types/table';

import DefaultLayout from '../../../layout/DefaultLayout';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { BANK, PACKAGES } from '../../../Api/Api';
const Bank = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];
  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'studentName', name: 'Student Name' },
      type: 'input',
      placeHolder: 'Student Name',
    },
    {
      header: { key: 'studentEmail', name: 'Student Email' },
      type: 'input',
      placeHolder: 'Student Email',
    },
    {
      header: { key: 'amountReceived', name: 'Amount' },
      type: 'input',
      placeHolder: 'Amount',
    },
    {
      header: { key: 'psckageName', name: 'Package Name' },
      type: 'input',
      placeHolder: 'Package Name',
    },
  ];

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const {
    data: packages,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: () => Axios.get(`${PACKAGES}/${BANK}`),
    queryKey: ['packages-bank', page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${PACKAGES}/${BANK}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['packages-bank']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    { key: 'studentName', name: 'Student Name' },
    { key: 'studentEmail', name: 'Student Email' },
    { key: 'amountReceived', name: 'Amount' },
    { key: 'currency', name: 'Currency' },
    { key: 'psckageName', name: 'Package' },
    { key: 'subscription_start', name: 'Sub Start' },
    { key: 'subscription_end', name: 'Sub end' },
    // { key: 'createdAt', name: 'Created At' },
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        ItemAdd="Bank Transfer"
        data={packages?.data?.data}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        filterInputs={filterInputs}
        isLoading={isLoading}
        deleteItem={mutateAsync}
        comingOptions={comingOptions}
        deleteLoading={deleteLoading}
        isSuccess={isSuccess}
        totalPages={packages?.data?.totalPages}
        setSearch={setSearch}
        handleSend={handleSend}
        handleClose={handleClose}
        hideOptions
      />
    </DefaultLayout>
  );
};

export default Bank;

import { useState } from 'react';
import Table from '../../components/Tables/Table';

import { FilterInput, Options, TableColumn } from '../../types/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../Api/axios';
import { USERS } from '../../Api/Api';
import UsersLayout from '../../layout/UsersLayout';

const Users = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];

  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'name', name: 'Name' },
      type: 'input',
      placeHolder: 'name',
    },
    {
      header: { key: 'email', name: 'Email' },
      type: 'input',
      placeHolder: 'Email',
    },
    {
      header: { key: 'phone', name: 'Phone' },
      type: 'input',
      placeHolder: 'Phone',
    },
    {
      header: { key: 'role', name: 'Role' },
      type: 'select',
      placeHolder: 'Role',
      data: ['teacher', 'student', 'admin', 'guest'],
    },
  ];

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: () => Axios.get(`${USERS}?page=${page}&limit=${limit}&${query}`),
    queryKey: ['users', page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${USERS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'email', name: 'Email' },
    { key: 'phone', name: 'Phone' },
    { key: 'role', name: 'Role' },
    { key: 'account_status', name: 'Account Status' },
    { key: 'active', name: 'Active' },
    { key: 'createdAt', name: 'Created At' },
  ];

  return (
    <UsersLayout>
      <Table
        header={header}
        ItemAdd="user"
        data={users?.data?.data}
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
        totalPages={users?.data?.totalPages}
        setSearch={setSearch}
        handleSend={handleSend}
        handleClose={handleClose}
      />
    </UsersLayout>
  );
};

export default Users;

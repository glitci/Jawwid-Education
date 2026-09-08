import { useContext, useState } from 'react';
import Table from '../../components/Tables/Table';

import { FilterInput, Options, TableColumn } from '../../types/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../Api/axios';
import { MATERIALS } from '../../Api/Api';
import UsersLayout from '../../layout/UsersLayout';
import { REALUSER } from '../../Context/realUser';

const Materials = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];
  const { realUser } = useContext(REALUSER);

  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'title', name: 'Title' },
      type: 'input',
      placeHolder: 'title',
    },
    {
      header: { key: 'summary', name: 'Summary' },
      type: 'input',
      placeHolder: 'summary',
    },
  ];

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const {
    data: materials,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: () =>
      Axios.get(`${MATERIALS}?page=${page}&limit=${limit}&${query}`),
    queryKey: ['materials', page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${MATERIALS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['materials']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'summary', name: 'Summary' },
    { key: 'image', name: 'Image' },
    { key: 'materialFile', name: 'PDF File' },
    { key: 'createdAt', name: 'Created At' },
  ];

  return (
    <UsersLayout>
      <Table
        header={header}
        ItemAdd="material"
        data={materials?.data?.data}
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
        totalPages={materials?.data?.totalPages}
        setSearch={setSearch}
        handleSend={handleSend}
        handleClose={handleClose}
        hideOptions={realUser === 'student' || realUser === 'teacher'}
      />
    </UsersLayout>
  );
};

export default Materials;

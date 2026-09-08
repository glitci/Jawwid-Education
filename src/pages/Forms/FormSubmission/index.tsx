import { useState } from 'react';
import Table from '../../../components/Tables/Table';
import { FilterInput, Options, TableColumn } from '../../../types/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { FORMS } from '../../../Api/Api';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useParams } from 'react-router-dom';
const index = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];

  const { id } = useParams();
  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'userName', name: 'User Name' },
      type: 'input',
      placeHolder: 'User Name',
    },
    {
      header: { key: 'userEmail', name: 'User Email' },
      type: 'input',
      placeHolder: 'User Email',
    },
  ];

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const {
    data: forms,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: () =>
      Axios.get(
        `${FORMS}/${id}/submissions?page=${page}&limit=${limit}&${query}`,
      ),
    queryKey: ['formSub' + id, page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${FORMS}/submissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['formSub']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  console.log(forms?.data.data);
  const header: TableColumn[] = [
    { key: 'userName', name: 'User Name' },
    { key: 'userEmail', name: 'User Email' },
    { key: 'number Of Answerws', name: 'Number Of Q&A' },
    { key: 'createdAt', name: 'Created At' },
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        data={forms?.data?.data}
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
        totalPages={forms?.data?.totalPages}
        setSearch={setSearch}
        handleSend={handleSend}
        handleClose={handleClose}
      />
    </DefaultLayout>
  );
};

export default index;

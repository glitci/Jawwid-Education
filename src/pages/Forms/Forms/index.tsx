import { useState } from 'react';
import Table from '../../../components/Tables/Table';
import { FilterInput, Options, TableColumn } from '../../../types/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { FORMS } from '../../../Api/Api';
import DefaultLayout from '../../../layout/DefaultLayout';
const index = () => {
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
    queryFn: () => Axios.get(`${FORMS}?page=${page}&limit=${limit}&${query}`),
    queryKey: ['forms', page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${FORMS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['forms']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };
  console.log(forms?.data.data);
  const header: TableColumn[] = [
    { key: 'name', name: 'Form Name' },
    { key: 'number Of Questions', name: 'Number Of Questions' },
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        ItemAdd="Form"
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

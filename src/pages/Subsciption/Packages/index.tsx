import { useContext, useState } from 'react';

import Table from '../../../components/Tables/Table';
import { FilterInput, Options, TableColumn } from '../../../types/table';

import DefaultLayout from '../../../layout/DefaultLayout';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { PACKAGES } from '../../../Api/Api';
import { REALUSER } from '../../../Context/realUser';
import Package from '../../../components/packages';

const Packages = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];
  const { realUser } = useContext(REALUSER);
  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'title', name: 'Title' },
      type: 'input',
      placeHolder: 'Title',
    },
    {
      header: { key: 'classesNum', name: 'Classes Count' },
      type: 'input',
      placeHolder: 'Classes Count',
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
    queryFn: () => Axios.get(`${PACKAGES}`),
    queryKey: ['packages', page, limit, query],
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${PACKAGES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['packages']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'classesNum', name: 'Classes Count' },
    { key: 'createdAt', name: 'Created At' },
  ];

  return (
    <DefaultLayout>
      {realUser === 'student' || realUser === 'guest' ? (
        <Package data={packages?.data.data} isLoading={isLoading} />
      ) : (
        <Table
          header={header}
          ItemAdd="package"
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
        />
      )}
    </DefaultLayout>
  );
};

export default Packages;

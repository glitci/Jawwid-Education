import { useState } from 'react';
import Table from '../../../../components/Tables/Table';
import { FilterInput, Options, TableColumn } from '../../../../types/table';
import DefaultLayout from '../../../../layout/DefaultLayout';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../../Api/axios';
import { COURSES, PRODUCTS, STUDENTS_OF_Product } from '../../../../Api/Api';
import { useParams } from 'react-router-dom';

const ProdcutStudents = () => {
  const menuOptions: Options[] = [];
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const queryClient = useQueryClient();
  const { id: productId } = useParams();

  const { data: product, isLoading } = useQuery({
    queryFn: () =>
      Axios.get(
        `${STUDENTS_OF_Product}/${productId}?page=${page}&limit=${limit}&${query}`,
      ),
    queryKey: ['singleProduct' + productId, query, page, limit],
  });

  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (id) =>
      Axios.put(`${PRODUCTS}/${productId}/removeStudents`, {
        studentIds: [id],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['singleProduct' + productId]);
    },
  });

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const header: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'email', name: 'Email' },
    { key: 'phone', name: 'Phone' },
  ];

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'name', name: 'Name' },
      type: 'input',
      placeHolder: 'Name',
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
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        data={product?.data?.students}
        ItemAdd="student"
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        comingOptions={menuOptions}
        filterInputs={filterInputs}
        deleteItem={mutateAsync}
        deleteLoading={deleteLoading}
        isLoading={isLoading}
        optionsExists={false}
        isSuccess={isSuccess}
        totalPages={product?.data?.totalPages}
        setSearch={setSearch}
        handleSend={handleSend}
      />
    </DefaultLayout>
  );
};

export default ProdcutStudents;

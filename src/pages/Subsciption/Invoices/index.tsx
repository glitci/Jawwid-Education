import { useContext, useState } from 'react';
import Table from '../../../components/Tables/Table';

import {
  FilterInput,
  MenuOption,
  OptionsMenuProps,
  TableColumn,
} from '../../../types/table';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { INVOICES, PACKAGES } from '../../../Api/Api';
import DefaultLayout from '../../../layout/DefaultLayout';
import { REALUSER } from '../../../Context/realUser';

const Invoices = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('monthly');
  const comingOptions: OptionsMenuProps[] = [];

  const { realUser } = useContext(REALUSER);

  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'packageStripeId', name: 'Package Stripe Id' },
      type: 'input',
      placeHolder: 'Package Stripe Id',
    },
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
    queryFn: () =>
      realUser === 'student'
        ? Axios.get(`${PACKAGES}/${INVOICES}/student`)
        : invoice === 'monthly'
        ? Axios.get(`${PACKAGES}/${INVOICES}`)
        : Axios.get(`${PACKAGES}/oneTimePayments`),
    queryKey: ['invoices', page, limit, query, invoice],
  });

  const handleRefetch = (title: string) => {
    setInvoice(title);
  };

  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${PACKAGES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
    },
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const header: TableColumn[] = [
    {
      key: invoice === 'monthly' ? 'invoice_number' : 'chargeId',
      name: 'Invoice Number',
    },
    { key: 'customer_name', name: 'Customer Name' },
    { key: 'customer_email', name: 'Customer Email' },
    {
      key: invoice === 'monthly' ? 'package_name' : 'description',
      name: 'Package Name',
    },
    invoice === 'monthly' && { key: 'invoice_pdf', name: 'Download' },
    { key: invoice === 'monthly' ? 'invoice_url' : 'receipt_url', name: 'Url' },
    { key: 'created_at', name: 'Created At' },
  ];

  return (
    <DefaultLayout>
      <Table
        header={header}
        data={
          realUser === 'student'
            ? invoice === 'monthly'
              ? packages?.data?.invoices
              : packages?.data?.oneTimePayments
            : packages?.data?.data
        }
        limit={limit}
        ItemAdd="invoices"
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
        handleRefetch={handleRefetch}
        hideOptions
      />
    </DefaultLayout>
  );
};

export default Invoices;

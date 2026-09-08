import { useState } from 'react';
import { Options, TableColumn } from '../../../types/table';
import { useQuery } from 'react-query';
import { Axios } from '../../../Api/axios';
import { MONTHLY_REPORT } from '../../../Api/Api';
import ClassesLayout from '../../../layout/ClassesLayout';
import Table from '../../../components/Tables/Table';

const MonthlyReport = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const comingOptions: Options[] = [];

  const { data, isLoading, refetch } = useQuery({
    queryFn: () =>
      Axios.get(`${MONTHLY_REPORT}?page=${page}&limit=${limit}&${query}`),
    queryKey: ['reports', page, limit],
  });
  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };
  const header: TableColumn[] = [
    { key: 'teacher', name: 'teacher' },
    { key: 'student', name: 'student' },
    { key: 'month', name: 'month' },
    { key: '_id', name: 'Details' },
  ];
  return (
    <ClassesLayout>
      <Table
        header={header}
        ItemAdd="report"
        data={data?.data?.reports}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        comingOptions={comingOptions}
        totalPages={data?.data?.totalPages!}
        search={search}
        setSearch={setSearch}
        handleClose={handleClose}
        handleSend={handleSend}
        hideFilter
      />
    </ClassesLayout>
  );
};

export default MonthlyReport;

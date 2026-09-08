import LmsLayout from '../../../layout/LmsLayout';
import { Options, TableColumn } from '../../../types/table';
import LMSCard from '../../../components/Card/LMSCard';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { COURSES } from '../../../Api/Api';

const Course = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => Axios.get(`${COURSES}?page=${page}&limit=${limit}`),
  });
  console.log(courses?.data.data);
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${COURSES}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
    },
  });
  const comingOptions: Options[] = [];

  return (
    <LmsLayout>
      <LMSCard
        pageName="course"
        page={page}
        setPage={setPage}
        ItemAdd="course"
        limit={limit}
        setLimit={setLimit}
        data={courses?.data.data}
        deleteItem={mutateAsync}
        isLoading={isLoading}
        comingOptions={comingOptions}
        deleteLoading={deleteLoading}
        path="student"
        totalPages={courses?.data?.totalPages!}
        isSuccess={isSuccess}
      />
    </LmsLayout>
  );
};

export default Course;

import LmsLayout from '../../../layout/LmsLayout';
import { Options } from '../../../types/table';
import LMSCard from '../../../components/Card/LMSCard';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { PRODUCTS } from '../../../Api/Api';

const Product = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const queryClient = useQueryClient();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => Axios.get(`${PRODUCTS}?page=${page}&limit=${limit}`),
  });
  console.log(productData)
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${PRODUCTS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
  const comingOptions: Options[] = [];
  return (
    <LmsLayout>
      <LMSCard
        pageName="product"
        page={page}
        setPage={setPage}
        ItemAdd="product"
        limit={limit}
        setLimit={setLimit}
        data={productData?.data.data}
        deleteItem={mutateAsync}
        isLoading={isLoading}
        comingOptions={comingOptions}
        deleteLoading={deleteLoading}
        path="d"
        totalPages={productData?.data?.totalPages!}
        isSuccess={isSuccess}
      />
    </LmsLayout>
  );
};

export default Product;

import { useEffect, useState } from 'react';
import { Options } from '../../types/table';
import { POSTS } from '../../Api/Api';
import { Axios } from '../../Api/axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CardPosts from '../../components/Card/CardPosts';
import DefaultLayout from '../../layout/DefaultLayout';
import { showSuccess } from '../../libs/ReactToastify';

const PendingPosts = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [posts, setPosts] = useState([]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pendingPosts'],
    queryFn: () => Axios.get(`${POSTS}?page=1&limit=20&status=pending`),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setPosts(data.data.data);
    },
  });
  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${POSTS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingPosts']);
    },
  });

  const handleAddLike = async (id: string) => {
    try {
      Axios.put(`${POSTS}/${id}/like`);
    } catch (err) {
      console.log(err);
    }
  };

  const {
    mutateAsync: publishPost,
    isLoading: publishLoading,
    isSuccess: isSuccessLoading,
  } = useMutation({
    mutationFn: async (id) => await Axios.put(`${POSTS}/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingPosts']);
    },
  });

  useEffect(() => {
    isSuccessLoading && showSuccess('Post Published Successfully');
  }, [isSuccessLoading]);

  useEffect(() => {
    let isFetching = false;
    let page = 1;
    let stopPagination = false;
    const mainRight = document?.querySelector('.main-right');
    const handleScroll = async () => {
      if (
        mainRight?.scrollTop + mainRight?.clientHeight >
          mainRight?.scrollHeight - 300 &&
        !stopPagination &&
        !isFetching
      ) {
        isFetching = true;
        console.log('object');
        try {
          const res = await Axios.get(`${POSTS}?page=${page + 1}&limit=20`);
          console.log(res.data);
          const newPosts = res.data.data;
          const currentPage = res.data.page;
          const totalPages = res.data.totalPages;
          if (currentPage > totalPages) {
            stopPagination = true;
          } else {
            setPosts((prev) => [...prev, ...newPosts]);
            page += 1;
          }
        } catch (err) {
          console.log(err);
        } finally {
          setTimeout(() => {
            isFetching = false;
          }, 1000);
        }
      }
    };

    mainRight?.addEventListener('scroll', handleScroll);

    return () => {
      mainRight?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const comingOptions: Options[] = [];

  return (
    <DefaultLayout>
      <h1 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-content-xl2">
        Pending Posts Page
      </h1>
      <CardPosts
        ItemAdd="post"
        data={posts || []}
        deleteItem={mutateAsync}
        isLoading={isLoading}
        limit={limit}
        setLimit={setLimit}
        page={page}
        path=""
        comingOptions={comingOptions}
        pageName="post"
        deleteLoading={deleteLoading}
        handleAddLike={handleAddLike}
        isSuccess={isSuccess}
        setPage={setPage}
        publishPost={publishPost}
        publishLoading={publishLoading}
      />
    </DefaultLayout>
  );
};

export default PendingPosts;

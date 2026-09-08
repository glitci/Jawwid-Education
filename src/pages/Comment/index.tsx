import { useContext, useEffect, useRef, useState } from 'react';
import personIcon from '../../images/personIcon.png';
import { IoMdAdd } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../Api/axios';
import { COMMENTS, POSTS } from '../../Api/Api';
import { AiFillLike } from 'react-icons/ai';
import { CiMenuKebab } from 'react-icons/ci';
import OptionsMenu from '../../components/Tables/OptionsMenu';
import { Options } from '../../types/table';
import Skelton from './skelton';
import { UserContext } from '../../Context/loggedInUser';
import DefaultLayout from '../../layout/DefaultLayout';

import TimeAgo from 'react-timeago';
import { SinglePost } from '../../components/Card/SinglePost';
import { showSuccess } from '../../libs/ReactToastify';
import { adjustDateByHours } from '../../helpers/TransformDate';
import { REALUSER } from '../../Context/realUser';

const Comment = () => {
  const { loggedInUser } = useContext(UserContext);
  const { id } = useParams();
  // Menu Options Settings
  const [menuOpen, setMenuOpen] = useState<number | boolean>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const { realUser } = useContext(REALUSER);
  const [comments, setComments] = useState();

  const nav = useNavigate();

  const [page, setPage] = useState(1);

  const handleIconClick = (index: number) => {
    setMenuOpen(index);
    setIsOpen((prev) => !prev);
  };
  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };
  const queryClient = useQueryClient();

  const { data: posts, isLoading: isLoadingPost } = useQuery({
    queryKey: ['postsComment' + id],
    queryFn: () => Axios.get(`${POSTS}/${id}`),
  });
  const {
    mutateAsync: mutatePost,
    isLoading: deleteLoadingPost,
    isSuccess: isSuccessPost,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${POSTS}/${id}`),
    onSuccess: () => {
      nav('/');
      showSuccess('Post has deleted Successfully');
    },
  });

  const handleAddLikePost = async (id: string) => {
    try {
      Axios.put(`${POSTS}/${id}/like`);
    } catch (err) {
      console.log(err);
    }
  };

  // Comment Data

  const { data, isLoading } = useQuery({
    queryFn: () => Axios.get(`${COMMENTS}/post/${id}?page=1&limit=10`),
    queryKey: ['comments' + id],
    onSuccess: (data) => {
      setComments(data.data.comments);
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      console.log('first');
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    comments?.data?.comments?.map(
      (comment: any) =>
        comment.likes.users
          .map((user: any) => user._id)
          .includes(loggedInUser?._id) &&
        setLiked((prev) => [...prev, comment._id]),
    );
  }, [comments]);

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
          const res = await Axios.get(
            `${COMMENTS}/post/${id}?page=${page + 1}&limit=10`,
          );
          console.log(res.data);
          const newComments = res.data.comments;
          const currentPage = res.data.page;
          const totalPages = res.data.totalPages;
          if (currentPage > totalPages) {
            stopPagination = true;
          } else {
            setComments((prev) => [...prev, ...newComments]);
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

  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (id) => await Axios.delete(`${COMMENTS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments' + id]);
      setMenuOpen(false);
    },
  });
  const handleAddLike = async (id: string) => {
    try {
      Axios.put(`${COMMENTS}/${id}/like`);
    } catch (err) {
      console.log(err);
    }
  };
  const comingOptions: Options[] = [];

  console.log(posts?.data);

  return (
    <DefaultLayout>
      <SinglePost
        item={posts?.data.data}
        index={0}
        deleteItem={mutatePost}
        deleteLoading={deleteLoadingPost}
        handleAddLike={handleAddLikePost}
        isSuccess={isSuccessPost}
        comingOptions={comingOptions}
        isLoadingPost={isLoadingPost}
      />
      <div className="antialiased mt-5" ref={ref}>
        <div className="flex justify-between items-center mb-4">
          <h3 className=" text-lg font-semibold text-gray-900">Comments</h3>
          <div className="flex items-center gap-2 shadow-lg border rounded-full p-2 px-2 bg-white dark:bg-boxdark border-stroke dark:border-boxdark">
            <IoMdAdd />
            <Link to={`add`}>new comment</Link>
          </div>
        </div>
        <div className=" ">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skelton key={index} />
              ))
            : comments?.map((item: any, index: number) => (
                <div className="flex my-1 " key={index}>
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={`https://api.jawwid.com/users/` + item.author.image}
                      className="rounded-full"
                      width="50px"
                    />
                  </div>
                  <div className="flex-1 border bg-white dark:bg-boxdark border-stroke dark:border-boxdark shadow-lg my-1 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>{item?.author?.name}</strong>
                        <span className="text-xs ms-1">
                          <TimeAgo
                            minPeriod={60}
                            date={adjustDateByHours(item?.createdAt, 0)}
                          />
                        </span>
                      </div>
                      {(loggedInUser?._id === item?.author?._id ||
                        realUser === 'superAdmin' ||
                        realUser === 'admin') && (
                        <div className="relative flex items-center space-x-3.5">
                          <button
                            onClick={() => handleIconClick(index)}
                            onBlur={handleBlur}
                          >
                            <CiMenuKebab className="text-xl" />
                            {menuOpen === index && isOpen && (
                              <OptionsMenu
                                deleteItem={mutateAsync}
                                comingOptions={comingOptions}
                                id={item._id}
                                deleteLoading={deleteLoading}
                                role={item.role}
                                isSuccess={isSuccess}
                              />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-1">
                      <p
                        className="text-sm ql-editor"
                        dangerouslySetInnerHTML={{
                          __html: item?.content,
                        }}
                      ></p>
                      {item?.media && (
                        <div className="flex-shrink-0">
                          <img
                            className=" rounded border border-white w-18 h-18"
                            src={item?.media}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-start items-center  mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            handleAddLike(item._id);
                            setLiked((prev) =>
                              liked.includes(item._id)
                                ? liked.filter((i) => i !== item._id)
                                : [...prev, item._id],
                            );
                          }}
                          className={` gap-2 px-2 hover:bg-stroke hover:dark:text-black rounded-full p-1 ${
                            liked.includes(item._id)
                              ? 'text-blue-600'
                              : 'dark:text-white text-primary'
                          }`}
                        >
                          <AiFillLike className="text-xl" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        ({item?.likes?.count} Likes)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Comment;

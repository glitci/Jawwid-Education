import { useContext, useEffect, useState } from 'react';
import { adjustDateByHours } from '../../helpers/TransformDate';
import { UserContext } from '../../Context/loggedInUser';
import { REALUSER } from '../../Context/realUser';
import { CiMenuKebab } from 'react-icons/ci';
import OptionsMenu from '../Tables/OptionsMenu';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { AiFillLike } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { post } from '../../types/posts';
import Skelton from '../../pages/Posts/Skelton';
import TimeAgo from 'react-timeago';
import DeleteLoader from '../../common/DeleteLoader';

export const SinglePost: React.FC<post> = ({
  item,
  data,
  deleteItem,
  comingOptions,
  deleteLoading,
  handleAddLike,
  isSuccess,
  index,
  isLoadingPost,
  publishPost,
  publishLoading,
}) => {
  const { loggedInUser } = useContext(UserContext);
  const [liked, setLiked] = useState<number[]>([]);
  const { realUser } = useContext(REALUSER);

  const [selectedImageIndex, setSelectedImageIndex] = useState<any>(0);
  const [showSpecificLightBox, setShowSpecificLightBox] = useState<any>(false);

  const location = useLocation();
  const pathname = location.pathname;

  // Menu Options Settings
  const [menuOpen, setMenuOpen] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleIconClick = (index: number) => {
    setMenuOpen(index);
    setIsOpen((prev) => !prev);
  };
  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    data &&
      data?.map(
        (post) =>
          post.likes.users
            .map((user: any) => user._id)
            .includes(loggedInUser?._id) &&
          setLiked((prev) => [...prev, post._id]),
      );
  }, [data]);

  useEffect(() => {
    isSuccess && setIsOpen(false);
  }, [isSuccess]);

  return isLoadingPost ? (
    Array.from(Array(1)).map((_, sIndex) => <Skelton key={sIndex} />)
  ) : (
    <div className="bg-gray-3 border-stroke dark:bg-boxdark mx-2 my-2 p-8 rounded-lg shadow-xl">
      {/* User Info with Three-Dot Menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img src={item.author.image} className="rounded-full" width="50px" />
          <div>
            <p className="text-gray-800 font-semibold">{item?.author?.name}</p>
            <p className="text-gray-500 text-sm">
              <TimeAgo
                minPeriod={60}
                date={adjustDateByHours(item?.createdAt, 0)}
              />
            </p>
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer flex items-center gap-4">
          {(realUser === 'superAdmin' || realUser === 'admin') &&
            pathname.includes('pending') && (
              <button
                disabled={publishLoading}
                className="bg-success text-white rounded-3xl px-2 py-1 text-sm flex items-center gap-2"
                onClick={() => publishPost(item?._id)}
              >
                Publish Post {publishLoading && <DeleteLoader />}
              </button>
            )}
          {/* Three-dot menu icon */}
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
                    deleteItem={deleteItem}
                    comingOptions={comingOptions}
                    id={item?._id}
                    deleteLoading={deleteLoading}
                    role={item?.role}
                    isSuccess={isSuccess}
                    path={`/post/${item?._id}`}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* content */}
      <div className="mb-4 ">
        <p
          className="text-gray-800 ql-editor"
          dangerouslySetInnerHTML={{
            __html: item.content,
          }}
        ></p>
      </div>
      {/* Image */}
      <div className="mb-4  ">
        <div
          className="flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: item?.url }}
        />

        <div className="my-4">
          <div
            className={`${
              item?.media.length > 1
                ? ' grid grid-cols-2 md:grid-cols-3 gap-1'
                : 'md:w-1/2 w-full mx-auto'
            }`}
          >
            {item?.media
              ?.slice(0, item?.media?.length > 4 ? 3 : item?.media?.length)
              .map((img: any, imgIndex: number) =>
                img?.type === 'image' ? (
                  <img
                    key={imgIndex}
                    src={img?.url}
                    className="h-auto max-w-full rounded-lg object-cover"
                    onClick={() => {
                      setSelectedImageIndex(imgIndex);
                      setShowSpecificLightBox(index);
                    }}
                  />
                ) : (
                  <video
                    className="h-auto max-w-full rounded-lg object-cover opacity-40"
                    controls
                    key={imgIndex}
                    onClick={() => {
                      setSelectedImageIndex(imgIndex);
                      setShowSpecificLightBox(index);
                    }}
                  >
                    <source src={img?.url} type={img?.type} />
                    Your browser does not support the video tag.
                  </video>
                ),
              )}
            {item?.media?.length > 4 && (
              <div className="relative">
                {item?.media?.slice(3, 4).map((img: any, imageIndex: number) =>
                  img?.type === 'image' ? (
                    <img
                      key={imageIndex}
                      src={img?.url}
                      className="h-auto max-w-full rounded-lg object-cover opacity-40"
                      onClick={() => {
                        setSelectedImageIndex(3);
                        setShowSpecificLightBox(index);
                      }}
                    />
                  ) : (
                    <video
                      className="h-auto max-w-full rounded-lg object-cover opacity-40"
                      controls
                      key={imageIndex}
                      onClick={() => {
                        setSelectedImageIndex(3);
                        setShowSpecificLightBox(index);
                      }}
                    >
                      <source src={img?.url} type={img?.type} />
                      Your browser does not support the video tag.
                    </video>
                  ),
                )}
                <div
                  className="h-auto max-w-full rounded-lg object-cover flex items-center justify-center text-white text-xl  font-semibold bg-black bg-opacity-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1"
                  style={{
                    position: 'absolute',
                  }}
                >
                  +{item?.media?.length - 4} images
                </div>
              </div>
            )}
          </div>
          {showSpecificLightBox === index && (
            <Lightbox
              open={index === showSpecificLightBox}
              plugins={[
                Captions,
                Fullscreen,
                Slideshow,
                Thumbnails,
                Video,
                Zoom,
              ]}
              index={selectedImageIndex}
              close={() => setShowSpecificLightBox(false)}
              slides={item?.media?.map(
                (img: { url: string; type: string }) => ({
                  src: img?.url,
                  type: img?.type,
                  sources: [
                    {
                      src: img.url,
                    },
                  ],
                }),
              )}
            />
          )}
        </div>
      </div>

      {/* Like and Comment Section */}
      {!pathname.includes('pending') && (
        <div className="flex items-center justify-between text-gray-500 mt-5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                handleAddLike(item?._id);
                setLiked((prev) =>
                  liked.includes(item?._id)
                    ? liked.filter((i) => i !== item?._id)
                    : [...prev, item._id],
                );
              }}
              className={`flex justify-center items-center gap-2 px-2 hover:bg-stroke hover:dark:text-black rounded-full p-1 ${
                liked.includes(item?._id)
                  ? 'text-blue-600'
                  : 'dark:text-white text-primary'
              }`}
            >
              <AiFillLike className="text-xl" />
              <span>
                <span>{item?.likes?.count}</span>
                Likes
              </span>
            </button>
          </div>

          <Link
            to={
              pathname.includes('comments/post')
                ? ''
                : `comments/post/${item?._id}`
            }
            className="flex justify-center items-center gap-2 px-2 dark:text-white text-primary hover:bg-stroke hover:dark:text-black rounded-full p-1"
          >
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
                />
              </g>
            </svg>
            <span>{item?.comments?.length} Comment</span>
          </Link>
        </div>
      )}
    </div>
  );
};

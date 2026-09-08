import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LMSHeaderProps } from '../../types/table';
import { IoMdAdd } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import Skelton from '../../pages/Posts/Skelton';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { SinglePost } from './SinglePost';

import { REALUSER } from '../../Context/realUser';

const CardPosts: React.FC<LMSHeaderProps> = ({
  ItemAdd,
  limit,
  data,
  isLoading,
  deleteItem,
  comingOptions,
  deleteLoading,
  handleAddLike,
  isSuccess,
  publishPost,
  publishLoading,
}) => {
  // Filter Settings
  const [search, setSearch] = useState<string>('');
  const handleSearch = (e: any) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredData = data?.filter((item) => {
    return Object.values(item).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(search),
    );
  });

  const { realUser } = useContext(REALUSER);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <div className=" m-2 mb-5 rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
        <div className="flex justify-between items-center">
          {!pathname.includes('pending') && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 border rounded p-1 px-2 border-stroke dark:border-form-strokedark">
                <IoMdAdd />
                <Link to={`add`}>add {ItemAdd}</Link>
              </div>

              {(realUser === 'superAdmin' || realUser === 'admin') && (
                <Link
                  to={'/pending'}
                  className="border rounded p-1 px-2 border-stroke dark:border-form-strokedark"
                >
                  Pending Posts
                </Link>
              )}
            </div>
          )}
          <div className="flex gap-2 px-1 items-center flex-wrap">
            <div className="flex items-center gap-2 border border-stroke p-1 px-3 rounded ">
              <FaSearch />
              <input
                placeholder="search"
                className="outline-none bg-inherit"
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 rounded">
        {isLoading
          ? Array.from(Array(limit)).map((_, sIndex) => (
              <Skelton key={sIndex} />
            ))
          : filteredData.map((item: any, index) => (
              <SinglePost
                item={item}
                index={index}
                data={data}
                deleteItem={deleteItem}
                deleteLoading={deleteLoading}
                handleAddLike={handleAddLike}
                isSuccess={isSuccess}
                comingOptions={comingOptions}
                publishPost={publishPost}
                publishLoading={publishLoading}
              />
            ))}
      </div>
    </>
  );
};

export default CardPosts;

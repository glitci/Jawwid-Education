import React, { useState, useContext, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { LMSHeaderProps } from '../../types/table';
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import OptionsMenu from '../Tables/OptionsMenu';
import { REALUSER } from '../../Context/realUser';
import PaginatedItems from '../Pagination/Pagination';

const LMSHeader: React.FC<LMSHeaderProps> = ({
  ItemAdd,
  limit,
  setLimit,
  page,
  setPage,
  data,
  isLoading,
  deleteItem,
  comingOptions,
  deleteLoading,
  path,
  pageName,
  totalPages,
  isSuccess,
}) => {
  const navigate = useNavigate();
  const { realUser } = useContext(REALUSER);
  // Filter Settings
  const [search, setSearch] = useState<string>('');
  const handleSearch = (e: any) => {
    setSearch(e.target.value.toLowerCase());
  };

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

  const filteredData = data?.filter((item) => {
    return Object.values(item).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(search),
    );
  });

  // Close Menu
  useEffect(() => {
    isSuccess && setIsOpen(false);
  }, [isSuccess]);

  const loadingSkeleton = (
    <div className="animate-pulse">
      <div className="mb-2 cursor-pointer rounded-2xl shadow-xl bg-white dark:bg-form-strokedark">
        <div className="relative">
          <div className="h-72 w-full bg-stroke rounded-t-2xl"></div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-">
            <h5 className="mb-2 text-lg font-bold tracking-tight bg-stroke  rounded w-3/4"></h5>
            <div className="relative flex items-center space-x-3.5 ">
              <div className="text-xl bg-stroke mb-2 rounded-full h-10 w-10 flex items-center justify-center"></div>
            </div>
          </div>
          <div>
            <p className="mb-3 font-normal bg-stroke  rounded h-6"></p>
            <p className="mb-3 font-normal bg-stroke  rounded h-6"></p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className=" m-2 mb-5 rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
        <div className="flex justify-between items-center">
          {(realUser === 'admin' || realUser === 'superAdmin') && (
            <div className="flex items-center gap-3 border rounded p-1 px-2 border-stroke dark:border-form-strokedark">
              <IoMdAdd />
              <Link to={`add`}>add {ItemAdd}</Link>
            </div>
          )}
          <div className="flex flex-1 gap-2 px-1 justify-end items-center flex-wrap">
            <label
              htmlFor="select"
              className="border-2 border-stroke p-2 rounded cursor-pointer"
            >
              <select
                id="select"
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="bg-white dark:bg-strokedark cursor-pointer outline-none"
                defaultValue={limit}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </select>
            </label>
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
      <div className="mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch text-xs md:text-sm lg:text-sm xl:text-base ">
        {isLoading
          ? Array.from(Array(limit)).map((_) => loadingSkeleton)
          : filteredData?.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  (realUser === 'superAdmin' || realUser === 'admin') && path
                    ? navigate(`${item._id}/show`)
                    : realUser === 'student' && ItemAdd === 'product'
                    ? navigate(`${item._id}/powerpoint`)
                    : ''
                }
                className={`mb-2 ${
                  (realUser === 'superAdmin' || realUser === 'admin') &&
                  'cursor-pointer'
                }  rounded-2xl shadow-xl bg-stroke dark:border-gray-700 dark:bg-form-strokedark overflow-hidden`}
              >
                <div
                  className="relative w-[full] h-[300px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: item?.course_link }}
                ></div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.title}
                    </h5>
                    {(realUser === 'admin' || realUser === 'superAdmin') && (
                      <div className="relative  flex items-center space-x-3.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconClick(index);
                          }}
                          onBlur={handleBlur}
                        >
                          <CiMenuKebab className="text-xl" />
                          {menuOpen === index && isOpen && (
                            <OptionsMenu
                              deleteItem={deleteItem}
                              id={item._id}
                              comingOptions={comingOptions}
                              deleteLoading={deleteLoading}
                              isSuccess={isSuccess}
                            />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <PaginatedItems
        data={data}
        itemsPerPage={limit}
        setPage={setPage}
        totalPages={totalPages || 0}
      />
    </>
  );
};

export default LMSHeader;

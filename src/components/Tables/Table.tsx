import React, { useContext, useEffect, useMemo, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { CiMenuKebab } from 'react-icons/ci';
import {
  FaBarsProgress,
  FaCircleCheck,
  FaFilter,
  FaList,
  FaSortDown,
  FaSortUp,
} from 'react-icons/fa6';
import { VscListSelection } from 'react-icons/vsc';
import PaginatedItems from '../Pagination/Pagination';
import OptionsMenu from './OptionsMenu';
import { FaSort } from 'react-icons/fa';
import CardView from '../Card/CardView';
import FilterComponent from './FilterInputs';
import CheckNamePage from './CheckNamePage';
import { TableProps } from '../../types/table';
import { Link, useNavigate } from 'react-router-dom';
import TransformDate, {
  adjustStartTime,
  adjustStartTimeWithOffset,
  shouldShowZoomLink,
} from '../../helpers/TransformDate';
import { TABLECARDVIEW } from '../../Context/tableView';
import { IoCloseCircle } from 'react-icons/io5';
import Delete from './Delete';
import { REALUSER } from '../../Context/realUser';
import { FaCalendarCheck } from 'react-icons/fa';
import { MdOutlineMessage, MdOutlineSchedule } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { UserContext } from '../../Context/loggedInUser';
const Table: React.FC<TableProps> = ({
  header,
  data,
  ItemAdd,
  multiClass,
  limit,
  page,
  setPage,
  setLimit,
  filterInputs,
  isLoading,
  deleteItem,
  cancelItem,
  comingOptions,
  deleteLoading,
  optionsExists,
  isSuccess,
  totalPages,
  search,
  setSearch,
  handleSend,
  openChat,
  handleRefetch,
  handleClose,
  hideFilter,
  hideOptions,
  checkIn,
  checkOut,
  changeClass,
}) => {
  const navigate = useNavigate();

  const { realUser } = useContext(REALUSER);
  const { loggedInUser } = useContext(UserContext);

  // When Click On CardView
  const { view, setView } = useContext(TABLECARDVIEW);

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
    isSuccess && setIsOpen(false);
  }, [isSuccess]);

  // Filter Settings
  const [openFitler, setOpenFilter] = useState<boolean>(false);

  const handleChange = (value: string, header: string) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [header]: value.toLowerCase(),
    }));
  };

  // Sort Settings
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const dataS = data?.length > 0 ? [...data] : [];
    return dataS?.sort((a, b) => {
      const valueA = a?.[sortColumn];
      const valueB = b?.[sortColumn];
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'desc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  // Headers Tables
  const headers = header?.map((item, key) => (
    <th
      key={key}
      className="py-6 text-sm font-medium text-black dark:text-white cursor-pointer px-3 text-center"
      onClick={() => handleSort(item.key)}
    >
      <div className="flex items-center gap-2 justify-start">
        {item.name}
        {sortColumn === item?.key ? (
          <>{sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}</>
        ) : (
          <FaSort />
        )}
      </div>
    </th>
  ));

  // Skelton Tawilwind
  const skeletonRow = (
    <tr role="status" className="animate-pulse">
      {Array.from({ length: header.length + 1 }).map((_, index) => (
        <td
          key={index}
          className="border-b border-[#eee] py-6 px-2 dark:border-strokedark"
        >
          <div className="h-7 mt-5 rounded bg-slate-200 dark:bg-slate-500 w-32 "></div>
        </td>
      ))}
    </tr>
  );

  // Data Tables
  const dataShow = !isLoading
    ? sortedData?.map((item, index) => (
        <tr key={index}>
          {header?.map((column, key) => (
            <td
              key={key}
              onClick={() =>
                ItemAdd === 'session' ? navigate(`students`) : null
              }
              className="border-b border-[#eee] py-6 px-4 dark:border-strokedark"
            >
              {/* Test Some Column For Change Design */}
              {key === 0 ? (
                <>
                  {item[column.key] && (
                    <div className="flex items-center gap-1 justify-start truncate">
                      <CheckNamePage NamePage={ItemAdd} />
                      <p className="text-black dark:text-white">
                        {column.key === 'assignmentFile' ? (
                          <a href={item[column.key]} className="text-blue-600">
                            {item[column.key]}
                          </a>
                        ) : (
                          <span className="text-black dark:text-white">
                            {column.key === 'teacher'
                              ? item[column.key]?.name
                              : item[column.key]}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </>
              ) : column.key === 'createdAt' || column.key === 'created_at' ? (
                <p className="text-black dark:text-white">
                  {TransformDate(item[column.key])}
                </p>
              ) : column.key === 'image' ? (
                <img src={item[column.key]} width="40px" />
              ) : column.key === 'materialFile' ? (
                <span>
                  Click To Opne{' '}
                  <a
                    href={item[column.key]}
                    target="_blank"
                    className="underline text-primary font-semibold"
                  >
                    File
                  </a>
                </span>
              ) : column.key === 'active' ? (
                item[column.key] ? (
                  <FaCircleCheck className="text-success" />
                ) : (
                  <IoCloseCircle className="text-danger" />
                )
              ) : column.key === 'teacher' || column.key === 'student' ? (
                <p className="text-black dark:text-white">
                  {item[column.key]?.name}
                </p>
              ) : column.name === 'Number Of Questions' ? (
                <p className="text-primary dark:text-white">
                  ( {data[index]?.questions?.length} )
                </p>
              ) : column.name === 'Number Of Q&A' ? (
                <p className="text-primary dark:text-white">
                  ( {data[index]?.answers?.length} )
                </p>
              ) : column.name === 'Progress' ? (
                <div className="h-6 mt-1 px-3 rounded-full bg-slate-200 w-44">
                  {item[column.key]}
                </div>
              ) : column.name === 'Details' ? (
                <div
                  className="text-xl cursor-pointer"
                  onClick={() => navigate(`${item[column.key]}`)}
                >
                  <FaEye />
                </div>
              ) : column.name === 'isWorked' ? (
                <div className="flex justify-between gap-1">
                  <div className="rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                    work
                  </div>
                  <div className="rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-danger text-danger">
                    Free
                  </div>
                </div>
              ) : column.key === 'classZoomLink' ? (
                item.status === 'ended' && realUser === 'teacher' ? (
                  <p
                    onClick={() => checkOut(item?._id, item[column.key])}
                    className="text-blue-600 cursor-pointer"
                  >
                    Check Out
                  </p>
                ) : item.status === 'ended' && realUser !== 'teacher' ? (
                  'Class Ended'
                ) : (
                  shouldShowZoomLink(
                    item?.start_time,
                    item?.start_date,
                    loggedInUser?.timezone,
                  ) && (
                    <p
                      onClick={() => checkIn(item?._id, item[column.key])}
                      className="text-blue-600 cursor-pointer"
                    >
                      Go To Zoom Link
                    </p>
                  )
                )
              ) : column.key === 'duration' ? (
                item[column.key] + 'minutes'
              ) : column.key === 'invoice_url' ||
                column.key === 'receipt_url' ? (
                <a
                  href={item[column.key]}
                  target="_blank"
                  className="text-blue-600 cursor-pointer"
                >
                  Click Here
                </a>
              ) : column.key === 'invoice_pdf' ? (
                <a
                  href={item[column.key]}
                  target="_blank"
                  className="text-white text-sm cursor-pointer bg-primary rounded p-1"
                >
                  Download
                </a>
              ) : column.key === 'start_time' ? (
                <p className="text-black dark:text-white ">
                  {
                    adjustStartTimeWithOffset(
                      item[column.key],
                      item?.start_date,
                      loggedInUser?.timezone,
                    )?.adjustedTime
                  }
                </p>
              ) : column.key === 'start_date' ? (
                <p className="text-black dark:text-white ">
                  {
                    adjustStartTimeWithOffset(
                      item?.start_time,
                      item[column.key],
                      loggedInUser?.timezone,
                    )?.adjustedDate
                  }
                </p>
              ) : (
                <p className="text-black dark:text-white ">
                  {item[column.key]}
                </p>
              )}
            </td>
          ))}
          {/* Menu Options */}

          {ItemAdd !== 'assignment' && ItemAdd !== 'report' && !hideOptions && (
            <>
              {realUser === 'student' && item.status === 'ended' ? (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                  <div className="flex items-center justify-center gap-4">
                    <MdOutlineMessage
                      className="cursor-pointer"
                      fontSize={'20px'}
                      onClick={() => openChat(item._id)}
                    />

                    <FaEye
                      className="cursor-pointer"
                      fontSize={'20px'}
                      onClick={() => navigate(`/classes/${item._id}/manage`)}
                    />
                  </div>
                </td>
              ) : (realUser === 'student' || realUser === 'guest') &&
                (item.status === 'scheduled' || item.status === 'trial') ? (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <FaEye
                    className="cursor-pointer"
                    fontSize={'20px'}
                    onClick={() => navigate(`/classes/${item?._id}/manage`)}
                  />
                </td>
              ) : realUser === 'student' && item.status !== 'ended' ? (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"></td>
              ) : optionsExists !== false && item.status !== 'cancelled' ? (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="relative flex items-center justify-center space-x-3.5">
                    <button
                      onClick={() => handleIconClick(index)}
                      onBlur={handleBlur}
                    >
                      <CiMenuKebab className="text-xl" />
                      {menuOpen === index && isOpen && (
                        <OptionsMenu
                          deleteItem={deleteItem}
                          cancelItem={cancelItem}
                          comingOptions={comingOptions}
                          id={item._id}
                          deleteLoading={deleteLoading}
                          role={item.role}
                          isSuccess={isSuccess}
                          isActive={item?.active}
                          classStatus={changeClass}
                        />
                      )}
                    </button>
                  </div>
                </td>
              ) : item.status === 'cancelled' ? (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark "></td>
              ) : (
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                  <Delete
                    deleteItem={deleteItem}
                    deleteLoading={deleteLoading}
                    id={item._id}
                    isSuccess={isSuccess}
                  />
                </td>
              )}{' '}
            </>
          )}
        </tr>
      ))
    : Array.from({ length: limit }).map(() => skeletonRow);

  return (
    <>
      {view === 'cardView' ? (
        <CardView
          ItemAdd={ItemAdd}
          limit={limit}
          setLimit={setLimit}
          data={data}
          header={header}
          page={page}
          setPage={setPage}
          deleteItem={deleteItem}
          comingOptions={comingOptions}
          deleteLoading={deleteLoading}
          optionsExists={optionsExists}
          isSuccess={isSuccess}
          isLoading={isLoading}
          totalPages={totalPages}
        />
      ) : (
        <div className="rounded border border-stroke dark:text-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 text-xs md:text-sm lg:text-sm xl:text-base ">
          <div className="max-w-full overflow-x-auto">
            {/* Above Table Section */}
            <div className="flex justify-between flex-wrap gap-3 items-center py-6">
              {/* Add Button */}

              {ItemAdd === 'assignment' ? (
                <div className="font-bold text-lg">
                  {realUser === 'student'
                    ? 'My Assignments'
                    : 'All Assignments'}
                </div>
              ) : ItemAdd === 'class' || ItemAdd === 'Trail Class' ? (
                <div className="flex gap-2 ">
                  {(realUser === 'admin' || realUser === 'superAdmin') && (
                    <>
                      <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                        <IoMdAdd />
                        <Link to={`add`}>Add {ItemAdd}</Link>
                      </div>{' '}
                      {multiClass && (
                        <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                          <IoMdAdd />
                          <Link to={`addMultiClasses`}>
                            Add Multiple Classes
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                  {realUser !== 'guest' && (
                    <>
                      <div
                        onClick={() => handleRefetch('scheduled')}
                        className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark cursor-pointer"
                      >
                        <MdOutlineSchedule />
                        <h2>Scheduled</h2>
                      </div>{' '}
                    </>
                  )}
                  <div
                    onClick={() => handleRefetch('trial')}
                    className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark cursor-pointer"
                  >
                    <FaBarsProgress />
                    <h2>Trial</h2>
                  </div>
                  {realUser !== 'guest' && (
                    <div
                      onClick={() => handleRefetch('ended')}
                      className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark cursor-pointer"
                    >
                      <FaCalendarCheck />
                      <h2>Ended</h2>
                    </div>
                  )}
                </div>
              ) : ItemAdd === 'invoices' ? (
                <>
                  <div
                    onClick={() => handleRefetch('monthly')}
                    className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark cursor-pointer"
                  >
                    <FaCalendarCheck />
                    <h2>Monthly</h2>
                  </div>
                  <div
                    onClick={() => handleRefetch('one-time')}
                    className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark cursor-pointer"
                  >
                    <FaCalendarCheck />
                    <h2>One Time</h2>
                  </div>
                </>
              ) : ItemAdd === 'report' ? (
                realUser === 'teacher' && (
                  <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                    <IoMdAdd />
                    <Link to={`add`}>Add {ItemAdd}</Link>
                  </div>
                )
              ) : (
                ItemAdd &&
                (realUser === 'admin' || realUser === 'superAdmin') && (
                  <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                    <IoMdAdd />
                    <Link to={`add`}>Add {ItemAdd}</Link>
                  </div>
                )
              )}

              <div className="flex items-center justify-end flex-1 gap-4 px-1 w-fit">
                {/* Select limit pagination */}
                <label
                  htmlFor="select"
                  className="border-2 border-stroke p-2 rounded cursor-pointer"
                >
                  <select
                    id="select"
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="bg-white dark:bg-boxdark cursor-pointer outline-none"
                    defaultValue={limit}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                  </select>
                </label>
                {/* Filter */}
                {!hideFilter && (
                  <button onClick={() => setOpenFilter((prev) => !prev)}>
                    <div
                      className={`flex items-center gap-2 border-2 border-stroke p-2 rounded cursor-pointer ${
                        openFitler ? 'bg-stroke dark:bg-form-strokedark' : ''
                      }`}
                    >
                      <FaFilter />
                      filter
                    </div>
                  </button>
                )}
                {/* List View */}
                <div className="flex items-center gap-2 border-2 border-stroke p-2 rounded bg-stroke dark:bg-form-strokedark cursor-pointer">
                  <FaList />
                  List View
                </div>
                {/* Card View */}
                <div
                  onClick={() => setView('cardView')}
                  className="flex items-center gap-2 border-2 border-stroke p-2 rounded cursor-pointer"
                >
                  <VscListSelection />
                  Card View
                </div>
              </div>
            </div>
            {/* Table Section */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2  dark:bg-meta-4">
                  {headers}
                  {ItemAdd !== 'assignment' && ItemAdd !== 'report' && (
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Options
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {openFitler && (
                  <td colSpan={8}>
                    <div className="grid gap-3 mt-2 mb-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                      {filterInputs?.map((input, index) => (
                        <FilterComponent
                          key={index}
                          filter={[input]}
                          onChange={handleChange}
                        />
                      ))}
                      <div className="col-span-full text-center mt-4">
                        <button
                          onClick={handleSend}
                          className="px-4 py-2 bg-primary text-white rounded-lg focus:outline-none hover:bg-blue-600"
                        >
                          Search
                        </button>
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 bg-transparent text-strokedark border ms-3 border-strokedark rounded-lg focus:outline-none "
                        >
                          Close
                        </button>
                      </div>{' '}
                    </div>
                  </td>
                )}

                {dataShow}
              </tbody>
            </table>
            {/* Pagination Section */}
            <PaginatedItems
              itemsPerPage={limit}
              data={data}
              setPage={setPage}
              totalPages={totalPages || 0}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Table;

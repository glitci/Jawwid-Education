import { useContext, useEffect, useState } from 'react';
import OptionsMenu from '../Tables/OptionsMenu';
import { CiMenuKebab } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import { VscListSelection } from 'react-icons/vsc';
import { FaCalendarCheck, FaEye, FaList } from 'react-icons/fa6';
import CheckNamePage from '../Tables/CheckNamePage';
import PaginatedItems from '../Pagination/Pagination';
import { TableProps } from '../../types/table';
import { TABLECARDVIEW } from '../../Context/tableView';
import { Link, useNavigate } from 'react-router-dom';
import TransformDate, {
  adjustStartTimeWithOffset,
} from '../../helpers/TransformDate';
import Delete from '../Tables/Delete';
import SkeltonCardView from './SkeltonCardView';
import { REALUSER } from '../../Context/realUser';
import { MdOutlineSchedule } from 'react-icons/md';
import { UserContext } from '../../Context/loggedInUser';

const CardView: React.FC<TableProps> = ({
  header,
  data,
  ItemAdd,
  limit,
  page,
  setPage,
  setLimit,
  isLoading,
  deleteItem,
  cancelItem,
  comingOptions,
  deleteLoading,
  optionsExists,
  isSuccess,
  totalPages,
}) => {
  const navigate = useNavigate();
  const { realUser } = useContext(REALUSER);
  // When Click On TableView
  const { setView } = useContext(TABLECARDVIEW);
  const { loggedInUser } = useContext(UserContext);
  // Menu Options Settings
  const [menuOpen, setMenuOpen] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleIconClick = (index: number) => {
    setMenuOpen(index);
    setIsOpen((prev) => !prev);
  };

  // Close Option Menu

  useEffect(() => {
    isSuccess && setIsOpen(false);
  }, [isSuccess]);

  // Filter Settings
  const [search, setSearch] = useState<string>('');

  const handleSearch = (e: any) => {
    setSearch(e.target.value.toLowerCase());
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
  return (
    <>
      <div className=" m-2 mb-5 rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
        <div className="flex justify-between items-center ">
          {ItemAdd === 'assignment' ? (
            <div className="font-bold text-lg">
              {realUser === 'student' ? 'My Assignments' : 'All Assignments'}
            </div>
          ) : ItemAdd === 'class' && realUser === 'student' ? (
            <div className="flex gap-2">
              <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                <MdOutlineSchedule />
                <Link to={`/classes/scheduled`}>Scheduled</Link>
              </div>
              <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                <FaCalendarCheck />
                <Link to={`/classes/ended`}>Ended</Link>
              </div>
            </div>
          ) : ItemAdd === 'report' ? (
            realUser === 'teacher' && (
              <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                <IoMdAdd />
                <Link to={`add`}>Add {ItemAdd}</Link>
              </div>
            )
          ) : (
            (realUser === 'admin' || realUser === 'superAdmin') &&
            ItemAdd && (
              <div className="flex items-center gap-3 border rounded p-2 px-2 border-stroke dark:border-form-strokedark">
                <IoMdAdd />
                <Link to={`add`}>Add {ItemAdd}</Link>
              </div>
            )
          )}
          <div className="flex items-center justify-end flex-1 gap-4 px-1 w-fit">
            <label
              htmlFor="select"
              className="border-2 border-stroke p-1 rounded cursor-pointer"
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
            <div onClick={() => setView('tableView')}>
              <FaList className="cursor-pointer" />
            </div>
            <VscListSelection className="cursor-pointer dark:text-white text-black-2 font-extrabold text-xl animate-none" />
          </div>
        </div>
      </div>
      {isLoading
        ? Array.from({ length: limit }).map((_) => <SkeltonCardView />)
        : filteredData?.map((item, index) => (
            <div
              key={index}
              className="m-2 mb-5 rounded bg-white p-6 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5 mb-2 leading-6 text-black dark:text-white">
                  <CheckNamePage NamePage={ItemAdd} />
                  <div className="flex items-center">
                    {header.map((column, key) => (
                      <div key={key}>
                        {(column.name === 'Title' ||
                          column.name === 'Staff' ||
                          column.name === 'Circle' ||
                          column.name === 'Name') && (
                          <div>{item[column.key]}</div>
                        )}
                      </div>
                    ))}
                    {header.map((column, key) => (
                      <div
                        key={key}
                        className="rounded-full text-green-600 bg-slate-100 px-3  my-0.5 w-fit dark:bg-slate-500 dark:text-green-300"
                      >
                        {(column.name === 'Type' ||
                          column.name === 'Status' ||
                          column.name === 'Role') && (
                          <div>{item[column.key]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {ItemAdd !== 'assignment' && ItemAdd !== 'report' && (
                  <>
                    {optionsExists !== false && item.status !== 'cancelled' ? (
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="relative flex items-center space-x-3.5">
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
              </div>

              <div className="border border-stroke dark:border-form-strokedark my-2"></div>
              <div className="flex justify-between  text-black dark:text-white">
                <div className="flex flex-col leading-7 pb-2 pt-2.5 border-l-4 pl-4">
                  {header.map((column, key) => (
                    <div key={key}>
                      {column.name !== 'Invoice' &&
                        column.name !== 'Estimate' &&
                        column.name !== 'Title' &&
                        column.name !== 'Staff' &&
                        column.name !== 'Circle' &&
                        column.name !== 'Role' &&
                        column.name !== 'Status' &&
                        column.name !== 'Type' &&
                        column.name !== 'Due Date' &&
                        column.name !== 'Name' &&
                        (column.key === 'createdAt' ? (
                          <div className="text-red-500">
                            {column.name}
                            {': '}
                            {TransformDate(item[column.key])}
                          </div>
                        ) : column.key === 'teacher' ||
                          column.key === 'student' ? (
                          <p className="text-black dark:text-white">
                            {item[column.key]?.name}
                          </p>
                        ) : column.name === 'Number Of Questions' ? (
                          <p className="text-primary dark:text-white">
                            Number Of Questions : ({' '}
                            {data[index]?.questions?.length} )
                          </p>
                        ) : column.name === 'Number Of Q&A' ? (
                          <p className="text-primary dark:text-white">
                            Number Of Answers : ( {data[index]?.answers?.length}{' '}
                            )
                          </p>
                        ) : column.key === 'image' ? (
                          <img
                            src={item[column.key]}
                            width="300px"
                            className="object-fit-cover"
                          />
                        ) : column.key === 'materialFile' ? (
                          <span>
                            PDF File: Click To Open{' '}
                            <a
                              href={item[column.key]}
                              className="font-semibold underline"
                            >
                              File
                            </a>
                          </span>
                        ) : column.name === 'Progress' ? (
                          <div
                            key={key}
                            className="h-6 mt-1 px-3 rounded-full bg-slate-200 w-full"
                          >
                            {item[column.key]}
                          </div>
                        ) : column.name === 'Zoom Link' ? (
                          <a href={item[column.key]} className="text-blue-500">
                            {column.name} : Go To Zoom Link
                          </a>
                        ) : column.name === 'Details' ? (
                          <div
                            className=""
                            onClick={() => navigate(`${item[column.key]}`)}
                          >
                            {' '}
                            Details This Report:
                            <FaEye className=" inline-flex mx-2 text-xl cursor-pointer" />
                          </div>
                        ) : column.name === 'Assignment File' ? (
                          <>
                            {column.name}:{' '}
                            <a
                              href={item[column.key]}
                              className="text-blue-500"
                            >
                              {item[column.key]}
                            </a>
                          </>
                        ) : column.key === 'start_date' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">
                              {' '}
                              {column.name} :
                            </span>
                            <p className="text-black dark:text-white font-bold">
                              {
                                adjustStartTimeWithOffset(
                                  item?.start_time,
                                  item[column.key],
                                  loggedInUser?.timezone,
                                )?.adjustedDate
                              }
                            </p>
                          </div>
                        ) : column.key === 'start_time' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">
                              {column.name} :
                            </span>
                            <p className="text-black dark:text-white font-bold">
                              {
                                adjustStartTimeWithOffset(
                                  item[column.key],
                                  item?.start_date,
                                  loggedInUser?.timezone,
                                )?.adjustedTime
                              }
                            </p>
                          </div>
                        ) : (
                          <div>
                            {column.name}
                            {': '}
                            {item[column.key]}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      <PaginatedItems
        data={data}
        itemsPerPage={limit}
        setPage={setPage}
        totalPages={totalPages || 0}
      />
    </>
  );
};

export default CardView;

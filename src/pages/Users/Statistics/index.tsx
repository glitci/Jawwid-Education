import UsersLayout from '../../../layout/UsersLayout';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { USERS } from '../../../Api/Api';
import { Axios } from '../../../Api/axios';
import { FcStatistics } from 'react-icons/fc';
import {
  MdOutlineCancelPresentation,
  MdOutlineFreeCancellation,
} from 'react-icons/md';
import { FaCalendarCheck } from 'react-icons/fa';
import { MdOutlineSchedule } from 'react-icons/md';
import Loader from '../../../common/Loader';
import { useState } from 'react';

const Statistics = () => {
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  const { id } = useParams();
  const [date, setDate] = useState(getFormattedDate());
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { data, isLoading } = useQuery({
    queryFn: () => Axios.get(`${USERS}/${id}`),
    queryKey: ['teacher-statistics' + id],
  });

  const statistics = data?.data?.data;
  const filterDates = statistics?.classes?.filter(
    (st) => st.year === year && st.month === month,
  );

  console.log(filterDates);

  return (
    <UsersLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" m-2 mb-5 h-[100vh] rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
          <div className="w-full text-form-strokedark p-4 h-80">
            <h2 className="mb-9 text-2xl font-extrabold  text-black dark:text-white sm:text-title-xl2">
              <FcStatistics className="inline-block me-5" />
              Statistics For {statistics?.name} :
            </h2>
            <hr className="h-5 border-stroke dark:border-form-strokedark" />
            <div className="m-5 w-full">
              <div className="mb-4">
                <label htmlFor="date" className="me-3 dark:text-white">
                  Choose Date:
                </label>
                <input
                  type="month"
                  id="date"
                  value={date}
                  onFocus={(e) => e.target.showPicker()}
                  onClick={(e) => e.target.showPicker()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setYear(new Date(e.target.value).getFullYear());
                    setMonth(new Date(e.target.value).getMonth() + 1);
                  }}
                  className="border border-black border-opacity-20 rounded-sm p-1 dark:bg-strokedark dark:text-white dark:border-white dark:border-opacity-30"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold dark:text-white ">
                <FaCalendarCheck className="inline-block me-5" />
                completed Classes:{' '}
                <span className="text-green-500">
                  ({' '}
                  {filterDates?.[0]?.classesByStatus?.filter(
                    (cl: any) => cl.status === 'ended',
                  )?.[0]?.count || 0}{' '}
                  )
                </span>
              </h3>
              <h3 className="mb-4 text-xl font-bold dark:text-white ">
                <MdOutlineSchedule className="inline-block me-5" />
                scheduled Classes:
                <span className="text-blue-500">
                  ({' '}
                  {filterDates?.[0]?.classesByStatus?.filter(
                    (cl: any) => cl.status === 'scheduled',
                  )?.[0]?.count || 0}{' '}
                  )
                </span>
              </h3>
              <h3 className="mb-4 text-xl font-bold dark:text-white ">
                <MdOutlineCancelPresentation className="inline-block me-5" />
                cancelled Classes:
                <span className="text-red-500">
                  ({' '}
                  {filterDates?.[0]?.classesByStatus?.filter(
                    (cl: any) => cl.status === 'cancelled',
                  )?.[0]?.count || 0}{' '}
                  )
                </span>
              </h3>{' '}
              <h3 className="mb-4 text-xl font-bold dark:text-white ">
                <MdOutlineFreeCancellation className="inline-block me-5" />
                Trial Classes:
                <span className="text-red-500">
                  ({' '}
                  {filterDates?.[0]?.classesByStatus?.filter(
                    (cl: any) => cl.status === 'trial',
                  )?.[0]?.count || 0}{' '}
                  )
                </span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </UsersLayout>
  );
};

export default Statistics;

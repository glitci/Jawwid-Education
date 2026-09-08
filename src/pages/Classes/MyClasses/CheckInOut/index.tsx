import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FcStatistics } from 'react-icons/fc';
import { FaCalendarCheck } from 'react-icons/fa';
import UsersLayout from '../../../../layout/UsersLayout';
import Loader from '../../../../common/Loader';
import { Axios } from '../../../../Api/axios';
import { CHECKINOUT, CLASSES } from '../../../../Api/Api';
import {
  adjustStartTimeWithOffset,
  getTime,
} from '../../../../helpers/TransformDate';
import { useContext, useState } from 'react';
import { UserContext } from '../../../../Context/loggedInUser';
import { MdDateRange } from 'react-icons/md';
import { BiSolidCalendarHeart } from 'react-icons/bi';
import { CiCalendarDate } from 'react-icons/ci';

const CheckInOut = () => {
  const { id } = useParams();
  const { loggedInUser } = useContext(UserContext);
  const [err, setErr] = useState(false);
  const { data, isLoading } = useQuery({
    queryFn: () => Axios.get(`${CLASSES}/${CHECKINOUT}/${id}`),
    queryKey: ['teacher-checkInOut' + id],
    onError: () => {
      setErr(true);
    },
    onSuccess: () => {
      setErr(false);
    },
  });

  const checkInOutShow = data?.data;

  return (
    <UsersLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" m-2 mb-5 h-[100vh] rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
          {err ? (
            <h1>No Data Yet</h1>
          ) : (
            <div className="w-full text-form-strokedark p-4 h-80">
              <h2 className="mb-9 text-2xl font-extrabold  text-black dark:text-white sm:text-title-xl2">
                <FcStatistics className="inline-block me-5" />
                Check Time For {checkInOutShow?.class?.name} :
              </h2>
              <hr className="h-5 border-stroke dark:border-form-strokedark" />
              <div className="m-5 w-full">
                <h3 className="mb-4 text-xl font-bold dark:text-white ">
                  <FaCalendarCheck className="inline-block me-5 text-xl" />
                  Class Starts at:{' '}
                  <span className="text-green-500">
                    {
                      adjustStartTimeWithOffset(
                        checkInOutShow?.class?.start_time,
                        checkInOutShow?.class?.start_date,
                        loggedInUser?.timezone,
                      )?.adjustedTime
                    }
                  </span>
                </h3>
                <h3 className="mb-4 text-xl font-bold dark:text-white ">
                  <MdDateRange className="inline-block me-5 text-xl" />
                  Teacher Entered at(Based on his time):{' '}
                  <span className="text-green-500">
                    {getTime(checkInOutShow?.checkIn)}
                  </span>
                </h3>
                <h3 className="mb-4 text-xl font-bold dark:text-white ">
                  <CiCalendarDate className="inline-block me-5 text-xl" />
                  Teacher Closed at(Based on his time):{' '}
                  <span className="text-green-500">
                    {getTime(checkInOutShow?.checkOut)}
                  </span>
                </h3>{' '}
                <h3 className="mb-4 text-xl font-bold dark:text-white ">
                  <FaCalendarCheck className="inline-block me-5 text-xl" />
                  Duration:{' '}
                  <span className="text-green-500">
                    {checkInOutShow?.duration}
                  </span>
                </h3>
              </div>
            </div>
          )}
        </div>
      )}
    </UsersLayout>
  );
};

export default CheckInOut;

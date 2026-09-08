import { FaTasks } from 'react-icons/fa';
import { TbChartCircles } from 'react-icons/tb';
import { MdFlightClass, MdOutlinePayment } from 'react-icons/md';
import { PiStackOverflowLogoBold } from 'react-icons/pi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { MdDashboardCustomize } from 'react-icons/md';
import { MdAssignment } from 'react-icons/md';
import { BiSolidReport } from 'react-icons/bi';
type CheckNamePageProps = {
  NamePage: string;
};
const CheckNamePage: React.FC<CheckNamePageProps> = ({ NamePage }) => {
  return (
    <>
      {NamePage === 'task' ? (
        <FaTasks className="h-9 w-9" />
      ) : NamePage === 'circle' ? (
        <TbChartCircles className="h-12 w-12" />
      ) : NamePage === 'payment' ? (
        <MdOutlinePayment className="h-12 w-12" />
      ) : NamePage === 'task' ? (
        <FaTasks className="h-9 w-9" />
      ) : NamePage === 'user' ? (
        <FaUserCircle className="h-7 w-7" />
      ) : NamePage === 'student' ? (
        <PiStackOverflowLogoBold className="h-12 w-12" />
      ) : NamePage === 'calendar' ? (
        <FaRegCalendarAlt className="h-12 w-12" />
      ) : NamePage === 'report' ? (
        <BiSolidReport className="h-10 w-10" />
      ) : NamePage === 'dashboard' ? (
        <MdDashboardCustomize className="h-12 w-12" />
      ) : NamePage === 'assignment' ? (
        <MdAssignment className="h-7 w-7" />
      ) : NamePage === 'class' ? (
        <MdFlightClass className="h-8 w-8" />
      ) : (
        ''
      )}
    </>
  );
};

export default CheckNamePage;

import { CiEdit } from 'react-icons/ci';
import { useContext, useEffect, useState } from 'react';
import {
  RiDeleteBinLine,
  RiLockPasswordFill,
  RiPagesLine,
} from 'react-icons/ri';
import { OptionsMenuProps } from '../../types/table';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteDialog from '../DialogDelete/DialogDelete';
import { SiGoogleclassroom } from 'react-icons/si';
import { PiStudent } from 'react-icons/pi';
import {
  MdAssignmentAdd,
  MdCancelPresentation,
  MdStopCircle,
} from 'react-icons/md';
import { FaEye, FaRegCopy } from 'react-icons/fa6';
import { FcStatistics } from 'react-icons/fc';
import { FaFilePowerpoint, FaPlayCircle } from 'react-icons/fa';
import { REALUSER } from '../../Context/realUser';
import { showSuccess } from '../../libs/ReactToastify';
import { IoMdTime } from 'react-icons/io';

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  deleteItem,
  cancelItem,
  comingOptions,
  id,
  deleteLoading,
  role,
  isSuccess,
  path,
  isActive,
  classStatus,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [title, setTitle] = useState<string>('');
  const { realUser } = useContext(REALUSER);
  const location = useLocation();

  const { pathname } = location;

  console.log(classStatus);

  const menuOptions = [
    {
      title: 'Edit',
      icon: <CiEdit />,
      fn: () => navigate(path ? path : id),
      notShow: pathname.includes('classes') ? 'classes' : 'submissions',
      notRole: ['teacher', 'student', 'guest'],
    },
    {
      title: 'Delete',
      icon: <RiDeleteBinLine />,
      fn: (e: any) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
        setTitle('Delete This Item');
      },

      notShow: 'subscription',

      notRole:
        pathname !== '/' && !pathname.includes('/comments/post')
          ? ['student', 'guest', 'teacher']
          : [],
    },
    {
      title: 'Visibilty',
      icon: <FaEye />,
      fn: () => navigate(`post/${id}/visibilty`),
      show: pathname === '/' ? '/' : '!',
      notShow: 'comments',
      notRole: ['student', 'guest'],
    },
    {
      title: 'Change Password',
      icon: <RiLockPasswordFill />,
      fn: () => navigate(`change-password/${id}`),
      show: 'users',
    },
    {
      title: 'Remaining Classes',
      icon: <SiGoogleclassroom />,
      fn: () => navigate(`remaining-classes/${id}`),
      show: 'users',
      role: ['student', 'guest', 'guest'],
    },

    {
      title: 'Pages To Show',
      icon: <RiPagesLine />,
      fn: () => navigate(`enabled-controles/${id}`),
      show: 'users',
      role: 'admin',
      notRole: 'admin',
    },
    {
      title: 'Statistics',
      icon: <FcStatistics />,
      fn: () => navigate(`statistics/${id}`),
      show: 'users',
      role: 'teacher',
    },
    {
      title: 'Manage Class',
      icon: <FaEye />,
      fn: () => navigate(`/classes/${id}/manage`),
      show: 'classes',
    },
    {
      title: 'Assignments',
      icon: <MdAssignmentAdd />,
      fn: () => navigate(`/classes/${id}/assignments`),
      show: 'classes',
      notRole: ['student', 'guest'],
    },
    {
      title: 'Add Students',
      icon: <PiStudent />,
      fn: () => navigate(`/classes/${id}/show/add`),
      show: classStatus === 'scheduled' ? 'classes' : '!!!!!',
      notRole: ['student', 'guest', 'teacher'],
    },
    {
      title: 'Cancel Class',
      icon: <MdCancelPresentation />,
      fn: (e: any) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
        setTitle('Cancel This Class');
      },
      show: classStatus === 'scheduled' ? 'classes' : '!!!!!',
      notRole: ['student', 'guest', 'teacher'],
    },
    {
      title: 'Check (In - Out)',
      icon: <IoMdTime />,
      fn: () => navigate(`checkInOut/${id}`),
      show: 'classes',
      notRole: ['student', 'guest', 'teacher'],
    },

    {
      title: 'PowerPoint Reader',
      icon: <FaFilePowerpoint />,
      fn: () => navigate(`${id}/powerpoint`),
      show: 'products',
    },
    {
      title: 'Deactivate',
      icon: <MdStopCircle />,
      fn: () => navigate(`${id}/deactive`),
      show: isActive ? 'packages' : '!',

      notRole: ['student', 'guest', 'teacher'],
    },
    {
      title: 'Reactivate',
      icon: <FaPlayCircle />,
      fn: () => navigate(`${id}/reactive`),
      show: isActive ? '!' : 'packages',

      notRole: ['student', 'guest', 'teacher'],
    },
    {
      title: 'Submissions',
      icon: <FaEye />,
      fn: () => navigate(`/forms/${id}/submissions`),
      show: 'forms',
      notRole: ['student', 'guest', 'teacher'],
      notShow: 'submissions',
    },
    {
      title: 'View',
      icon: <FaEye />,
      fn: () => navigate(`/forms/submissions/${id}`),
      show: 'submissions',
      notRole: ['student', 'guest', 'teacher'],
    },
    {
      title: 'Copy Link',
      icon: <FaRegCopy />,
      fn: () => {
        navigator.clipboard.writeText(
          window.location.host + '/submit-forms/' + id,
        );
        showSuccess('Link Copied To Clipboard');
      },

      show: 'forms',
      notShow: 'submissions',
      notRole: ['student', 'guest', 'teacher'],
    },
  ];

  const mergeOptions = [...menuOptions, ...comingOptions];

  const handleDeleteConfirmation = () => {
    if (title.includes('Delete')) {
      deleteItem && deleteItem(pathname.includes('classes') ? { id } : id);
    } else {
      cancelItem && cancelItem(id);
    }
  };

  useEffect(() => {
    isSuccess && setShowDeleteDialog(false);
  }, [isSuccess]);

  return (
    <div className="relative">
      <div className="absolute OptionsMenu right-4 border-t-6 rounded-xl bg-slate-50 dark:bg-form-strokedark p-2 mt-2 w-50 h-fit shadow-xl z-10">
        {mergeOptions.map(
          (item, index) =>
            (pathname.includes(item.show) || !item.show) &&
            !pathname.includes(item.notShow) &&
            (!item.role || item.role.includes(role)) &&
            !item.notRole?.includes(realUser) && (
              <div
                onClick={item.fn}
                key={index}
                className="flex items-center gap-3 p-1 cursor-pointer"
              >
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            ),
        )}
      </div>
      <DeleteDialog
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirmation}
        deleteLoading={deleteLoading}
        showDialog={showDeleteDialog}
        title={title}
        action={title.includes('Delete') ? 'Delete' : 'Yes'}
      />
    </div>
  );
};

export default OptionsMenu;

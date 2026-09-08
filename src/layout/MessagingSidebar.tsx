import { ReactElement, useState } from 'react';
import { MdKeyboard } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaInbox } from 'react-icons/fa';
import { FaEnvelopeCircleCheck } from 'react-icons/fa6';
import { IoMdTrash } from 'react-icons/io';
import { MdOutlinePending } from 'react-icons/md';
import { useLocation, Link } from 'react-router-dom';

type Link = {
  title: string;
  path: string;
  icon: ReactElement;
};

const MessagingSidebar = () => {
  const links: Link[] = [
    {
      title: 'Inbox',
      path: 'inbox',
      icon: <FaInbox />,
    },
    {
      title: 'Send Box',
      path: 'send-box',
      icon: <FaEnvelopeCircleCheck />,
    },
    {
      title: 'Canned Response',
      path: 'canned-response',
      icon: <MdOutlinePending />,
    },
    {
      title: 'Trash',
      path: 'trash',
      icon: <IoMdTrash />,
    },
    {
      title: 'Settings',
      path: 'setting',
      icon: <IoSettingsSharp />,
    },
  ];
  const location = useLocation();
  const pathname = location.pathname;

  //   Render Links
  const showLinks = links?.map((link, key) => {
    return (
      <li
        key={key}
        className={`py-3 sm:py-4 hover:bg-stone-100 dark:hover:bg-slate-300 dark:hover:text-strokedark px-2 duration-500 ${
          pathname.includes(link.path)
            ? 'bg-stone-200 dark:text-strokedark dark:bg-slate-400'
            : ''
        } `}
      >
        <Link to={`/messaging/${link.path}`} key={key} className="">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{link.icon}</div>
            <div className="flex-shrink-0">{link.title}</div>
          </div>
        </Link>
      </li>
    );
  });

  return (
    <div className="p-2 bg-white  rounded border border-stroke dark:border-strokedark shadow-lg dark:bg-boxdark md:h-[100vh]  text-xs md:text-sm lg:text-sm  ">
      <Link
        to={`/messaging/new`}
        className="flex items-center flex-wrap gap-3 justify-between mb-4 border-b border-stroke dark:border-strokedark pb-3"
      >
        <h5 className="font-bold leading-none text-gray-900">Messaging</h5>
        <div className="flex  gap-2 items-center">
          <MdKeyboard className="text-lg" />
          <div className="flex gap-1 items-center border border-stroke rounded-lg p-1">
            <MdOutlineEmail className="text-lg" />
            <p>new Messaging</p>
          </div>
        </div>
      </Link>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {showLinks}
        </ul>
      </div>
    </div>
  );
};

export default MessagingSidebar;

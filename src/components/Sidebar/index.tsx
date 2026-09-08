import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LinkArrow } from './LinkArrow';
import { Links } from './Links';
import { REALUSER } from '../../Context/realUser';
import { ENABLED } from '../../Context/enabledControlled';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  // This User
  const { realUser } = useContext(REALUSER);
  const { enabledControls } = useContext(ENABLED);
  // Side Bar
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const showLinks = Links.map((link, key): ReactNode => {
    return realUser === 'admin' ? (
      enabledControls.includes(link.title.toLocaleLowerCase()) &&
      link.hasLinks ? (
        <SidebarLinkGroup
          key={key}
          activeCondition={
            pathname === `${link.link}` || pathname.includes(link.title)
          }
        >
          {(handleClick, open) => {
            return (
              <React.Fragment>
                <NavLink
                  to="#"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === `${link.link}` ||
                      pathname.includes(link.title)) &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                  }}
                >
                  <FontAwesomeIcon icon={link.icon} />
                  {link.title}
                  <LinkArrow open={open} />
                </NavLink>
                {/* <!-- Dropdown Menu Start --> */}
                <div
                  className={`translate transform overflow-hidden ${
                    !open && 'hidden'
                  }`}
                >
                  <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                    {link.hasLinks.map((innerLink, key) => (
                      <li key={key}>
                        <NavLink
                          to={`${link.link}/${innerLink.path}`}
                          className={({ isActive }) =>
                            'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                            (isActive && '!text-white')
                          }
                        >
                          <FontAwesomeIcon icon={innerLink.icon} />
                          {innerLink.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <!-- Dropdown Menu End --> */}
              </React.Fragment>
            );
          }}
        </SidebarLinkGroup>
      ) : (
        enabledControls.includes(link.title.toLocaleLowerCase()) && (
          <li key={key}>
            <NavLink
              to={link.link}
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                (pathname === `${link.link}` ||
                  pathname.includes(link.title)) &&
                'bg-graydark dark:bg-meta-4'
              }`}
            >
              <FontAwesomeIcon icon={link.icon} />
              {link.title}
            </NavLink>
          </li>
        )
      )
    ) : link.roles.includes(realUser) && link.hasLinks ? (
      <SidebarLinkGroup
        key={key}
        activeCondition={
          pathname === `${link.link}` || pathname.includes(link.title)
        }
      >
        {(handleClick, open) => {
          return (
            <React.Fragment>
              <NavLink
                to="#"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  (pathname === `${link.link}` ||
                    pathname.includes(link.title)) &&
                  'bg-graydark dark:bg-meta-4'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                }}
              >
                <FontAwesomeIcon icon={link.icon} />
                {link.title}
                <LinkArrow open={open} />
              </NavLink>
              {/* <!-- Dropdown Menu Start --> */}
              <div
                className={`translate transform overflow-hidden ${
                  !open && 'hidden'
                }`}
              >
                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                  {link.hasLinks.map(
                    (innerLink, key: number) =>
                      ((innerLink.roles &&
                        innerLink?.roles.includes(realUser)) ||
                        !innerLink.roles) && (
                        <li key={key}>
                          <NavLink
                            to={`${link.link}/${innerLink.path}`}
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                              (isActive && '!text-white')
                            }
                          >
                            <FontAwesomeIcon icon={innerLink.icon} />
                            {innerLink.title}
                          </NavLink>
                        </li>
                      ),
                  )}
                </ul>
              </div>
              {/* <!-- Dropdown Menu End --> */}
            </React.Fragment>
          );
        }}
      </SidebarLinkGroup>
    ) : (
      link.roles.includes(realUser) && (
        <li key={key}>
          <NavLink
            to={link.link}
            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              (pathname === `${link.link}` || pathname.includes(link.title)) &&
              'bg-graydark dark:bg-meta-4'
            }`}
          >
            <FontAwesomeIcon icon={link.icon} />
            {link.title}
          </NavLink>
        </li>
      )
    );
  });
  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex  w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 min-h-full h-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className={'mx-auto'}>
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col justify-between overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">{showLinks}</ul>
          </div>
        </nav>
      </div>

      <div className="flex items-center flex-col justify-end flex-1 mb-5 text-sm">
        <h2>Copyrights received to Jaweed</h2>
        <h2>
          Powered by{' '}
          <a
            href="http://dtech-agency.com/"
            className="text-primary"
            target="_blank"
          >
            D-Tech Agency
          </a>
        </h2>
      </div>
    </aside>
  );
};

export default Sidebar;

import { Link, useLocation } from 'react-router-dom';
import DropDownArrow from '../Arrows/DropDownArrow';
import { useState } from 'react';

const InnerPageHeader = (props: {
  links: {
    title: string;
    path: string;
    innerLinks?: { title: string; path: string }[];
  }[];
  pageLink: string;
}) => {
  // Get Location
  const location = useLocation();
  const pathname = location.pathname;

  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  // Function to handle toggle the open state for a specific link
  const toggleOpenState = (path: string) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [path]: !prevState[path] || false,
    }));
  };

  //   Render Links
  const showLinks = props?.links?.map((link, key) => {
    const isOpen = openStates[link.path] || false;
    return (
      <Link
        to={`/${props.pageLink}/${link.path}`}
        key={key}
        className={`uppercase py-4 text-black dark:text-white text-sm relative group ${
          pathname.includes(link.path)
            ? 'border-b-2 border-black dark:border-white font-bold'
            : ''
        } `}
        onMouseLeave={() => toggleOpenState(link.path)}
        onMouseEnter={() => toggleOpenState(link.path)}
      >
        <span className="flex items-center gap-1">
          {link.title}
          {link.innerLinks && <DropDownArrow open={isOpen} />}
        </span>
        {link.innerLinks && (
          <div className="absolute top-full -start-5 ps-8 pe-5 w-max invisible translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all border border-gray flex items-start justify-start flex-col bg-white">
            {link.innerLinks.map((innerLink, key) => (
              <Link
                to={innerLink.path}
                key={key}
                className={`uppercase py-4 text-black dark:text-white text-sm relative  ${
                  pathname.includes(innerLink.path)
                    ? 'border-b-2 border-black dark:border-white font-bold'
                    : 'hover:border-b-2'
                } `}
              >
                {innerLink.title}
              </Link>
            ))}
          </div>
        )}
      </Link>
    );
  });
  return (
    <header className="flex items-center justify-center flex-wrap gap-8 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none mb-4 rounded">
      {showLinks}
    </header>
  );
};

export default InnerPageHeader;

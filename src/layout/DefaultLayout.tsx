import React, { useState, ReactNode, useContext, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import Messenger from '../pages/Socket/Client';
import { REALUSER } from '../Context/realUser';
import { useLocation } from 'react-router-dom';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { realUser } = useContext(REALUSER);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark relative">
      {(realUser === 'student' || realUser === 'teacher') &&
        !pathname.includes('messaging') && <Messenger />}

      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-auto" id="scrolling-pg">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}
        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden main-right">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}
          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 ">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;

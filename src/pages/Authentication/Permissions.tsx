import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import { Axios } from '../../Api/axios';
import { GET_LOGGEDIN_USER } from '../../Api/Api';
import Loader from '../../common/Loader';
import Cookie from 'cookie-universal';
import { REALUSER } from '../../Context/realUser';
import { ENABLED } from '../../Context/enabledControlled';
import { UserContext } from '../../Context/loggedInUser';
import _403 from '../../components/Errors/403';
import { useQuery } from 'react-query';
import { socket } from '../../Socket';

interface PermissionsProps {
  allowedRoles: string[];
}

const Permissions: React.FC<PermissionsProps> = ({ allowedRoles }) => {
  const { realUser, setRealUser } = useContext(REALUSER);
  const { setEnabledControls } = useContext(ENABLED);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get('jaweed-crm');

  const {} = useQuery({
    queryFn: async () => await Axios.get(GET_LOGGEDIN_USER),
    queryKey: ['loggedInUser'],
    onSuccess: (data) => {
      setRealUser(data.data.data.role);
      setEnabledControls(data.data.data.enabledControls);
      setLoggedInUser(data.data.data);
      socket.emit('addUser', data.data.data?._id);
    },
    onError: () => {
      cookie.remove('jaweed-crm');
      nav('/auth/signin');
    },
  });

  return token ? (
    !loggedInUser?.account_status ? (
      <Loader />
    ) : loggedInUser?.account_status === 'confirmed' ? (
      allowedRoles.includes(realUser) ? (
        <Outlet />
      ) : (
        <_403 role={realUser} />
      )
    ) : (
      <Navigate replace={true} to={'/auth/confirm-email'} />
    )
  ) : (
    <Navigate replace={true} to={'/auth/signin'} />
  );
};

export default Permissions;

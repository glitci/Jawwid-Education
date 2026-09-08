import Cookie from 'cookie-universal';
import { Outlet } from 'react-router-dom';

const RequireBack = () => {
  const cookie = Cookie();
  const token = cookie.get('jaweed-crm');
  if (token) {
    window.history.go(-1);
    return null;
  }

  return <Outlet />;
};

export default RequireBack;

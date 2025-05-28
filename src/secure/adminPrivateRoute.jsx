import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminPrivateRoute = ({ children }) => {
  const adminId = Cookies.get('adminid');

  if (!adminId) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;

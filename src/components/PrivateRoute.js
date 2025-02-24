import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Wait for auth to be checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check both user and token
  const token = localStorage.getItem('jwt_token');
  const userInfo = localStorage.getItem('user_info');

  if (!user && !token && !userInfo) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute; 
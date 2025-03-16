import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'user') {
      return <Navigate to="/user/dashboard" />;
    } else if (currentUser.role === 'driver') {
      return <Navigate to="/driver/dashboard" />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
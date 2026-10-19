// src/components/ProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * @param {React.Component} children - The component to render if access is granted.
 * @param {Array} roles - Optional array of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
   
  console.log("ProtectedRoute", isAuthenticated, user, roles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

// src/components/PublicRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PageLoader from '@/components/global/Loaders/PageLoader'; // Assuming you have a loader

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    // Redirect based on user role
    if (user.role === 'admin' || user.role === 'employer') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />; // Adjust if you have user dashboards
    }
  }

  return children;
};

export default PublicRoute;

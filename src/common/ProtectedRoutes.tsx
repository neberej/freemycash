import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@src/store/useStore';

interface ProtectedRoutesProps {
  hasData: boolean;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ hasData }) => {
  const { data } = useStore();

  // Allow access if data exists in context or localStorage
  const isAuthenticated = !!data || hasData;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
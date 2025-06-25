// RoleProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CustomSpinner } from '@/components/ui/CustomComponents/CustomLoading';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-background h-screen space-y-4">
        <CustomSpinner size={48} />
        <p className="text-sm bg-transparent ">Loading...</p>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
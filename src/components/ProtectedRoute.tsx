import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageContainer from './PageContainer';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <PageContainer className="text-center">
        <p className="text-muted">Cargando sesión...</p>
      </PageContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

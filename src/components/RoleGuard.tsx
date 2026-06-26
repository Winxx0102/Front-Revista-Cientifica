'use client';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
}

export const RoleGuard = ({ children, roles }: RoleGuardProps) => {
  const { user, isLoading } = useAuth();

  // 1. Si aún está cargando la sesión, no renderizamos nada.
  // Esto evita que el usuario vea botones que luego desaparecen.
  if (isLoading) {
    return null;
  }

  // 2. Si no hay usuario o el rol no tiene acceso, bloqueamos.
  if (!user || !roles.includes(user.role as string)) {
    return null;
  }

  // 3. Todo correcto, mostramos el contenido.
  return <>{children}</>;
};
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminRefreshGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Si estamos en el dashboard o en admin, revisamos si ya forzamos el refresh en esta sesión
    if (pathname === '/dashboard' || pathname === '/admin') {
      const hasForcedReload = sessionStorage.getItem('rudimentaryAdminFix');

      if (!hasForcedReload) {
        // Marcamos inmediatamente para evitar bucles infinitos
        sessionStorage.setItem('rudimentaryAdminFix', 'true');
        
        // Retardo estratégico de 100ms para asegurar que la sesión o el token 
        // alcancen a leerse del almacenamiento antes de disparar el F5 cibernético
        setTimeout(() => {
          window.location.reload();
        }, 1);
      }
    }
  }, [pathname]);

  return null;
}
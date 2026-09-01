'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminRefreshGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Solo aplicamos el truco si entra al dashboard por primera vez en la sesión
    const hasRefreshed = sessionStorage.getItem('adminUIRefreshed');

    // Verificamos si es admin o si el usuario viene de iniciar sesión
    if (!hasRefreshed && (pathname === '/dashboard' || pathname === '/admin')) {
      sessionStorage.setItem('adminUIRefreshed', 'true');
      window.location.reload();
    }
  }, [pathname]);

  return null;
}
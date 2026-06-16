'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/services/api';

export default function Navbar() {
  const { logout, user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') return null;

  const isAdminOrSuper = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');
  const isBlocked = !isLoading && user?.isBlocked;

  const handleLogout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'GET' });
    } catch (error) {
      console.error("Error al cerrar sesión");
    } finally {
      logout();
      setIsOpen(false);
      window.location.href = '/login';
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="site-header"
    >
      <div className="header-inner">
        {/* Logo con diseño editorial */}
        <Link href="/dashboard" className="logo-link">
          <svg className="logo-svg" viewBox="0 0 180 40" fill="currentColor">
            <text x="0" y="20" font-family="Instrument Serif" font-size="16" font-weight="400">Saberes</text>
            <text x="0" y="33" font-family="Source Sans 3" font-size="9" font-weight="600" letter-spacing="1.2">POLITÉCNICOS</text>
          </svg>
        </Link>

        {/* Botón Hamburguesa */}
        <button 
          className="mobile-menu-btn md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Menú de navegación adaptado */}
        <AnimatePresence>
          <motion.div 
            className={`main-nav ${isOpen ? 'open' : ''}`}
            initial={false}
          >
            <ul className="nav-list">
              <li><Link href="/dashboard" className="nav-link">Inicio</Link></li>
              <li><Link href="/articulos" className="nav-link">Artículos</Link></li>
              
              {/* Opción restringida solo para Admins */}
              {isAdminOrSuper && (
                <li>
                  <Link href="/admin/upload" className="nav-link text-primary font-semibold">
                    Subir Revista
                  </Link>
                </li>
              )}

              {/* Botón Salir con estilo académico */}
              <li>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary text-xs py-1 px-4 ml-4"
                >
                  CERRAR SESIÓN
                </button>
              </li>
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
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
        {/* Logo Académico */}
        <Link href="/dashboard" className="logo-link">
          <svg className="logo-svg" viewBox="0 0 180 40" fill="currentColor">
            <text x="0" y="20" font-family="'Instrument Serif', Georgia, serif" font-size="16" font-weight="400">Saberes</text>
            <text x="0" y="33" font-family="'Source Sans 3', sans-serif" font-size="9" font-weight="600" letter-spacing="1.2">POLITÉCNICOS</text>
          </svg>
        </Link>

        {/* Botón Hamburguesa */}
        <button 
          className="mobile-menu-btn md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>

        {/* Menú principal */}
        <div className={`main-nav ${isOpen ? 'open' : ''}`}>
          <ul className="nav-list" role="list">
            <li><Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Inicio</Link></li>
            <li><Link href="/articulos" className={`nav-link ${pathname === '/articulos' ? 'active' : ''}`}>Artículos</Link></li>
            
            {/* Opción restringida: Subir Revista */}
            {isAdminOrSuper && (
              <li>
                <Link href="/admin/upload" className="nav-link font-bold text-accent">
                  Subir Publicación
                </Link>
              </li>
            )}
          </ul>

          {/* Acciones */}
          <div className="header-actions">
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary text-xs px-5 py-2"
            >
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
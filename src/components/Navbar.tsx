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
      initial={{ y: -10, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="site-header"
    >
      <div className="header-inner">
        {/* Logo con efecto hover */}
        <Link href="/dashboard" className="logo-link group">
          <svg className="logo-svg transition-transform group-hover:scale-[1.02]" viewBox="0 0 180 40" fill="currentColor">
            <text x="0" y="20" font-family="var(--font-geist-sans)" font-size="18" font-weight="700">Saberes</text>
            <text x="0" y="33" font-family="var(--font-geist-mono)" font-size="9" font-weight="500" letter-spacing="1.5" className="text-color-primary">POLITÉCNICOS</text>
          </svg>
        </Link>

        {/* Botón Hamburguesa */}
        <button 
          className="mobile-menu-btn md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`hamburger ${isOpen ? 'open' : ''}`} />
        </button>

        {/* Menú Principal */}
        <div className={`main-nav ${isOpen ? 'open' : ''}`}>
          <ul className="nav-list font-sans" role="list">
            <li>
              <Link href="/dashboard" className={`nav-link relative ${pathname === '/dashboard' ? 'active' : ''}`}>
                Inicio
                <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
            <li>
              <Link href="/articulos" className={`nav-link ${pathname === '/articulos' ? 'active' : ''}`}>
                Artículos
              </Link>
            </li>
            
            {isAdminOrSuper && (
              <li>
                <Link href="/admin/upload" className="nav-link font-semibold text-accent hover:opacity-80 transition-opacity flex items-center gap-1">
                  <span className="text-lg">+</span> Subir Publicación
                </Link>
              </li>
            )}
          </ul>

          <div className="header-actions">
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary px-6 py-2 hover:bg-primary hover:text-white transition-all duration-300 font-medium tracking-wide"
            >
              SALIR
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
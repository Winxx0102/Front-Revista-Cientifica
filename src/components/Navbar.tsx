'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
      window.location.href = '/login';
    }
  };

  return (
    // Fondo azul oscuro institucional (como en las capturas)
    <motion.nav 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-[#0b1b2e] border-b border-white/10 w-full"
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Institucional */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <svg width="120" height="40" viewBox="0 0 180 40" fill="white">
            <text x="0" y="25" font-family="var(--font-geist-sans)" font-size="16" font-weight="bold">SABERES</text>
          </svg>
        </Link>

        {/* Menú de navegación principal */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link href="/articulos" className="hover:text-white transition-colors">Artículos</Link></li>
            <li><Link href="/repositorio" className="hover:text-white transition-colors">Repositorio</Link></li>
            <li><Link href="/normas" className="hover:text-white transition-colors">Normas</Link></li>
          </ul>

          {/* Acción Admin (Solo admins) */}
          {isAdminOrSuper && (
            <Link href="/admin/upload" className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded text-sm transition-colors">
              Subir Publicación
            </Link>
          )}

          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
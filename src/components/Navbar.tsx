'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { logout, user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // No mostrar navbar en login/register
  if (pathname === '/login' || pathname === '/register') return null;

  const isAdminOrSuper = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  // Lógica manejada centralmente en el AuthContext
  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="bg-[#0b1b2e] border-b border-white/10 w-full sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Institucional */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded">
            <Image 
              src="/images/imagen.jpg" 
              alt="Logo" 
              fill 
              className="object-cover" 
              priority
            />
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-sky-400 transition-colors">
            SABERES
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Inicio</Link></li>
    
          </ul>

          {isAdminOrSuper && (
            <>
              <Link href="/chronicles/create" className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded text-sm transition-colors">
                Subir Publicación
              </Link>
              <Link href="/admin" className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded text-sm transition-colors">
                Admin Panel
              </Link>
               <Link href="https://upta.edu.ve/" className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded text-sm transition-colors">
                Portal UPTA
              </Link>
            </>
          )}

          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Salir
          </button>
        </div>

        {/* Botón Hamburguesa Móvil */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0e243d] border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-slate-300">
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>Inicio</Link>
          
              
              {isAdminOrSuper && (
                <>
                  <Link href="/chronicles/create" onClick={() => setIsOpen(false)} className="text-sky-400 font-semibold">
                    Subir Publicación
                  </Link>
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="text-sky-400 font-semibold">
                    Admin Panel
                  </Link>
                </>
              )}
              
              <button onClick={handleLogout} className="text-left text-red-400">
                Salir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
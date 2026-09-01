'use client';
import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type LocalNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<LocalNotification[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const saved = localStorage.getItem('user_notifications');
      if (saved) {
        return JSON.parse(saved) as LocalNotification[];
      }

      const initial: LocalNotification[] = [
        {
          id: '1',
          title: 'Bienvenido a Saberes',
          message: 'Tu cuenta está activa. Puedes enviar tus artículos y proyectos.',
          read: false,
          createdAt: new Date().toISOString(),
        }
      ];

      localStorage.setItem('user_notifications', JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.error('Error al leer notificaciones:', e);
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('user_notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative text-slate-300 hover:text-white transition-colors p-2 focus:outline-none"
        aria-label="Notificaciones"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0e243d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-200"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0b1b2e]">
              <h3 className="text-sm font-bold text-white">Notificaciones</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono">{unreadCount} sin leer</span>
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="text-[10px] text-red-400 hover:underline">Limpiar</button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No tienes notificaciones recientes.
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-1 hover:bg-white/5 ${!n.read ? 'bg-sky-500/5' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 block pt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
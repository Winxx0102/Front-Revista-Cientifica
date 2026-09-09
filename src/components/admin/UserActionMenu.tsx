'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
  userRole: string;
  targetUser: { id: number; role: string; isBlocked: boolean };
  currentUserId?: number; 
  onAction: (id: number, action: 'block' | 'unblock' | 'role', role?: string) => void;
}

export default function UserActionMenu({ userRole, targetUser, currentUserId, onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleUpper = userRole?.trim().toUpperCase();
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'SUPERADMIN' || roleUpper === 'JURADO';
  const isSuperAdmin = roleUpper === 'SUPERADMIN';
  const isSelf = currentUserId === targetUser.id;

  if (!isAdmin) return null;

  const handleRoleChange = (backendRole: string, label: string) => {
    setIsOpen(false);
    toast.warning(`¿Cambiar rol a ${label}?`, {
      description: "Esta acción modificará los permisos del usuario de forma inmediata.",
      action: {
        label: "Confirmar",
        onClick: () => onAction(targetUser.id, 'role', backendRole)
      }
    });
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          isOpen 
            ? 'bg-white text-gray-900' 
            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
        }`}
      >
        {isOpen ? 'Cerrar' : 'Gestionar'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-3 w-48 bg-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]"
          >
            {!isSelf && (
              <button 
                onClick={() => { onAction(targetUser.id, targetUser.isBlocked ? 'unblock' : 'block'); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-colors ${
                  targetUser.isBlocked 
                    ? 'text-emerald-400 hover:bg-emerald-950/50' 
                    : 'text-red-400 hover:bg-red-950/50'
                }`}
              >
                {targetUser.isBlocked ? 'Desbloquear Usuario' : 'Bloquear Usuario'}
              </button>
            )}

            {isSuperAdmin && !isSelf && (
              <div className="border-t border-white/5 mt-1 pt-1">
                <p className="px-3 py-2 text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Asignar Nuevo Rol</p>
                
                {/* Opciones con mapeo inteligente al backend */}
                <button 
                  onClick={() => handleRoleChange('USER', 'USER')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  USER
                </button>
                <button 
                  onClick={() => handleRoleChange('ADMIN', 'JURADO')}
                  className="w-full text-left px-3 py-1.5 text-xs text-sky-400 hover:bg-sky-950/40 rounded-lg transition-all font-semibold"
                >
                  JURADO <span className="text-[9px] text-gray-500 font-normal">(Admin)</span>
                </button>
                <button 
                  onClick={() => handleRoleChange('ADMIN', 'ADMIN')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  ADMIN
                </button>
                <button 
                  onClick={() => handleRoleChange('SUPERADMIN', 'SUPERADMIN')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  SUPERADMIN
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
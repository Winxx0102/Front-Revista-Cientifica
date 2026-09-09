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
  const isAdmin = roleUpper === 'ADMIN' || roleUpper === 'SUPERADMIN';
  const isSuperAdmin = roleUpper === 'SUPERADMIN';
  const isSelf = currentUserId === targetUser.id;

  if (!isAdmin) return null;

  const handleRoleChange = (newRole: string, visualType: 'ADMIN' | 'USER' | 'SUPERADMIN') => {
    setIsOpen(false);

    if (typeof window !== 'undefined') {
      if (visualType === 'ADMIN') {
        localStorage.setItem(`user_visual_role_${targetUser.id}`, 'ADMIN');
      } else {
        localStorage.removeItem(`user_visual_role_${targetUser.id}`);
      }
    }

    toast.warning(`Cambiar rol a ${newRole}`, {
      description: "Actualizando usuario...",
      action: {
        label: "Confirmar",
        onClick: () => {
          onAction(targetUser.id, 'role', newRole);
          setTimeout(() => window.location.reload(), 400);
        }
      }
    });
  };

  const handleJuradoToggle = (isJurado: boolean) => {
    setIsOpen(false);

    if (typeof window !== 'undefined') {
      if (isJurado) {
        localStorage.setItem(`user_visual_role_${targetUser.id}`, 'JURADO');
      } else {
        localStorage.removeItem(`user_visual_role_${targetUser.id}`);
      }
    }

    toast.success(isJurado ? "Marcado como (jurado)" : "Etiqueta de jurado removida", {
      description: "Actualizando interfaz localmente...",
    });

    setTimeout(() => window.location.reload(), 300);
  };

  const isCurrentlyJurado = typeof window !== 'undefined' && localStorage.getItem(`user_visual_role_${targetUser.id}`) === 'JURADO';

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
            className="absolute right-0 mt-3 w-52 bg-gray-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]"
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
                <p className="px-3 py-2 text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Asignar Rol</p>
                
                <button 
                  onClick={() => handleRoleChange('USER', 'USER')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  USER
                </button>

                <button 
                  onClick={() => handleRoleChange('ADMIN', 'ADMIN')}
                  className="w-full text-left px-3 py-1.5 text-xs text-purple-400 hover:bg-purple-950/40 rounded-lg transition-all font-semibold"
                >
                  ADMIN
                </button>

                {targetUser.role?.toUpperCase() === 'ADMIN' && (
                  <button 
                    onClick={() => handleJuradoToggle(!isCurrentlyJurado)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-sky-400 hover:bg-sky-950/40 rounded-lg transition-all font-semibold mt-1 border border-sky-500/20 bg-sky-500/5"
                  >
                    <span>{isCurrentlyJurado ? 'Quitar (jurado)' : 'Añadir (jurado)'}</span>
                    <span className="text-[8px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">Tag</span>
                  </button>
                )}

                <button 
                  onClick={() => handleRoleChange('SUPERADMIN', 'SUPERADMIN')}
                  className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-950/40 rounded-lg transition-all font-semibold mt-1"
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
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaUniversity } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading("Registrando usuario...");

    try {
      await fetchApi('/users/register', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });

      toast.dismiss(loadingToast);
      toast.success('Registro exitoso. Ya puede iniciar sesión.');
      router.push('/login');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const message = err instanceof Error ? err.message : 'Error al registrar. Intente nuevamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#071321] relative overflow-hidden">
      {/* Efectos de iluminación ambiental */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-16 relative z-10"
      >
        
        {/* Contenedor Editorial */}
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-xs font-bold uppercase tracking-widest border border-sky-500/20">
            <FaUniversity className="w-3.5 h-3.5" /> Comunidad UPTA
          </div>
          <h1 className="text-6xl md:text-7xl font-serif italic text-white leading-[1.1] tracking-tight">
            Solicitar<br />Acceso
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
            Regístrese para formar parte de la comunidad editorial de la UPTA. Cree una cuenta institucional para gestionar sus publicaciones, revisar artículos y participar en el repositorio técnico.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500 pt-2">
            <span className="w-8 h-px bg-sky-500/40"></span>
            <span>Alta de usuario seguro</span>
          </div>
        </div>

        {/* Formulario de Registro Estilizado */}
        <motion.form 
          onSubmit={handleSubmit} 
          whileHover={{ borderColor: "rgba(56, 189, 248, 0.25)" }}
          className="p-8 md:p-10 bg-[#0e243d]/80 backdrop-blur-2xl rounded-3xl border border-white/10 w-full max-w-md shadow-2xl transition-all relative group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h2 className="text-2xl font-serif italic text-white mb-2">Crear Cuenta</h2>
          <p className="text-slate-400 text-xs mb-8">Complete los campos para registrarse en la plataforma.</p>
          
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaUser className="w-4 h-4" />
              </span>
              <input 
                required
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b1b2e] text-white text-sm rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600" 
                placeholder="Nombre y Apellido" 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <input 
                required
                type="email"
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b1b2e] text-white text-sm rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600" 
                placeholder="Correo electrónico institucional" 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaLock className="w-4 h-4" />
              </span>
              <input 
                required
                type="password" 
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b1b2e] text-white text-sm rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600" 
                placeholder="Contraseña segura" 
                onChange={e => setForm({...form, password: e.target.value})} 
              />
            </div>
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 mt-8 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Procesando registro...' : (
              <>
                Completar Registro <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <span className="text-slate-500 text-xs">¿Ya posee una cuenta? </span>
            <Link href="/login" className="text-sky-400 hover:text-sky-300 transition-colors font-bold text-xs ml-1 hover:underline">
              Inicie sesión
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
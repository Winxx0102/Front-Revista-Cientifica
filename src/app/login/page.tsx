'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaArrowRight, FaUniversity, FaExclamationTriangle } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { updateUser, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await fetchApi('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });

      const userData = data.user || data;

      // Verificación estricta de estatus bloqueado
      if (userData?.isBlocked || userData?.status === 'blocked' || userData?.blocked === true) {
        setErrorMsg('Su usuario está bloqueado. Comuníquese con el comité editorial o soporte técnico.');
        setLoading(false);
        return;
      }

      updateUser(userData); 
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Login fallido:", err);
      setErrorMsg('Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071321] text-sky-400 font-mono text-xs tracking-[0.2em] uppercase">
        Verificando credenciales institucionales...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#071321] relative overflow-hidden">
      {/* Efectos de iluminación ambiental */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-16 relative z-10"
      >
        
        {/* Contenedor Institucional */}
        <div className="flex-1 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-xs font-bold uppercase tracking-widest border border-sky-500/20">
            <FaUniversity className="w-3.5 h-3.5" /> UPTA Aragua
          </div>
          <h1 className="text-6xl md:text-7xl font-serif italic text-white leading-[1.1] tracking-tight">
            Saberes<br />Politécnicos
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
            Plataforma de gestión académica y editorial de la Universidad Politécnica Territorial del Estado Aragua. Acceda para consultar, revisar o someter sus artículos de investigación.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500 pt-2">
            <span className="w-8 h-px bg-sky-500/40"></span>
            <span>Acceso Institucional Seguro</span>
          </div>
        </div>

        {/* Formulario Editorial */}
        <motion.form 
          onSubmit={handleSubmit} 
          whileHover={{ borderColor: "rgba(56, 189, 248, 0.25)" }}
          className="p-8 md:p-10 bg-[#0e243d]/80 backdrop-blur-2xl rounded-3xl border border-white/10 w-full max-w-md shadow-2xl transition-all relative group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h2 className="text-2xl font-serif italic text-white mb-2">Iniciar Sesión</h2>
          <p className="text-slate-400 text-xs mb-6">Ingrese sus datos registrados para autenticarse.</p>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-950/60 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-200 text-xs leading-relaxed shadow-lg"
            >
              <FaExclamationTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <input 
                required
                type="email"
                value={form.email}
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b1b2e] text-white text-sm rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600" 
                placeholder="Correo electrónico" 
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
                value={form.password}
                className="w-full pl-11 pr-4 py-3.5 bg-[#0b1b2e] text-white text-sm rounded-2xl border border-white/5 outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-600" 
                placeholder="Contraseña" 
                onChange={e => setForm({...form, password: e.target.value})} 
              />
            </div>
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 mt-8 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : (
              <>
                Ingresar al Sistema <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <span className="text-slate-500 text-xs">¿No posee credenciales? </span>
            <Link href="/register" className="text-sky-400 hover:text-sky-300 transition-colors font-bold text-xs ml-1 hover:underline">
              Solicitar acceso
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
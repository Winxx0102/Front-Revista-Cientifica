'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // Agregamos updateUser del AuthContext
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

    try {
      const data = await fetchApi('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify(form) 
      });

      // CORRECCIÓN: Usamos updateUser para forzar el re-render de toda la App
      // Aseguramos que pasamos el objeto user que espera el contexto
      const userData = data.user || data;
      updateUser(userData); 
      
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error("Login fallido:", err);
      alert('Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1b2e] text-slate-400 font-mono text-sm tracking-widest uppercase">
        Cargando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Contenedor Institucional (Sin cambios) */}
        <div className="flex-1 text-left space-y-6">
          <h1 className="text-6xl md:text-7xl font-serif italic text-white leading-tight tracking-tight">
            Saberes<br />Politécnicos
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Plataforma de gestión académica y editorial de la Universidad Politécnica Territorial del Estado Aragua (UPTA). Acceda para consultar, revisar o someter sus artículos de investigación.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500">
            <span className="w-8 h-px bg-slate-600"></span>
            <span>Acceso Institucional</span>
          </div>
        </div>

        {/* Formulario Editorial (Sin cambios) */}
        <form onSubmit={handleSubmit} className="p-10 bg-[#142840] rounded border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-serif italic text-white mb-8">Iniciar Sesión</h2>
          
          <div className="space-y-4">
            <input 
              required
              type="email"
              value={form.email}
              className="w-full p-4 bg-[#0b1b2e] text-white rounded border border-white/5 outline-none focus:border-white/30 transition-all placeholder:text-slate-600" 
              placeholder="Correo electrónico" 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
            
            <input 
              required
              type="password"
              value={form.password}
              className="w-full p-4 bg-[#0b1b2e] text-white rounded border border-white/5 outline-none focus:border-white/30 transition-all placeholder:text-slate-600" 
              placeholder="Contraseña" 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full p-4 mt-8 bg-sky-700 hover:bg-sky-600 text-white rounded font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Ingresar'}
          </button>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <span className="text-slate-500 text-sm">¿No posee credenciales? </span>
            <Link href="/register" className="text-white hover:text-sky-400 transition-colors font-medium">
              Solicitar acceso
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
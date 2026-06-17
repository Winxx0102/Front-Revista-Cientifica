'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/services/api';
import { toast } from 'sonner';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1b2e]">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Contenedor Editorial */}
        <div className="flex-1 text-left space-y-6">
          <h1 className="text-6xl md:text-7xl font-serif italic text-white leading-tight tracking-tight">
            Solicitar<br />Acceso
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Regístrese para formar parte de la comunidad editorial de la UPTA. 
            Cree una cuenta para gestionar sus publicaciones, revisar artículos y participar en el repositorio técnico.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-500">
            <span className="w-8 h-px bg-slate-600"></span>
            <span>Alta de usuario</span>
          </div>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleSubmit} className="p-10 bg-[#142840] rounded border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-serif italic text-white mb-8">Crear cuenta</h2>
          
          <div className="space-y-4">
            <input 
              required
              className="w-full p-4 bg-[#0b1b2e] text-white rounded border border-white/5 outline-none focus:border-white/30 transition-all placeholder:text-slate-600" 
              placeholder="Nombre y Apellido" 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
            
            <input 
              required
              type="email"
              className="w-full p-4 bg-[#0b1b2e] text-white rounded border border-white/5 outline-none focus:border-white/30 transition-all placeholder:text-slate-600" 
              placeholder="Correo electrónico" 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
            
            <input 
              required
              type="password" 
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
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <span className="text-slate-500 text-sm">¿Ya posee cuenta? </span>
            <Link href="/login" className="text-white hover:text-sky-400 transition-colors font-medium">
              Inicie sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
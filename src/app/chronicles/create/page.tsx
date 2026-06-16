'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CreateChroniclePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      toast.error("Acceso denegado: Área administrativa exclusiva.");
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Procesando publicación...");

    try {
      await fetchApi('/revista', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      toast.dismiss(loadingToast);
      toast.success('Publicación integrada al sistema.');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Error al publicar';
      toast.error(errorMessage);
    }
  };

  if (isLoading || (user && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return (
      <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center font-mono text-slate-500 uppercase tracking-widest text-sm">
        Verificando credenciales...
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header con estilo institucional */}
          <div className="mb-12 border-l-2 border-sky-700 pl-6">
            <h1 className="text-4xl font-serif italic text-white mb-2">Subir Publicación</h1>
            <p className="text-slate-400">Gestión de contenido para la revista científica UPTA.</p>
          </div>

          {/* Formulario con mayor jerarquía visual */}
          <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título del Artículo</label>
                <input 
                  required
                  className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all placeholder:text-slate-700"
                  placeholder="Ingrese el título..."
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Autor</label>
                <input 
                  required
                  className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all placeholder:text-slate-700"
                  placeholder="Nombre del autor..."
                  value={form.author}
                  onChange={(e) => setForm({...form, author: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido Técnico</label>
              <textarea 
                required
                rows={12}
                className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all resize-none placeholder:text-slate-700"
                placeholder="Desarrolle el contenido científico aquí..."
                value={form.content}
                onChange={(e) => setForm({...form, content: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase tracking-widest text-xs transition-all rounded"
              >
                Confirmar Publicación
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
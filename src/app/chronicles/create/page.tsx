'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient'; // Asegúrate de importar tu cliente
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CreateChroniclePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ title: '', author: '', content: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && user && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Debes seleccionar un archivo.");
      return;
    }

    const loadingToast = toast.loading("Subiendo archivo y procesando...");

    try {
      // 1. Subir a Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Documentos')
        .upload(filePath, file);

      if (uploadError) throw new Error("Error al subir el archivo a Storage");

      // 2. Enviar datos a tu API (incluyendo el filePath)
      await fetchApi('/revista', {
        method: 'POST',
        body: JSON.stringify({ ...form, file_path: filePath }),
      });

      toast.dismiss(loadingToast);
      toast.success('Publicación y archivo integrados.');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error(err instanceof Error ? err.message : 'Error en la publicación');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] py-20 px-6">
        <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-12 border-l-2 border-sky-700 pl-6">
            <h1 className="text-4xl font-serif italic text-white mb-2">Subir Publicación</h1>
            <p className="text-slate-400">Gestión de contenido y documentos científicos.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl space-y-8">
            {/* ... Tus inputs de título y autor siguen aquí ... */}
            
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archivo (PDF, Word, PPT)</label>
              <input 
                type="file"
                required
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none file:mr-4 file:py-2 file:px-4 file:bg-sky-700 file:text-white file:border-0 hover:file:bg-sky-600 cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido Técnico</label>
              <textarea 
                required
                rows={8}
                className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all resize-none"
                value={form.content}
                onChange={(e) => setForm({...form, content: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase tracking-widest text-xs transition-all rounded">
              Confirmar Publicación
            </button>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
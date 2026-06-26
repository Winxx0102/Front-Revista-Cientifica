'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CreateChroniclePage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: '', author: '', content: '', correo: '', materia: '', palabras_claves: '', year_presentacion: '' 
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Debes seleccionar un archivo.");
      return;
    }

    const loadingToast = toast.loading("Procesando publicación...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Documentos') 
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      await fetchApi('/revista', {
        method: 'POST',
        body: JSON.stringify({ ...form, file_path: filePath }),
      });

      toast.dismiss(loadingToast);
      toast.success('Publicación y archivo integrados exitosamente.');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error(err instanceof Error ? err.message : 'Error en la publicación');
    }
  };

  return ( 
    <ProtectedRoute>
      <div className="min-h-screen py-20 px-6">
        <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-12 border-l-2 border-sky-700 pl-6">
            <h1 className="text-4xl font-serif italic text-white mb-2">Subir Publicación</h1>
            <p className="text-slate-400">Gestión de documentos técnicos y académicos.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título</label>
                <input required className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Autor</label>
                <input required className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Correo de contacto</label>
                <input type="email" required className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.correo} onChange={(e) => setForm({...form, correo: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Año de presentación</label>
                <input type="number" required className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.year_presentacion} onChange={(e) => setForm({...form, year_presentacion: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Materia / Programa</label>
              <select required className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.materia} onChange={(e) => setForm({...form, materia: e.target.value})}>
                <option value="">Seleccione una opción...</option>
                <optgroup label="Artículos (Maestría PNFA)">
                  <option value="Mecánica">Mecánica</option>
                  <option value="Automatización">Automatización, Control y Robótica</option>
                  <option value="Informática">Informática — Desarrollo de Software</option>
                  <option value="Electricidad">Electricidad</option>
                </optgroup>
                <optgroup label="Repositorio (Pregrado PNF)">
                  <option value="Instrumentación">Instrumentación y Control</option>
                  <option value="Electricidad/Electrónica">Electricidad · Electrónica</option>
                  <option value="Telecom/Mecánica">Telecomunicaciones · Mecánica</option>
                  <option value="Mantenimiento/Admin">Mantenimiento · Administración</option>
                  <option value="Contaduria">Contaduría Pública</option>
                  <option value="Agro">Agroalimentación</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Palabras clave (separadas por coma)</label>
              <input className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" value={form.palabras_claves} onChange={(e) => setForm({...form, palabras_claves: e.target.value})} />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Archivo</label>
              <input type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded file:mr-4 file:py-2 file:px-4 file:bg-sky-700 file:text-white file:border-0 hover:file:bg-sky-600 cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido / Descripción</label>
              <textarea required rows={5} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all resize-none" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} />
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
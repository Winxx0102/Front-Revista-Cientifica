'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminGuard from '@/components/AdminGuard';

export default function EditChroniclePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ 
    title: '', content: '', author: '', correo: '', materia: '', palabras_claves: '', year_presentacion: '', file_path: '' 
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchApi(`/revista/${id}`)
        .then((data) => {
          setFormData({ 
            title: data.title || '', 
            content: data.content || '',
            author: data.author || '',
            correo: data.correo || '',
            materia: data.materia || '',
            palabras_claves: data.palabras_claves || '',
            year_presentacion: data.year_presentacion || '',
            file_path: data.file_path || ''
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error al cargar la crónica.");
          setLoading(false);
        });
    }
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Actualizando...");

    try {
      let finalFilePath = formData.file_path;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Documentos')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: true });

        if (uploadError) throw new Error(uploadError.message);
        finalFilePath = filePath;
      } else {
        toast.info("No se seleccionó un nuevo archivo, se mantendrá el actual.");
      }

      await fetchApi(`/revista/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...formData, file_path: finalFilePath }),
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica actualizada con éxito.');
      router.push(`/chronicles/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error(err instanceof Error ? err.message : 'Error al actualizar.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación de forma permanente?')) return;
    
    const loadingToast = toast.loading("Eliminando publicación...");

    try {
      await fetchApi(`/revista/${id}`, {
        method: 'DELETE',
      });

      toast.dismiss(loadingToast);
      toast.success('Publicación eliminada correctamente.');
      router.push('/view');
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la crónica.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 uppercase tracking-widest text-sm">Cargando editor...</div>;

  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="min-h-screen py-16 px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif italic text-white">Editar Publicación</h1>
              <button 
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold uppercase tracking-wider transition-all"
              >
                Eliminar Publicación
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded-2xl shadow-2xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título</label>
                  <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Autor</label>
                  <input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Correo</label>
                  <input type="email" value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Año Presentación</label>
                  <input type="number" value={formData.year_presentacion} onChange={(e) => setFormData({...formData, year_presentacion: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Materia</label>
                <select value={formData.materia} onChange={(e) => setFormData({...formData, materia: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500">
                  <option value="Mecánica">Mecánica</option>
                  <option value="Automatización">Automatización, Control y Robótica</option>
                  <option value="Informática">Informática — Desarrollo de Software</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Instrumentación">Instrumentación y Control</option>
                  <option value="Telecom/Mecánica">Telecomunicaciones · Mecánica</option>
                  <option value="Mantenimiento/Admin">Mantenimiento · Administración</option>
                  <option value="Contaduria">Contaduría Pública</option>
                  <option value="Agro">Agroalimentación</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Palabras clave</label>
                <input value={formData.palabras_claves} onChange={(e) => setFormData({...formData, palabras_claves: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={5} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reemplazar archivo (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-4 bg-[#0b1b2e] text-slate-400 border border-white/10 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-sky-900 file:text-white hover:file:bg-sky-800 transition-all" 
                />
                <p className="text-[9px] text-slate-500 italic">Opcional: Si no selecciona archivo, se mantendrá el actual.</p>
              </div>

              <button type="submit" className="w-full py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase text-xs rounded transition-all">
                Guardar Cambios
              </button>
            </form>
          </motion.div>
        </div>
      </AdminGuard>
    </ProtectedRoute>
  );
}
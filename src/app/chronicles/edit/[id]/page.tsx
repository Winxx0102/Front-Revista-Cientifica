'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
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
    title: '', content: '', author: '', correo: '', materia: '', palabras_claves: '', year_presentacion: '' 
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchApi(`/revista/${id}`)
        .then((data) => {
          setFormData({ 
            title: data.title, 
            content: data.content,
            author: data.author || '',
            correo: data.correo || '',
            materia: data.materia || '',
            palabras_claves: data.palabras_claves || '',
            year_presentacion: data.year_presentacion || ''
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
      // Usamos JSON directamente si tu API backend soporta el envío de campos junto al archivo
      // o ajustamos según tu implementación de fetchApi
      await fetchApi(`/revista/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData), 
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica actualizada con éxito.');
      router.push(`/revista/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error('Error al actualizar.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 uppercase tracking-widest text-sm">Cargando editor...</div>;

  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="min-h-screen py-16 px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-serif italic text-white mb-8">Editar Publicación</h1>
            
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
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchApi(`/revista/${id}`)
        .then((data) => {
          setFormData({ title: data.title, content: data.content });
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

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('content', formData.content);
    if (selectedFile) {
      dataToSend.append('file', selectedFile);
    }

    try {
      await fetchApi(`/revista/${id}`, {
        method: 'PATCH',
        body: dataToSend, 
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica actualizada con éxito.');
      router.push(`/revista/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error('Error al actualizar.');
    }
  };

  const handleDelete = () => {
    toast.warning('¿Eliminar crónica?', {
      description: "Esta acción es irreversible.",
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            await fetchApi(`/revista/${id}`, { method: 'DELETE' });
            toast.success('Crónica eliminada.');
            router.push('/dashboard');
          } catch {
            toast.error("Error al eliminar.");
          }
        }
      }
    });
  };

  if (loading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500 uppercase tracking-widest text-sm">Cargando editor...</div>;

  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-serif italic text-white mb-8">Editar Publicación</h1>
            
            <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded-2xl shadow-2xl space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título</label>
                <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={10} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reemplazar Archivo</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-4 bg-[#0b1b2e] text-slate-400 border border-white/10 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-sky-900 file:text-white"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button type="submit" className="flex-1 py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase text-xs rounded transition-all">
                  Guardar Cambios
                </button>
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="px-8 py-4 border border-red-900/50 text-red-400 hover:bg-red-900/20 font-bold uppercase text-xs rounded transition-all"
                >
                  Eliminar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AdminGuard>
    </ProtectedRoute>
  );
}
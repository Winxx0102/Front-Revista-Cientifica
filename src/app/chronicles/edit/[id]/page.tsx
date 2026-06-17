'use client';
import { useEffect, useState, type ReactNode, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminGuard from '@/components/AdminGuard';

// ... (El componente AdminGuard se queda igual que lo tienes) ...

export default function EditChroniclePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user, isLoading } = useAuth();
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

    // Usamos FormData para enviar el archivo junto con el texto
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('content', formData.content);
    if (selectedFile) {
      dataToSend.append('file', selectedFile);
    }

    try {
      // NOTA: Asegúrate que tu servicio fetchApi soporte FormData y no añada Content-Type: application/json
      await fetchApi(`/revista/${id}`, {
        method: 'PATCH',
        body: dataToSend, 
        // Si usas headers manuales en fetchApi, asegúrate de que al ser FormData 
        // NO lleven Content-Type, el navegador lo pone automáticamente.
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica actualizada con éxito.');
      router.push(`/revista/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error('Error al actualizar.');
    }
  };

  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl space-y-8">
              {/* Título y Contenido (igual que antes) */}
              <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded" />
              <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={12} className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded" />

              {/* Selector de Archivo Nuevo */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reemplazar Documento Adjunto</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-4 bg-[#0b1b2e] text-slate-400 border border-white/10 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-sky-900 file:text-white"
                />
              </div>

              <button type="submit" className="w-full py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase rounded">
                Guardar Cambios
              </button>
            </form>
          </motion.div>
        </div>
      </AdminGuard>
    </ProtectedRoute>
  );
}
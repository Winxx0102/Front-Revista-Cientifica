'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

// --- Componente de Protección Interno ---
function AdminGuard({ children, user, isLoading, router }: {
  children: ReactNode;
  user: { role?: string } | null;
  isLoading: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      toast.error("Acceso denegado: Se requieren permisos administrativos.");
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500 uppercase tracking-widest text-sm">Validando acceso...</div>;
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') return null;
  return <>{children}</>;
}

export default function EditChroniclePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({ title: '', content: '' });
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
    const loadingToast = toast.loading("Guardando cambios...");

    try {
      await fetchApi(`/revista/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      toast.dismiss(loadingToast);
      toast.success('Crónica actualizada correctamente.');
      router.push(`/revista/${id}`);
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      toast.error('Error al actualizar la publicación.');
    }
  };

  const handleDelete = () => {
    toast.warning('¿Desea eliminar esta crónica?', {
      description: "Esta acción es irreversible y afectará al portal.",
      action: {
        label: "Confirmar eliminación",
        onClick: async () => {
          try {
            await fetchApi(`/revista/${id}`, { method: 'DELETE' });
            toast.success('Crónica eliminada del sistema.');
            router.push('/dashboard');
          } catch {
            toast.error("Error al eliminar la crónica.");
          }
        }
      }
    });
  };

  if (loading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500 uppercase tracking-widest text-sm">Cargando editor...</div>;

  return (
     <ProtectedRoute>
    <AdminGuard user={user} isLoading={isLoading} router={router}>
      <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-12 border-l-2 border-sky-700 pl-6">
            <h1 className="text-4xl font-serif italic text-white mb-2">Editar Publicación</h1>
            <p className="text-slate-400">Panel de control administrativo para modificar el contenido.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Título del Artículo</label>
              <input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contenido Técnico</label>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={12}
                className="w-full p-4 bg-[#0b1b2e] border border-white/10 text-white rounded outline-none focus:border-sky-500 transition-all resize-none"
              />
            </div>
            
            <div className="flex gap-6 pt-4">
              <button 
                type="submit" 
                className="flex-1 py-4 bg-sky-700 hover:bg-sky-600 text-white font-bold uppercase tracking-widest text-xs transition-all rounded"
              >
                Guardar Cambios
              </button>
              
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-8 py-4 border border-red-900/50 text-red-400 hover:bg-red-900/20 font-bold uppercase tracking-widest text-xs transition-all rounded"
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
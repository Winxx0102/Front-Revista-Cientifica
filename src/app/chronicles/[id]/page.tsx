'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFilePdf, FaDownload, FaEnvelope, FaCalendar, FaBook, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';

export default function ChronicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  interface Chronicle {
    id?: string; 
    _id?: string; 
    title?: string; 
    author?: string; 
    content?: string; 
    file_path?: string;
    correo?: string;
    materia?: string;
    palabras_claves?: string;
    year_presentacion?: string;
    isApproved?: boolean;
    userId?: number;
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  const loadChronicle = () => {
    const id = params?.id;
    if (!id) return;
    
    fetchApi(`/revista/${id}`)
      .then((data) => { 
        setChronicle(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadChronicle();
  }, [params.id]);

  const handleApprove = async () => {
    try {
      const id = params?.id;
      await fetchApi(`/revista/${id}/approve`, { method: 'PATCH' });
      toast.success("Artículo autorizado y publicado con éxito.");
      loadChronicle();
    } catch (err) {
      console.error(err);
      toast.error("Error al autorizar el artículo.");
    }
  };

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    const PROJECT_ID = 'citlayiapryuepjhdofv';
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${normalizedPath}`;
  };

  if (loading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando crónica...</div>;
  }

  if (!chronicle) {
    return <div className="min-h-screen text-white flex items-center justify-center">Crónica no encontrada.</div>;
  }

  const fileUrl = getFileUrl(chronicle.file_path);
  const isAdmin = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');
  
  // Verificamos si el usuario actual es el creador del artículo
  type AuthUserLike = {
    id?: string | number;
    userId?: string | number;
    role?: string;
  };

  const currentUserId = user
    ? Number((user as AuthUserLike).id ?? (user as AuthUserLike).userId ?? NaN)
    : NaN;
  const isOwner = !authLoading && user && chronicle.userId && Number(chronicle.userId) === currentUserId;
  const canViewStatus = isAdmin || isOwner;

  return (
    <div className="min-h-screen py-16 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-sky-400 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <FaArrowLeft size={10} /> Volver
          </button>

          {/* Indicador de Estado visible para Admins y para el Dueño del artículo */}
          {canViewStatus && (
            <div className="flex items-center gap-3">
              {chronicle.isApproved ? (
                <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <FaCheckCircle /> Aprobado / Público
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <FaExclamationTriangle /> En Revisión (Pendiente)
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={handleApprove}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      Autorizar Ahora
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <article className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl">
          <h1 className="text-4xl font-serif text-white mb-3">{chronicle.title}</h1>
          <p className="text-sm text-sky-400 font-medium mb-6">Por: {chronicle.author}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-4 bg-[#0b1b2e] rounded border border-white/5">
             <div className="text-[10px] text-slate-400">
                <span className="block font-bold uppercase mb-1">Materia</span>
                <span className="text-white flex items-center gap-1"><FaBook size={10}/> {chronicle.materia}</span>
             </div>
             <div className="text-[10px] text-slate-400">
                <span className="block font-bold uppercase mb-1">Año</span>
                <span className="text-white flex items-center gap-1"><FaCalendar size={10}/> {chronicle.year_presentacion}</span>
             </div>
             <div className="text-[10px] text-slate-400 col-span-2">
                <span className="block font-bold uppercase mb-1">Contacto</span>
                <span className="text-white flex items-center gap-1"><FaEnvelope size={10}/> {chronicle.correo}</span>
             </div>
          </div>

          <div className="text-slate-300 leading-relaxed text-lg font-light text-justify mb-10">
            {chronicle.content}
          </div>

          {chronicle.palabras_claves && (
            <div className="mb-8 flex flex-wrap gap-2">
              {chronicle.palabras_claves.split(',').map((tag, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-900/20 px-3 py-1 rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {fileUrl && (
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <FaFilePdf className="text-red-400" /> Gestión del documento
              </h3>
              
              <div className="flex flex-col md:flex-row gap-4">
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-sky-700 hover:bg-sky-600 text-white uppercase font-bold text-xs transition-all rounded"
                >
                  <FaFilePdf /> Leer documento
                </a>

                <a 
                  href={fileUrl} 
                  download
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-[#0b1b2e] border border-white/10 text-slate-300 hover:bg-white/5 uppercase font-bold text-xs transition-all rounded"
                >
                  <FaDownload /> Descargar PDF
                </a>
              </div>
            </div>
          )}

          {(isAdmin || isOwner) && (
            <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
              <button 
                onClick={() => router.push(`/chronicles/edit/${chronicle.id || chronicle._id}`)} 
                className="px-8 py-3 bg-sky-700 hover:bg-sky-600 text-white font-bold transition-all text-[10px] uppercase tracking-widest rounded"
              >
                Editar Artículo
              </button>
            </div>
          )}
        </article>
      </motion.div>
    </div>
  );
}
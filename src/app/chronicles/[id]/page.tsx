'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFilePdf, FaDownload } from 'react-icons/fa';

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
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    
    fetchApi(`/revista/${id}`)
      .then((data) => { 
        setChronicle(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    const PROJECT_ID = 'citlayiapryuepjhdofv';
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${normalizedPath}`;
  };

  if (loading || authLoading) {
    return <div className="min-h-screen  flex items-center justify-center text-slate-500">Cargando crónica...</div>;
  }

  if (!chronicle) {
    return <div className="min-h-screen  text-white flex items-center justify-center">Crónica no encontrada.</div>;
  }

  const fileUrl = getFileUrl(chronicle.file_path);
  const isPdf = chronicle.file_path?.toLowerCase().endsWith('.pdf');
  const canEdit = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  return (
    <div className="min-h-screen  py-16 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-sky-400 mb-8 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
        >
          <FaArrowLeft size={10} /> Volver al índice
        </button>

        <article className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl">
          <h1 className="text-4xl font-serif text-white mb-3">{chronicle.title}</h1>
          <p className="text-sm text-sky-400 font-medium mb-10 border-b border-white/5 pb-6">
            Por: {chronicle.author}
          </p>

          <div className="text-slate-300 leading-relaxed text-lg font-light text-justify mb-12">
            {chronicle.content}
          </div>

          {fileUrl && (
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <FaFilePdf className="text-red-400" /> Documento adjunto
              </h3>
              
              {isPdf ? (
                <iframe 
                  src={fileUrl} 
                  className="w-full h-[600px] rounded border border-white/10 bg-white"
                  title="Vista previa del documento"
                />
              ) : (
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-3 p-4 bg-sky-900/20 text-sky-400 uppercase font-bold text-xs hover:bg-sky-900/40 transition-all rounded"
                >
                  <FaDownload /> Descargar archivo
                </a>
              )}
            </div>
          )}

          {canEdit && (
            <div className="mt-12 pt-8 border-t border-white/5">
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
} //hola
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function ChronicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  interface Chronicle {
    id?: string; _id?: string; title?: string; author?: string; content?: string; file_path?: string;
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    
    fetchApi(`/revista/${id}`)
      .then((data) => { 
        console.log("DEBUG: Datos recibidos de la API:", data); // <--- DEBUG 1
        setChronicle(data); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("DEBUG: Error al cargar crónica:", err); // <--- DEBUG 2
        setLoading(false);
      });
  }, [params.id]);

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    const PROJECT_ID = 'citlayiapryuepjhdofv';
    const url = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${path}`;
    console.log("DEBUG: URL final del archivo:", url); // <--- DEBUG 3
    return url;
  };

  if (loading || authLoading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500">Cargando...</div>;
  if (!chronicle) return <div className="min-h-screen text-white flex items-center justify-center">No encontrada.</div>;

  const fileUrl = getFileUrl(chronicle.file_path);
  const isPdf = chronicle.file_path?.toLowerCase().endsWith('.pdf');
  const canEdit = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  return (
    <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-[0.2em]">
          <FaArrowLeft size={10} /> Volver
        </button>

        <article className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl">
          <h1 className="text-4xl font-serif text-white mb-3">{chronicle.title}</h1>
          
          {/* DEBUG visual para el desarrollador */}
          <div className="bg-black/20 p-2 text-[9px] text-yellow-500 mb-4 overflow-x-auto">
            Path en DB: {chronicle.file_path || "Nulo"} | URL: {fileUrl || "No generada"}
          </div>

          <div className="text-slate-300 leading-relaxed mb-10">{chronicle.content}</div>

          {fileUrl ? (
            <div className="mt-8 border-t border-white/5 pt-8">
              <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Documento adjunto:</h3>
              {isPdf ? (
                <iframe src={fileUrl} className="w-full h-[600px] rounded border border-white/10" title="PDF" />
              ) : (
                <a href={fileUrl} target="_blank" className="block p-4 bg-sky-900/20 text-sky-400 text-center uppercase font-bold text-xs">
                  Abrir Archivo
                </a>
              )}
            </div>
          ) : (
            <p className="text-red-500 text-xs">No hay archivo adjunto o la ruta es inválida.</p>
          )}
        </article>
      </motion.div>
    </div>
  );
}
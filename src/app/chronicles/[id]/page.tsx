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
  
  // Interfaz que debe coincidir exactamente con lo que devuelve tu backend
  interface Chronicle {
    id?: string; 
    _id?: string; 
    title?: string; 
    author?: string; 
    content?: string; 
    file_path?: string; // Asegúrate de que el backend envíe este nombre
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    
    // Llamada al backend
    fetchApi(`/revista/${id}`)
      .then((data) => { 
        console.log("DEBUG: Objeto completo recibido del Backend:", data);
        setChronicle(data); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("DEBUG: Error al conectar con la API:", err);
        setLoading(false);
      });
  }, [params.id]);

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    
    // ID de tu proyecto Supabase
    const PROJECT_ID = 'citlayiapryuepjhdofv';
    
    // Normalización: si el path no empieza con 'uploads/', se lo añadimos
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${normalizedPath}`;
  };

  if (loading || authLoading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500">Cargando...</div>;
  if (!chronicle) return <div className="min-h-screen bg-[#0b1b2e] text-white flex items-center justify-center">Crónica no encontrada.</div>;

  const fileUrl = getFileUrl(chronicle.file_path);
  const isPdf = chronicle.file_path?.toLowerCase().endsWith('.pdf');
  const canEdit = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  return (
    <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-[0.2em]">
          <FaArrowLeft size={10} /> Volver al índice
        </button>

        <article className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl">
          <h1 className="text-4xl font-serif text-white mb-3">{chronicle.title}</h1>
          <p className="text-sm text-sky-400 font-medium mb-6">Publicado por: {chronicle.author}</p>

          {/* DIAGNÓSTICO: Si ves 'Nulo' aquí, el backend no está enviando 'file_path' */}
          <div className="bg-black/20 p-2 text-[9px] text-yellow-500 mb-6 font-mono">
            DEBUG: DB Path = {chronicle.file_path || "NULO"} | URL Final = {fileUrl || "NO GENERADA"}
          </div>

          <div className="text-slate-300 leading-relaxed text-base font-light text-justify mb-10">
            {chronicle.content}
          </div>

          {fileUrl ? (
            <div className="mt-8 border-t border-white/5 pt-8">
              <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Documento adjunto:</h3>
              {isPdf ? (
                <iframe 
                  src={fileUrl} 
                  className="w-full h-[600px] rounded border border-white/10"
                  title="Vista previa del archivo"
                />
              ) : (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block p-4 bg-sky-900/20 text-sky-400 text-center uppercase font-bold text-xs hover:bg-sky-900/40 transition-all">
                  Descargar / Abrir Archivo
                </a>
              )}
            </div>
          ) : (
            <p className="text-slate-600 text-xs italic">No hay archivos adjuntos en esta crónica.</p>
          )}

          {canEdit && (
            <div className="mt-10 pt-8 border-t border-white/5">
              <button 
                onClick={() => router.push(`/chronicles/edit/${chronicle.id || chronicle._id}`)} 
                className="px-6 py-2 bg-sky-700 hover:bg-sky-600 text-white font-bold transition-all text-[10px] uppercase tracking-widest"
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
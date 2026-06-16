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
    id?: string; _id?: string; title?: string; author?: string; content?: string;
  }

  const [chronicle, setChronicle] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = !authLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    fetchApi(`/revista/${id}`)
      .then((data) => { setChronicle(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading || authLoading) return <div className="min-h-screen bg-[#0b1b2e] flex items-center justify-center text-slate-500">Cargando datos...</div>;
  if (!chronicle) return <div className="min-h-screen bg-[#0b1b2e] text-white flex items-center justify-center">Crónica no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
          <FaArrowLeft size={10} /> Volver al índice
        </button>

        <article className="bg-[#0e243d] border border-white/5 p-10 rounded shadow-2xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl font-serif text-white mb-3">{chronicle.title}</h1>
              <p className="text-sm text-sky-400 font-medium tracking-wide">Publicado por: {chronicle.author}</p>
            </div>

            {canEdit && (
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push(`/chronicles/edit/${chronicle.id || chronicle._id}`)} 
                  className="px-6 py-2 bg-sky-700 hover:bg-sky-600 text-white font-bold transition-all text-[10px] uppercase tracking-widest"
                >
                  Editar Artículo
                </button>
              </div>
            )}
          </div>

          <div className="text-slate-300 leading-relaxed text-base font-light text-justify">
            {chronicle.content}
          </div>
        </article>
      </motion.div>
    </div>
  );
}
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Importamos useRouter
import { motion } from 'framer-motion';
import { FaBook, FaCalendarAlt, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  content?: string;
  file_path?: string;
  materia?: string;
  year_presentacion?: string;
};

export default function ChronicleCard({ chronicle }: { chronicle: Chronicle | null }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (!chronicle) return null;

  const chronicleId = chronicle?.id || chronicle?._id;
  const canEdit = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    const PROJECT_ID = 'citlayiapryuepjhdofv';
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${normalizedPath}`;
  };

  const fileUrl = getFileUrl(chronicle?.file_path);

  // Nueva función para manejar el clic en toda la tarjeta
  const handleCardClick = () => {
    router.push(`/chronicles/${chronicleId}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      transition={{ duration: 0.2 }} 
      className="h-full cursor-pointer"
      onClick={handleCardClick} // Toda la tarjeta responde al clic
    >
      <div className="flex flex-col h-full bg-[#0e243d] border border-white/5 p-8 transition-all hover:border-sky-700/50 shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-serif text-white leading-tight">
            {chronicle?.title || 'Sin título'}
          </h3>
          {canEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); router.push(`/chronicles/edit/${chronicleId}`); }} 
              className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-sky-700 px-3 py-1 shrink-0 ml-2"
            >
              Editar
            </button>
          )}
        </div>

        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em] mb-4">
          {chronicle?.author || 'Anónimo'}
        </span>

        {/* Info Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {chronicle.materia && (
            <span className="flex items-center gap-1 text-[9px] bg-[#0b1b2e] px-2 py-1 rounded text-slate-400 uppercase tracking-wider">
              <FaBook size={8}/> {chronicle.materia}
            </span>
          )}
          {chronicle.year_presentacion && (
            <span className="flex items-center gap-1 text-[9px] bg-[#0b1b2e] px-2 py-1 rounded text-slate-400 uppercase tracking-wider">
              <FaCalendarAlt size={8}/> {chronicle.year_presentacion}
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 font-light italic mb-6">
          {chronicle?.content || 'Sin descripción disponible...'}
        </p>

        {/* Actions Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 flex gap-3">
          {fileUrl && (
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Esto evita que se abra el detalle al leer el PDF
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-sky-700 hover:bg-sky-600 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all rounded"
            >
              <FaFilePdf /> Leer PDF
            </a>
          )}
          
          <div className="px-4 py-3 flex items-center border border-white/5 text-slate-500 rounded">
            <FaExternalLinkAlt size={10} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
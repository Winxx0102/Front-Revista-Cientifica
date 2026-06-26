'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBook, FaCalendarAlt } from 'react-icons/fa';

type Chronicle = {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (chronicleId) router.push(`/chronicles/edit/${chronicleId}`);
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Link href={chronicleId ? `/chronicles/${chronicleId}` : '#'} className="block h-full">
        <div className="flex flex-col h-full bg-[#0e243d] border border-white/5 p-8 transition-all hover:border-sky-700/50 shadow-xl group">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-serif text-white group-hover:text-sky-400 transition-colors leading-tight">
              {chronicle?.title || 'Sin título'}
            </h3>
            {canEdit && (
              <button onClick={handleEdit} className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-sky-700 px-3 py-1 shrink-0">
                Editar
              </button>
            )}
          </div>

          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em] mb-4">
            {chronicle?.author || 'Anónimo'}
          </span>

          {/* Etiquetas de Información */}
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

          {/* Cuerpo */}
          <div className="flex-grow">
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 font-light italic">
              {chronicle?.content || 'Sin contenido disponible...'}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            {fileUrl ? (
              <span className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em]">PDF Adjunto</span>
            ) : (
              <span></span>
            )}
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-sky-700 transition-colors">
              Leer →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
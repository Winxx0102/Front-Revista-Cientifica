'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  authorEmail?: string;
  content?: string;
  file_path?: string; // Campo añadido para la ruta del archivo
};

export default function ChronicleCard({ chronicle }: { chronicle: Chronicle | null }) {
  const router = useRouter();
  const { user, isLoading } = useAuth(); 

  if (!chronicle) return null;

  const chronicleId = chronicle?.id || chronicle?._id;
  const canEdit = !isLoading && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN');

  // Función para construir la URL pública del archivo en Supabase
  const getFileUrl = (path: string | undefined) => {
    if (!path) return null;
    const PROJECT_ID = 'citlayiapryuepjhdofv'; // Tu ID de proyecto
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/Documentos/${path}`;
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
          
          {/* Header de la tarjeta */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-serif text-white group-hover:text-sky-400 transition-colors">
                {chronicle?.title || 'Sin título'}
              </h3>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em]">
                {chronicle?.author || 'Anónimo'}
              </span>
            </div>
            
            {canEdit && (
              <button 
                onClick={handleEdit} 
                className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-sky-700 px-3 py-1"
              >
                Editar
              </button>
            )}
          </div>

          {/* Cuerpo de la tarjeta */}
          <div className="flex-grow">
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 font-light italic">
              {chronicle?.content || 'Sin contenido disponible...'}
            </p>

            {/* Minivista del archivo */}
            {fileUrl && (
              <div className="mt-6">
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.858M12 4v1m0 16v-1m0-16h1m-1 16h1" />
                  </svg>
                  Ver archivo adjunto
                </a>
              </div>
            )}
          </div>

          {/* Footer de la tarjeta */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] group-hover:text-sky-700 transition-colors">
              Leer publicación →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
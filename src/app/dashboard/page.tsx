'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';

// Definición de imágenes para el carrusel
const carouselImages = ['/images/carrucel1xdd.jpeg', '/images/carrucel2xdd.jpeg'];

type Chronicle = {
  id?: string;
  title?: string;
  author?: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [chronicles, setChronicles] = useState<Chronicle[]>(([] as Chronicle[]));
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'author' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0); // Estado del carrusel
  const itemsPerPage = 6;

  // Lógica del Carrusel (Auto-play cada 5 segundos)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadChronicles = async () => {
      try {
        const data = await fetchApi('/revista');
        if (Array.isArray(data)) setChronicles(data);
      } catch (error) {
        console.error('Error fetching chronicles:', error);
      }
    };
    loadChronicles();
  }, []);

  // ... (tus useMemo de filtrado y paginación se mantienen igual)

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-slate-200">
        <main className="max-w-7xl mx-auto px-6 py-16">
          
          {/* Carrusel Integrado */}
          <div className="relative w-full h-64 md:h-80 mb-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={carouselImages[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
                alt="Banner institucional"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b2e] via-transparent to-transparent flex items-end p-8">
              <p className="text-white/80 font-serif italic text-lg">Saberes Politécnicos: Comunidad de Investigación UPTA</p>
            </div>
          </div>

          {/* Banner estilo "Saberes Politécnicos" */}
          <div className="bg-gradient-to-r from-[#0e243d] to-[#0b1b2e] border border-white/5 p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-serif italic text-white mb-2">Explorar artículos</h1>
              <p className="text-slate-400 max-w-lg">Repositorio de proyectos de grado y artículos científicos bajo revisión por pares.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#142840] p-4 rounded-xl border border-white/5 text-center">
                <p className="text-2xl font-black text-sky-400">{chronicles.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Publicaciones</p>
              </div>
            </div>
          </div>

          {/* ... resto de tu layout (Sidebar y Contenido) se mantiene igual */}
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 space-y-8">
              <div className="bg-[#0e243d] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FaInfoCircle className="text-sky-500"/> Información</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consulte nuestra convocatoria abierta para el Vol. 1, N.° 2. Artículos orientados a investigación aplicada en ingeniería y tecnología.
                </p>
              </div>
            </aside>
            <div className="flex-1">
              {/* ... filtros y grid de cards ... */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
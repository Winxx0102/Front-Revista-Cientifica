'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';

const carouselImages = ['/images/carrucel1xdd.jpeg', '/images/carrucel2xdd.jpeg'];

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'author' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/revista');
        setChronicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar crónicas:", err);
      }
    };
    if (user) loadData();
  }, [user]);

  const filteredChronicles = useMemo(() => {
    return chronicles.filter(c => {
      const searchLower = search.toLowerCase();
      const title = c.title?.toString().toLowerCase() || '';
      const author = c.author?.toString().toLowerCase() || '';
      if (filterBy === 'title') return title.includes(searchLower);
      if (filterBy === 'author') return author.includes(searchLower);
      return title.includes(searchLower) || author.includes(searchLower);
    });
  }, [chronicles, search, filterBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(start, start + itemsPerPage);
  }, [filteredChronicles, currentPage]);

  const totalPages = Math.ceil(filteredChronicles.length / itemsPerPage);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] text-slate-200">
        <main className="max-w-7xl mx-auto px-6 py-16">
          
          {/* Carrusel */}
          <div className="relative w-full h-64 md:h-80 mb-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={carouselImages[currentIndex]}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
                alt="Banner institucional"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b2e] via-transparent to-transparent flex items-end p-8">
              <p className="text-white/80 font-serif italic text-lg">Saberes Politécnicos: Comunidad de Investigación UPTA</p>
            </div>
          </div>

          {/* Banner y Filtros */}
          <div className="bg-gradient-to-r from-[#0e243d] to-[#0b1b2e] border border-white/5 p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-serif italic text-white mb-2">Explorar artículos</h1>
              <p className="text-slate-400 max-w-lg">Repositorio de proyectos de grado y artículos científicos.</p>
            </div>
            <div className="bg-[#142840] p-4 rounded-xl border border-white/5 text-center">
              <p className="text-2xl font-black text-sky-400">{chronicles.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Publicaciones</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-80 space-y-8">
              <div className="bg-[#0e243d] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FaInfoCircle className="text-sky-500"/> Información</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Consulte nuestra convocatoria abierta para el Vol. 1, N.° 2.</p>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-4 text-slate-500" />
                  <input type="text" placeholder="Buscar título o autor..." className="w-full p-4 pl-12 bg-[#142840] border border-white/10 rounded-xl text-white outline-none focus:border-sky-500" onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                </div>
                <select className="p-4 bg-[#142840] border border-white/10 rounded-xl text-slate-300 outline-none" onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}>
                  <option value="all">Todo</option>
                  <option value="title">Por Título</option>
                  <option value="author">Por Autor</option>
                </select>
              </div>
              
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedData.map((c, index) => <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />)}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 text-sm rounded ${currentPage === i + 1 ? 'bg-white text-[#0b1b2e]' : 'bg-[#142840] text-slate-400'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion } from 'framer-motion';

type Chronicle = {
  id?: string;
  _id?: string;
  title?: string;
  author?: string;
  content?: string;
  [key: string]: unknown;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'author' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
        <main className="max-w-6xl mx-auto px-6 py-16">
          
          {/* Encabezado Editorial */}
          <div className="mb-16">
            <h1 className="text-5xl font-serif italic text-white mb-4">Explorar artículos</h1>
            <p className="text-slate-400">Selección de investigaciones y proyectos de la comunidad UPTA.</p>
          </div>
          
          {/* Filtros más sobrios */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <input 
              type="text"
              placeholder="Buscar título o autor..."
              className="flex-1 p-4 bg-[#142840] border border-white/10 rounded text-white outline-none focus:border-white/30 transition-all"
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            
            <select 
              className="md:w-48 p-4 bg-[#142840] border border-white/10 rounded text-slate-300 outline-none cursor-pointer hover:border-white/30"
              onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
              value={filterBy}
            >
              <option value="all">Todo</option>
              <option value="title">Por Título</option>
              <option value="author">Por Autor</option>
            </select>
          </div>
          
          {/* Grid de contenido */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedData.length > 0 ? (
              paginatedData.map((c, index) => (
                <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500 border border-slate-800 rounded">
                No se encontraron resultados para su búsqueda.
              </div>
            )}
          </motion.div>

          {/* Paginación minimalista */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm rounded transition-all ${
                    currentPage === i + 1 
                      ? 'bg-white text-[#0b1b2e] font-bold' 
                      : 'bg-[#142840] text-slate-400 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
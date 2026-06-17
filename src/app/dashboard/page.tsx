'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion } from 'framer-motion';
import { FaBook, FaSearch, FaInfoCircle } from 'react-icons/fa';

type Chronicle = {
  id?: string;
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
  const itemsPerPage = 6;

  useEffect(() => {
    const loadChronicles = async () => {
      try {
        const data = await fetchApi('/chronicles');
        if (Array.isArray(data)) {
          setChronicles(
            data.map((item: Chronicle) => ({
              ...item,
              id: item?.id != null ? String(item.id) : undefined,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching chronicles:', error);
      }
    };

    loadChronicles();
  }, []);

  const filteredChronicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chronicles;

    return chronicles.filter((chronicle) => {
      const title = String(chronicle.title || '').toLowerCase();
      const author = String(chronicle.author || '').toLowerCase();

      if (filterBy === 'title') {
        return title.includes(query);
      }
      if (filterBy === 'author') {
        return author.includes(query);
      }

      return title.includes(query) || author.includes(query);
    });
  }, [chronicles, filterBy, search]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredChronicles]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] text-slate-200">
        <main className="max-w-7xl mx-auto px-6 py-16">
          
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

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar informativo estilo áreas temáticas */}
            <aside className="lg:w-80 space-y-8">
              <div className="bg-[#0e243d] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FaInfoCircle className="text-sky-500"/> Información</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consulte nuestra convocatoria abierta para el Vol. 1, N.° 2. Artículos orientados a investigación aplicada en ingeniería y tecnología.
                </p>
              </div>
            </aside>

            {/* Contenido Principal */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Buscar título o autor..."
                    className="w-full p-4 pl-12 bg-[#142840] border border-white/10 rounded-xl text-white outline-none focus:border-sky-500 transition-all"
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <select 
                  className="p-4 bg-[#142840] border border-white/10 rounded-xl text-slate-300 outline-none cursor-pointer hover:border-white/30"
                  onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
                >
                  <option value="all">Todas las áreas</option>
                  <option value="title">Por Título</option>
                  <option value="author">Por Autor</option>
                </select>
              </div>
              
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedData.map((c, i) => <ChronicleCard key={c.id || i} chronicle={c} />)}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
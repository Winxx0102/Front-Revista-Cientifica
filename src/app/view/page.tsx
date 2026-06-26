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
  


  // Timer del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Carga de datos de la API
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

  // Filtrado de crónicas
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

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChronicles.slice(start, start + itemsPerPage);
  }, [filteredChronicles, currentPage]);

  const totalPages = Math.ceil(filteredChronicles.length / itemsPerPage);

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-slate-200 bg-[#0b1b2e]">
        
    

        {/* 5. EXPLORADOR E INTEGRACIÓN DE ARTÍCULOS ACTIVOS */}
        <div id="articulos" className="max-w-7xl mx-auto px-6 py-16">
           <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-tight tracking-tight">
                Articulos Cientificos<br />Repositorios <br />
              </h2>
          {/* Banner de estadísticas dinámico */}
          <div className="bg-gradient-to-r from-[#0e243d] to-[#0b1b2e] border border-white/5 p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-4xl font-serif italic text-white mb-2">Últimos artículos publicados</h2>
              <p className="text-slate-400 max-w-lg">Repositorio de proyectos de grado y artículos científicos activos de la comunidad académica.</p>
            </div>
            <div className="bg-[#142840] p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
              <p className="text-3xl font-black text-sky-400">{chronicles.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Publicaciones</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar informativo */}
            <aside className="lg:w-80 space-y-8">
              <div className="bg-[#0e243d] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-sky-500"/> Información Editorial
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consulte nuestra convocatoria abierta para el Vol. 1, N.° 2. Todos los artículos indexados cuentan con revisión ciega por pares evaluadores calificados.
                </p>
              </div>
            </aside>

            {/* Buscador, Filtros y Render de Grilla Interactiva */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar título o autor..." 
                    className="w-full p-4 pl-12 bg-[#142840] border border-white/10 rounded-xl text-white outline-none focus:border-sky-500 transition-all text-sm placeholder:text-slate-600" 
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
                  />
                </div>
                <select 
                  className="p-4 bg-[#142840] border border-white/10 rounded-xl text-slate-300 outline-none text-sm cursor-pointer"
                  onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
                >
                  <option value="all">Todo</option>
                  <option value="title">Por Título</option>
                  <option value="author">Por Autor</option>
                </select>
              </div>
              
              {/* Contenedor dinámico mapeado (Reemplaza a home-articles-preview) */}
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedData.map((c, index) => (
                  <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />
                ))}
              </motion.div>

              {/* Botones de paginación reactiva */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)} 
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${currentPage === i + 1 ? 'bg-white text-[#0b1b2e] shadow-lg' : 'bg-[#142840] text-slate-400 hover:text-white'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
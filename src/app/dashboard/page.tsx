'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

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
  
  // Refresco controlado al entrar al Dashboard
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('dashboardRefreshed');
    
    if (!hasRefreshed) {
      sessionStorage.setItem('dashboardRefreshed', 'true');
      window.location.reload();
    }
    
    return () => {
      sessionStorage.removeItem('dashboardRefreshed');
    };
  }, []);

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
      <div className="min-h-screen text-slate-200 ">
        
        {/* 1. FRANJA INSTITUCIONAL */}
        <div className="bg-[#0e243d] border-b border-white/5 py-4 w-full">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
            <img 
              src="/images/imagen.jpg" 
              alt="Logo Universidad Politécnica Territorial del Estado Aragua" 
              className="w-12 h-12 rounded object-cover border border-white/10"
            />
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-medium text-white">Universidad Politécnica Territorial del Estado Aragua</span>
              <span className="text-xs text-slate-400">Federico Brito Figueroa · Aragua, Venezuela</span>
            </div>
          </div>
        </div>

        {/* 2. HERO SECCIÓN COMBINADA CON CARRUSEL ANIMADO */}
        <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0e243d] to-[#0b1b2e] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Textos del Hero */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <p className="text-sky-400 font-mono tracking-widest text-xs uppercase bg-sky-500/10 px-3 py-1.5 rounded w-max border border-sky-500/20">
                Revista Científica Digital · Vol. 1, N.° 1 · 2026
              </p>
              <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight tracking-tight">
                Saberes<br />Politécnicos
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                Conocimiento politécnico al alcance de todos. Artículos de investigación de maestría y repositorio de proyectos de grado de pregrado, con acceso abierto y revisión por pares.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/view" className="bg-sky-700 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-sky-900/20">
                  Explorar artículos
                </Link>
                <Link href="view" className="bg-[#142840] hover:bg-[#1a3352] text-slate-300 font-medium px-6 py-3 rounded-xl border border-white/10 transition-all">
                  Repositorio de proyectos
                </Link>
                <a href="https://upta.edu.ve/" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-medium px-6 py-3 rounded-xl transition-all">
                  Portal institucional
                </a>
              </div>
              <p className="text-xs font-mono text-slate-500 pt-6">
                Depósito Legal: AR2026000105 · ISSN: en trámite
              </p>
            </div>

            {/* Render interactivo del Carrusel Animado */}
            <div className="lg:col-span-5 relative w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={carouselImages[currentIndex]}
                  initial={{ opacity: 0, scale: 1.02 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover"
                  alt="Banner institucional"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b2e]/90 via-transparent to-transparent flex items-end p-6">
                <p className="text-white/80 font-serif italic text-sm">Comunidad de Investigación UPTA</p>
              </div>
            </div>
          </div>
          {/* Saberes */}

          {/* Decoración geométrica SVG Original */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-30 pointer-events-none hidden lg:block" aria-hidden="true">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-sky-500/20">
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
              <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" opacity="0.09"/>
              <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.8" opacity="0.18"/>
              <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.3" opacity="0.1"/>
              <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.3" opacity="0.1"/>
            </svg>
          </div>
        </div>

        {/* 3. CARACTERÍSTICAS RÁPIDAS (Quick Features Grid) */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#142840] p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 className="text-white font-bold text-base">Acceso abierto</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Contenido digital de acceso abierto, concebido para difusión académica y consulta pública.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#142840] p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base">Revisión por pares</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Proceso editorial orientado a evaluación académica, rigor metodológico y mejora continua.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#142840] p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base">Enfoque politécnico</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Investigación aplicada en ingeniería, tecnología, administración y ciencias del entorno UPTA.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#142840] p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base">Formato digital</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Publicación nativa digital con navegación sencilla, búsqueda integrada y lectura en cualquier dispositivo.</p>
            </div>

          </div>
        </div>

        {/* 4. CONVOCATORIA ABIERTA SECCIÓN EDITORIAL */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/5">
          <div className="bg-gradient-to-br from-[#0e243d] to-[#142840] border border-white/10 rounded-2xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contenido Convocatoria */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-3xl font-serif italic text-white">Convocatoria abierta</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Invitamos a estudiantes de maestría (PNFA) y pregrado (PNF) de la UPTA a enviar sus artículos científicos y resúmenes de proyectos de grado para el <strong className="text-sky-400 font-semibold">Vol. 1, N.° 2 (julio–diciembre 2026)</strong>.
              </p>
              <p className="text-xs font-mono text-slate-400">
                Fecha de recepción del próximo número: <span className="text-sky-300 font-bold">por anunciar por el comité editorial</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/normas" className="bg-sky-700 hover:bg-sky-600 text-white font-medium text-xs px-5 py-3 rounded-lg transition-all">
                  Ver normas para autores
                </Link>

                <Link href="/chronicles/create" className="bg-[#0b1b2e] hover:bg-[#11243a] text-slate-300 font-medium text-xs px-5 py-3 rounded-lg border border-white/5 transition-all">
                  Enviar trabajo
                </Link>
              </div>
            </div>

            {/* Columnas de Áreas Temáticas */}
            <div className="lg:col-span-5 bg-[#0b1b2e]/50 border border-white/5 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-serif font-bold text-lg border-b border-white/5 pb-2">Áreas temáticas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Artículos (Maestría)</h4>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                    <li>Mecánica</li>
                    <li>Automatización, Control y Robótica</li>
                    <li>Informática — Software</li>
                    <li>Electricidad</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Repositorio (Pregrado)</h4>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                    <li>Instrumentación y Control</li>
                    <li>Telecomunicaciones</li>
                    <li>Mantenimiento / Administración</li>
                    <li>Agroalimentación</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. EXPLORADOR E INTEGRACIÓN DE ARTÍCULOS ACTIVOS */}
        <div id="articulos" className="max-w-7xl mx-auto px-6 py-16">
          
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
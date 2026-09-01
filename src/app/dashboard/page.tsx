'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChronicleCard from '@/components/ChroniclesCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaInfoCircle, FaChevronLeft, FaChevronRight, FaBookOpen, FaUniversity, FaLayerGroup, FaStar } from 'react-icons/fa';
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
  const [isMounted] = useState(true);
  const itemsPerPage = 6;

  // Refresco controlado al entrar al Dashboard (INTACTO)
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('dashboardRefreshed');

    if (!hasRefreshed) {
      sessionStorage.setItem('dashboardRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  // Timer del carrusel con efecto suave
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

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

  // Evitamos renderizado fantasma hasta que el cliente esté completamente montado
  if (!isMounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-slate-100 bg-[#050e19] relative overflow-hidden selection:bg-sky-500/30 selection:text-sky-200">
        
        {/* Iluminación de fondo ambiental ultra refinada */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-sky-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-indigo-500/[0.06] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[140px] pointer-events-none" />

        {/* 1. FRANJA INSTITUCIONAL */}
        <div className="bg-[#0b1d33]/90 backdrop-blur-xl border-b border-white/[0.08] py-4 w-full relative z-10 shadow-lg shadow-black/20">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                <img 
                  src="/images/imagen.jpg" 
                  alt="Logo Universidad Politécnica Territorial del Estado Aragua" 
                  className="relative w-12 h-12 rounded-xl object-cover border border-sky-500/30 shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-serif tracking-wide text-white font-medium">Universidad Politécnica Territorial del Estado Aragua</span>
                <span className="text-xs text-sky-400/90 font-mono flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span> Federico Brito Figueroa · Aragua, Venezuela</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-[11px] font-mono text-slate-400">
              <FaStar className="text-sky-400 text-xs" /> Portal Académico Activo
            </div>
          </div>
        </div>

        {/* 2. HERO SECCIÓN COMBINADA CON CARRUSEL OPTIMIZADO */}
        <div className="relative border-b border-white/[0.06] bg-gradient-to-b from-[#0b1d33]/70 via-[#071321] to-[#050e19] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            
            {/* Textos del Hero */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-xs font-bold uppercase tracking-widest border border-sky-500/20 shadow-inner">
                <FaUniversity className="w-3.5 h-3.5" /> Revista Científica Digital · Vol. 1, N.° 1 · 2026
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-[1.08] tracking-tight drop-shadow-sm">
                Saberes<br />
                <span className="bg-gradient-to-r from-sky-200 via-sky-400 to-indigo-300 bg-clip-text text-transparent not-italic font-sans font-extrabold">Politécnicos</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-light">
                Conocimiento politécnico al alcance de todos. Artículos de investigación de maestría y repositorio de proyectos de grado de pregrado, con acceso abierto y rigurosa revisión por pares.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="#articulos" className="group bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium px-7 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-sky-900/40 text-sm flex items-center gap-2.5 transform hover:-translate-y-0.5">
                  <FaBookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" /> Explorar artículos
                </Link>
                <Link href="/chronicles/create" className="bg-[#0f2744] hover:bg-[#153358] text-slate-200 font-medium px-7 py-4 rounded-2xl border border-white/10 transition-all duration-300 text-sm shadow-lg shadow-black/25 transform hover:-translate-y-0.5">
                  Enviar trabajo
                </Link>
                <a href="https://upta.edu.ve/" target="_blank" rel="noopener noreferrer" className="bg-transparent hover:bg-white/[0.04] text-slate-400 hover:text-white font-medium px-6 py-4 rounded-2xl border border-transparent hover:border-white/10 transition-all text-sm flex items-center">
                  Portal UPTA
                </a>
              </div>
              <div className="pt-4 flex items-center gap-3 text-xs font-mono text-slate-400 border-t border-white/[0.06]">
                <span className="text-sky-400 font-semibold">Depósito Legal:</span> AR2026000105
                <span className="text-white/20">•</span>
                <span className="text-sky-400 font-semibold">ISSN:</span> en trámite
              </div>
            </div>

            {/* Carrusel Extra Grande */}
            <div className="lg:col-span-6 relative w-full h-[420px] md:h-[510px] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group ring-1 ring-white/10">
              <div className="absolute inset-0 bg-sky-950/20 z-0"></div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={carouselImages[currentIndex]}
                  initial={{ opacity: 0, scale: 1.08 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                  alt="Banner institucional UPTA"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e19] via-[#050e19]/30 to-black/30 flex items-end justify-between p-8 pointer-events-none z-10">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-sky-300 bg-sky-500/25 px-3 py-1 rounded-full backdrop-blur-md border border-sky-400/30 shadow-lg inline-block">Galería Institucional</span>
                  <p className="text-white font-serif italic text-xl md:text-2xl drop-shadow-lg font-medium">Comunidad de Investigación UPTA</p>
                </div>
                <div className="flex gap-2.5 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                  {carouselImages.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentIndex(i)} 
                      className={`h-2 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-8 bg-sky-400 shadow-md shadow-sky-500/50' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                      aria-label={`Ir a la diapositiva ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={prevSlide}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-600 hover:scale-105 shadow-xl z-20"
                aria-label="Anterior"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-600 hover:scale-105 shadow-xl z-20"
                aria-label="Siguiente"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 3. CARACTERÍSTICAS RÁPIDAS */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0b1d33]/80 hover:bg-[#0f2744] transition-all duration-300 p-7 rounded-3xl border border-white/[0.08] shadow-lg space-y-4 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 className="text-white font-bold text-base tracking-wide">Acceso abierto</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">Contenido digital de acceso libre, concebido para difusión académica y consulta pública permanente.</p>
            </div>

            <div className="bg-[#0b1d33]/80 hover:bg-[#0f2744] transition-all duration-300 p-7 rounded-3xl border border-white/[0.08] shadow-lg space-y-4 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base tracking-wide">Revisión por pares</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">Proceso editorial orientado a la evaluación académica estricta, rigor metodológico y mejora continua.</p>
            </div>

            <div className="bg-[#0b1d33]/80 hover:bg-[#0f2744] transition-all duration-300 p-7 rounded-3xl border border-white/[0.08] shadow-lg space-y-4 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base tracking-wide">Enfoque politécnico</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">Investigación aplicada en ingeniería, tecnología, administración y ciencias del entorno UPTA.</p>
            </div>

            <div className="bg-[#0b1d33]/80 hover:bg-[#0f2744] transition-all duration-300 p-7 rounded-3xl border border-white/[0.08] shadow-lg space-y-4 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-white font-bold text-base tracking-wide">Formato digital</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">Publicación nativa con navegación optimizada, búsqueda integrada y lectura fluida en dispositivos.</p>
            </div>

          </div>
        </div>

        {/* 4. CONVOCATORIA ABIERTA SECCIÓN EDITORIAL */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/[0.06]">
          <div className="bg-gradient-to-br from-[#0b1d33] via-[#071424] to-[#050e19] border border-white/[0.1] rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="lg:col-span-7 space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/15 px-3 py-1 rounded-full border border-sky-500/25">Proceso Activo</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white">Convocatoria abierta</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                Invitamos a estudiantes de maestría (PNFA) y pregrado (PNF) de la UPTA a enviar sus artículos científicos y resúmenes de proyectos de grado para el <strong className="text-sky-300 font-semibold">Vol. 1, N.° 2 (julio–diciembre 2026)</strong>.
              </p>
              <p className="text-xs font-mono text-slate-400 bg-black/20 p-3 rounded-xl border border-white/[0.05] inline-block">
                Fecha límite de recepción: <span className="text-sky-300 font-bold">por anunciar por el comité editorial</span>
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/normas" className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-sky-900/30 flex items-center gap-2">
                  Ver normas para autores
                </Link>
                <Link href="/chronicles/create" className="bg-[#0e243d] hover:bg-[#153358] text-slate-200 font-medium text-xs px-6 py-3.5 rounded-xl border border-white/10 transition-all duration-300">
                  Enviar trabajo
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#071321]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-6 relative z-10 shadow-xl">
              <h3 className="text-white font-serif font-bold text-base flex items-center gap-2.5 border-b border-white/[0.08] pb-3.5">
                <FaLayerGroup className="text-sky-400" /> Áreas temáticas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Maestría (Artículos)</h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 font-light">
                    <li>Mecánica</li>
                    <li>Automatización y Control</li>
                    <li>Informática — Software</li>
                    <li>Electricidad</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Pregrado (Proyectos)</h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 font-light">
                    <li>Instrumentación</li>
                    <li>Telecomunicaciones</li>
                    <li>Mantenimiento</li>
                    <li>Agroalimentación</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. EXPLORADOR E INTEGRACIÓN DE ARTÍCULOS ACTIVOS */}
        <div id="articulos" className="max-w-7xl mx-auto px-6 py-16">
          
          <div className="bg-gradient-to-r from-[#0b1d33] via-[#071424] to-[#050e19] border border-white/[0.08] p-8 md:p-12 rounded-3xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/[0.05] rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-mono tracking-widest uppercase text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 mb-3 inline-block">Repositorio Oficial</span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-2">Últimos artículos publicados</h2>
              <p className="text-slate-300 text-sm max-w-xl font-light">Repositorio de proyectos de grado y artículos científicos activos de la comunidad académica politécnica.</p>
            </div>
            <div className="bg-[#071321] p-6 rounded-2xl border border-white/10 text-center min-w-[150px] shadow-inner relative z-10">
              <p className="text-4xl font-black bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">{chronicles.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono font-bold mt-1.5">Publicaciones</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            <aside className="lg:w-80 space-y-8">
              <div className="bg-[#0b1d33]/80 backdrop-blur-md p-6 md:p-7 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
                <h3 className="text-white font-bold mb-1 flex items-center gap-2.5 text-sm tracking-wide">
                  <FaInfoCircle className="text-sky-400 text-base"/> Información Editorial
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Consulte nuestra convocatoria abierta para el Vol. 1, N.° 2. Todos los artículos indexados cuentan con revisión ciega por pares evaluadores calificados.
                </p>
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-[11px] font-mono text-sky-400 block">Arbitraje Académico UPTA</span>
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Buscar título o autor..." 
                    className="w-full p-4 pl-12 bg-[#0b1d33]/90 border border-white/[0.08] rounded-2xl text-white outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 transition-all text-sm placeholder:text-slate-500 shadow-md backdrop-blur-md" 
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
                  />
                </div>
                <select 
                  className="p-4 bg-[#0b1d33]/90 border border-white/[0.08] rounded-2xl text-slate-300 outline-none focus:border-sky-500/60 text-sm cursor-pointer shadow-md backdrop-blur-md"
                  onChange={(e) => setFilterBy(e.target.value as 'title' | 'author' | 'all')}
                >
                  <option value="all" className="bg-[#071321]">Todo el repositorio</option>
                  <option value="title" className="bg-[#071321]">Por Título</option>
                  <option value="author" className="bg-[#071321]">Por Autor</option>
                </select>
              </div>
              
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {paginatedData.map((c, index) => (
                  <ChronicleCard key={c?.id || c?._id || index} chronicle={c} />
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2.5 pt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)} 
                      className={`px-4.5 py-2.5 text-xs rounded-xl font-bold transition-all duration-300 shadow-md ${currentPage === i + 1 ? 'bg-sky-600 text-white shadow-sky-900/40 ring-2 ring-sky-400/30' : 'bg-[#0b1d33] text-slate-400 hover:text-white border border-white/[0.08] hover:bg-[#0f2744]'}`}
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
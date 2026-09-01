'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { FaBookOpen, FaBullseye, FaEye, FaGlobeAmericas, FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-16 px-6 bg-[#071321]">
        <motion.article 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto space-y-16 text-slate-300"
        >
          
          {/* Cabecera */}
          <motion.div variants={itemVariants} className="border-b border-white/10 pb-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <span className="inline-block px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-sky-500/20">
              Directorio Institucional
            </span>
            <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-4 tracking-tight">
              Sobre la Revista
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Conociendo a Saberes Politécnicos y nuestro compromiso indeclinable con el rigor académico y la divulgación científica.
            </p>
          </motion.div>

          {/* Presentación & Info Box */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaBookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Presentación</h2>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              <strong>Saberes Politécnicos</strong> es una revista científica digital de acceso abierto, orientada a la divulgación de artículos de investigación y proyectos de grado del ámbito politécnico. Está asociada a la <strong>Universidad Politécnica Territorial del Estado Aragua (UPTA)</strong> y busca promover la producción intelectual de estudiantes de maestría y pregrado en las áreas de ingeniería, tecnología, administración y ciencias aplicadas.
            </p>

            {/* Grid de Especificaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0e243d]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
              {[
                { label: "Periodicidad", val: "Semestral" },
                { label: "Idioma", val: "Español" },
                { label: "Depósito Legal", val: "AR2026000105" },
                { label: "ISSN", val: "En trámite" },
                { label: "Formato", val: "Digital (Acceso abierto)" },
                { label: "Institución", val: "UPTA — Aragua, Venezuela" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-slate-400 text-xs uppercase tracking-wider">{item.label}</span>
                  <span className="text-sky-300 font-mono font-medium text-xs bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/10">{item.val}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Misión y Visión con Tarjetas Animadas */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.3)" }}
              className="bg-[#0e243d]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black mb-6 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <FaBullseye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-wide">Misión</h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Fomentar la producción y difusión del conocimiento científico y tecnológico generado en el entorno académico politécnico, con énfasis en la pertinencia social, la innovación y la vinculación con las comunidades.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.3)" }}
              className="bg-[#0e243d]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black mb-6 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <FaEye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3 tracking-wide">Visión</h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Ser un referente editorial digital en el ámbito de las universidades politécnicas territoriales de Venezuela, reconocido por la calidad, rigurosidad y accesibilidad de sus publicaciones.
              </p>
            </motion.div>
          </motion.div>

          {/* Alcance Académico */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaGlobeAmericas className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Alcance Académico</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#0e243d]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-sky-400 font-bold text-sm tracking-wider uppercase">Artículos Científicos (Maestría — PNFA)</h3>
                <ul className="text-slate-400 text-xs space-y-2.5 list-disc pl-4 marker:text-sky-400">
                  <li className="leading-relaxed">Mecánica</li>
                  <li className="leading-relaxed">Automatización, Control y Robótica</li>
                  <li className="leading-relaxed">Informática mención Desarrollo de Software</li>
                  <li className="leading-relaxed">Electricidad</li>
                </ul>
              </div>

              <div className="bg-[#0e243d]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-sky-400 font-bold text-sm tracking-wider uppercase">Repositorio de Proyectos (Pregrado — PNF)</h3>
                <ul className="text-slate-400 text-xs space-y-2.5 list-disc pl-4 marker:text-sky-400">
                  <li className="leading-relaxed">Instrumentación y Control, Electricidad, Electrónica</li>
                  <li className="leading-relaxed">Telecomunicaciones, Mecánica, Mantenimiento</li>
                  <li className="leading-relaxed">Administración, Contaduría Pública, Agroalimentación</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Política Editorial & Ética */}
          <motion.section variants={itemVariants} className="bg-[#0e243d]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-sky-500/5 pointer-events-none">
              <FaShieldAlt className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaShieldAlt className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Política Editorial y Ética</h2>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-2xl">
              Saberes Politécnicos se adhiere firmemente a los principios de integridad académica: originalidad, autoría responsable, transparencia en los métodos y tratamiento ético de datos. El plagio, la fabricación de datos y la publicación duplicada son causales estrictas de rechazo.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Software Libre Recomendado</h3>
                <p className="text-slate-400 text-xs">
                  Estándar mundial para la gestión transparente de arbitraje y edición.
                </p>
              </div>
              <a 
                href="https://pkp.sfu.ca/software/ojs/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group shrink-0"
              >
                Open Journal Systems (OJS) <FaExternalLinkAlt className="w-3 h-3 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </motion.section>

        </motion.article>
      </div>
    </ProtectedRoute>
  );
}
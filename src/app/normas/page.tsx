'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { FaFileAlt, FaCheckCircle, FaSlidersH, FaRoute, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function NormasPage() {
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
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
              Guía Oficial de Publicación
            </span>
            <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-4 tracking-tight">
              Normas para Autores
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Estándares de calidad y lineamientos interactivos para la preparación, estructuración y envío exitoso de artículos científicos.
            </p>
          </motion.div>

          {/* IMRyD con Animación por Tarjetas */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaFileAlt className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Estructura del Artículo (IMRyD)</h2>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Cada sección cumple un rol fundamental en el rigor metodológico. Pasa el cursor o explora cada componente:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Título", desc: "Claro, conciso y descriptivo. Máximo 20 palabras. En español e inglés." },
                { title: "Autor(es)", desc: "Nombre completo, afiliación institucional clara y correo electrónico activo." },
                { title: "Resumen", desc: "150 - 250 palabras abarcando objetivo, metodología, resultados y conclusión." },
                { title: "Palabras clave", desc: "3 a 5 términos precisos, en español e inglés, en orden alfabético." },
                { title: "Introducción", desc: "Planteamiento del problema, contexto, antecedentes y objetivo principal." },
                { title: "Marco teórico", desc: "Fundamentos conceptuales sólidos y revisión exhaustiva de literatura." },
                { title: "Metodología", desc: "Diseño experimental o no experimental, población, instrumentos y procedimientos." },
                { title: "Resultados", desc: "Presentación objetiva de hallazgos respaldados con tablas y figuras limpias." },
                { title: "Discusión", desc: "Interpretación profunda de los resultados, contraste y limitaciones." },
                { title: "Conclusiones", desc: "Síntesis directa de los aportes y proyección de futuras líneas de investigación." },
                { title: "Referencias", desc: "Normas APA 7.ª edición estrictas. Mínimo 15 fuentes actualizadas." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#0e243d]/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-black text-sky-400/60 bg-sky-500/10 px-2 py-0.5 rounded">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tabla de Especificaciones interactiva */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaSlidersH className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Formato de Presentación</h2>
            </div>

            <div className="bg-[#0e243d]/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#142840]/80 text-sky-400 uppercase text-[10px] tracking-widest border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold">Elemento Estructural</th>
                    <th className="px-6 py-4 font-bold">Especificación Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Extensión", "4 000 – 8 000 palabras"],
                    ["Formatos Permitidos", ".md, .docx o .odt"],
                    ["Interlineado", "1.5 líneas con espacio posterior"],
                    ["Tipografía", "Times New Roman 12 pt"],
                    ["Márgenes", "2.5 cm en todos los bordes"],
                    ["Normativa de Citas", "APA 7.ª edición rigurosa"]
                  ].map(([el, spec], i) => (
                    <motion.tr 
                      key={i}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {el}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{spec}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Flujo Editorial con Timeline visual */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <FaRoute className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Flujo Editorial Dinámico</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Recepción", desc: "Envío digital del manuscrito a través de la plataforma." },
                { title: "Revisión preliminar", desc: "Filtro anti-plagio y cumplimiento de directrices formales." },
                { title: "Arbitraje", desc: "Evaluación ciega por pares expertos en la temática." },
                { title: "Correcciones", desc: "Ajustes sugeridos por el comité de arbitraje." },
                { title: "Aceptación", desc: "VºBº definitivo y validación de metadatos." },
                { title: "Publicación", desc: "Maquetación final e integración al repositorio." }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.3)" }}
                  className="bg-[#0e243d]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative group transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black text-sm border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      0{i + 1}
                    </div>
                    <FaCheckCircle className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to Action Inferior */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-sky-900/40 via-[#0e243d] to-sky-950/40 border border-sky-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">¿Listo para postular tu trabajo?</h3>
              <p className="text-slate-400 text-xs max-w-md">
                Asegúrate de cumplir con todas las normativas antes de enviar tu propuesta al comité editorial.
              </p>
            </div>
            <Link 
              href="/chronicles/create"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-sky-500/25 flex items-center gap-2 group shrink-0"
            >
              Iniciar Envío <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </motion.article>
      </div>
    </ProtectedRoute>
  );
}
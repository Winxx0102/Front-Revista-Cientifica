"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { FaFileDownload } from "react-icons/fa";

export default function NormasPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
        <article className="max-w-4xl mx-auto space-y-12 text-slate-300">
          
          {/* Cabecera */}
          <div className="border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Normas para autores</h1>
            <p className="text-slate-400 text-lg">
              Guía completa para la preparación y envío de artículos científicos y resúmenes de proyectos de grado.
            </p>
          </div>

          {/* IMRyD */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Estructura del artículo científico</h2>
            <p className="leading-relaxed">Los artículos deben seguir la estructura <strong>IMRyD</strong> (Introducción, Metodología, Resultados y Discusión):</p>
            <ol className="list-decimal pl-5 space-y-3 marker:text-sky-500 marker:font-bold">
              {[
                { title: "Título", desc: "Claro, conciso y descriptivo. Máximo 20 palabras. En español e inglés." },
                { title: "Autor(es)", desc: "Nombre completo, afiliación institucional y correo electrónico." },
                { title: "Resumen", desc: "150 - 250 palabras (objetivo, metodología, resultados, conclusión)." },
                { title: "Palabras clave", desc: "3 a 5, en español e inglés, ordenadas alfabéticamente." },
                { title: "Introducción", desc: "Contexto, antecedentes, justificación y objetivo." },
                { title: "Marco teórico", desc: "Fundamentos conceptuales y revisión de literatura." },
                { title: "Metodología", desc: "Diseño, población, muestra, instrumentos y procedimientos." },
                { title: "Resultados", desc: "Presentación objetiva con tablas y figuras." },
                { title: "Discusión", desc: "Interpretación, comparación y limitaciones." },
                { title: "Conclusiones", desc: "Síntesis y líneas futuras." },
                { title: "Referencias", desc: "Formato APA 7.ª edición. Mínimo 15 fuentes." }
              ].map((item, i) => (
                <li key={i}><strong className="text-white">{item.title}:</strong> {item.desc}</li>
              ))}
            </ol>
          </section>

          {/* Tabla de Especificaciones */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Formato de presentación</h2>
            <div className="bg-[#0e243d] rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#142840] text-sky-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Elemento</th>
                    <th className="px-6 py-4">Especificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Extensión", "4 000 – 8 000 palabras"],
                    ["Formato", ".md, .docx o .odt"],
                    ["Interlineado", "1.5"],
                    ["Tipografía", "Times New Roman 12 pt"],
                    ["Márgenes", "2.5 cm en todos los lados"],
                    ["Citas", "APA 7.ª edición"]
                  ].map(([el, spec], i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{el}</td>
                      <td className="px-6 py-4">{spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Flujo Editorial */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Flujo editorial</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Recepción", "Revisión preliminar", "Arbitraje", 
                "Correcciones", "Aceptación", "Publicación"
              ].map((step, i) => (
                <div key={i} className="bg-[#142840] p-6 rounded-xl border border-white/5 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">{i + 1}</div>
                  <span className="font-semibold text-white">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Plantillas */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Plantillas descargables</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Plantilla artículo científico", file: "plantilla-articulo.md" },
                { name: "Plantilla proyecto de grado", file: "plantilla-proyecto.md" }
              ].map((t, i) => (
                <a key={i} href="#" className="flex items-center gap-4 p-6 bg-[#0e243d] rounded-2xl border border-white/10 hover:border-sky-500 transition-all">
                  <FaFileDownload className="text-2xl text-sky-400" />
                  <div>
                    <strong className="block text-white">{t.name}</strong>
                    <span className="text-xs text-slate-500">{t.file}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </article>
      </div>
    </ProtectedRoute>
  );
}
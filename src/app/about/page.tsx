"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0b1b2e] py-16 px-6">
        <article className="max-w-4xl mx-auto space-y-12">
          
          {/* Cabecera */}
          <div className="border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Sobre la revista</h1>
            <p className="text-slate-400 text-lg">
              Conociendo a Saberes Politécnicos y nuestro compromiso con el rigor académico.
            </p>
          </div>

          {/* Presentación */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Presentación</h2>
            <p className="text-slate-300 leading-relaxed">
              <strong>Saberes Politécnicos</strong> es una revista científica digital de acceso abierto, orientada a la divulgación de artículos de investigación y proyectos de grado del ámbito politécnico. Está asociada a la <strong>Universidad Politécnica Territorial del Estado Aragua (UPTA)</strong> y busca promover la producción intelectual de estudiantes de maestría y pregrado en las áreas de ingeniería, tecnología, administración y ciencias aplicadas.
            </p>

            {/* Info Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0e243d] p-6 rounded-2xl border border-white/5">
              {[
                { label: "Periodicidad", val: "Semestral" },
                { label: "Idioma", val: "Español" },
                { label: "Depósito Legal", val: "AR2026000105" },
                { label: "ISSN", val: "En trámite" },
                { label: "Formato", val: "Digital (Acceso abierto)" },
                { label: "Institución", val: "UPTA — Aragua, Venezuela" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-white/5 pb-2 last:border-0">
                  <span className="text-slate-500 text-sm uppercase tracking-wider">{item.label}</span>
                  <span className="text-sky-300 font-medium">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#142840] p-8 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">Misión</h2>
              <p className="text-slate-300 text-sm leading-relaxed">Fomentar la producción y difusión del conocimiento científico y tecnológico generado en el entorno académico politécnico, con énfasis en la pertinencia social, la innovación y la vinculación con las comunidades.</p>
            </div>
            <div className="bg-[#142840] p-8 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">Visión</h2>
              <p className="text-slate-300 text-sm leading-relaxed">Ser un referente editorial digital en el ámbito de las universidades politécnicas territoriales de Venezuela, reconocido por la calidad, rigurosidad y accesibilidad de sus publicaciones.</p>
            </div>
          </div>

          {/* Alcance */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Alcance académico</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sky-400 font-bold mb-3">Artículos científicos (Maestría — PNFA)</h3>
                <ul className="text-slate-400 text-sm space-y-2 list-disc pl-5">
                  <li>Mecánica</li>
                  <li>Automatización, Control y Robótica</li>
                  <li>Informática mención Desarrollo de Software</li>
                  <li>Electricidad</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sky-400 font-bold mb-3">Repositorio de proyectos (Pregrado — PNF)</h3>
                <ul className="text-slate-400 text-sm space-y-2 list-disc pl-5">
                  <li>Instrumentación y Control, Electricidad, Electrónica</li>
                  <li>Telecomunicaciones, Mecánica, Mantenimiento</li>
                  <li>Administración, Contaduría Pública, Agroalimentación</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Políticas */}
          <div className="bg-[#0e243d] p-8 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-2xl font-bold text-white">Política editorial y Ética</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Saberes Politécnicos se adhiere a los principios de integridad académica: originalidad, autoría responsable, transparencia en los métodos y tratamiento ético de datos. El plagio, la fabricación de datos y la publicación duplicada son causales estrictas de rechazo.
            </p>
            <div className="pt-4 border-t border-white/10">
              <h3 className="font-bold text-white mb-2">Software libre recomendado</h3>
              <p className="text-slate-400 text-sm">
                Para la gestión editorial a largo plazo, recomendamos <strong><a href="https://pkp.sfu.ca/software/ojs/" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">Open Journal Systems (OJS)</a></strong>, el estándar mundial para la gestión transparente de arbitraje, edición y publicación académica.
              </p>
            </div>
          </div>

        </article>
      </div>
    </ProtectedRoute>
  );
}
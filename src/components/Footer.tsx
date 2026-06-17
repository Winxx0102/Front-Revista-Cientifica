'use client';

import { FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  // Rutas de navegación rápida
  const navLinks = [
    { name: 'Inicio', url: '/dashboard' },
    { name: 'Artículos', url: 'https://upta.edu.ve' },
  ];

  return (
    <footer className="bg-[#0b1b2e] border-t border-white/5 mt-auto text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Info Revista */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg tracking-tight">Saberes Politécnicos</h3>
            <p className="text-xs max-w-xs leading-relaxed">
              Revista científica digital de acceso abierto. Comprometidos con la difusión del conocimiento técnico de la UPTA.
            </p>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Navegación</span>
            {navLinks.map((link) => (
              <a key={link.name} href={link.url} className="text-sm hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Inferior: Gestión Técnica Minimalista */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600">
          <p className="font-mono">© {new Date().getFullYear()} UPTA — DERECHOS RESERVADOS</p>
          
          <div className="flex items-center gap-4">
            <span>GESTIÓN TÉCNICA: JORGE TOVAR</span>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Winxx0102" target="_blank" className="hover:text-white transition-colors">
                <FaGithub size={12} />
              </a>
              <a href="mailto:olowixtovar@gmail.com" className="hover:text-white transition-colors">
                <FaEnvelope size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
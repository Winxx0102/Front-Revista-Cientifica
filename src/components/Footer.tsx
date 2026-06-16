'use client';

import { FaGithub, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/584163670993', label: '+58 416 3670993' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Winxx0102', label: '@Winxx0102' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:olowixtovar@gmail.com', label: 'olowixtovar@gmail.com' },
  ];

  return (
    // Fondo azul profundo institucional
    <footer className="bg-[#0b1b2e] border-t border-white/10 mt-auto text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Info Revista */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg tracking-tight">Saberes Politécnicos</h3>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Revista científica digital de acceso abierto. 
              Comprometidos con la difusión del conocimiento técnico de la 
              <span className="font-semibold text-white"> UPTA</span>.
            </p>
          </div>

          {/* Contacto simple y elegante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                className="flex items-center gap-3 p-2 hover:text-white transition-colors"
              >
                <item.icon size={18} />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">{item.name}</span>
                  <span className="text-xs font-mono">{item.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Inferior */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
          <p className="text-[11px] font-mono">
            © {new Date().getFullYear()} UPTA — DERECHOS RESERVADOS
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>GESTIÓN TÉCNICA</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="font-mono tracking-tight text-slate-400">JORGE TOVAR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
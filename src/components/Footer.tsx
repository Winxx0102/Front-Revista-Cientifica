'use client';

import { FaGithub, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/584163670993', label: '+58 416 3670993' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Winxx0102', label: '@Winxx0102' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:olowixtovar@gmail.com', label: 'olowixtovar@gmail.com' },
  ];

  return (
    <footer className="site-footer border-t border-color-divider mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Info Revista */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-lg tracking-tight">Saberes Politécnicos</h3>
            <p className="text-sm text-color-text-muted max-w-sm leading-relaxed">
              Revista científica digital de acceso abierto. 
              Comprometidos con la difusión del conocimiento técnico de la 
              <span className="font-semibold text-color-primary"> UPTA</span>.
            </p>
          </div>

          {/* Contacto con estilo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-color-divider/20 transition-all duration-300"
              >
                <div className="text-color-text-faint group-hover:text-color-primary transition-colors">
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-color-text-faint">{item.name}</span>
                  <span className="text-xs font-mono text-color-text-muted">{item.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Inferior */}
        <div className="mt-16 pt-8 border-t border-color-divider flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-color-text-faint font-mono">
            © {new Date().getFullYear()} UPTA — DERECHOS RESERVADOS
          </p>
          <div className="flex items-center gap-2 text-[11px] text-color-text-muted">
            <span>GESTIÓN TÉCNICA</span>
            <span className="w-1 h-1 rounded-full bg-color-primary"></span>
            <span className="font-mono font-bold tracking-tight">JORGE TOVAR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
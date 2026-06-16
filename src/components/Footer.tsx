'use client';

import { FaGithub, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const contactLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/584163670993', label: '+58 416 3670993' },
    { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Winxx0102', label: '@Winxx0102' },
    { name: 'Email', icon: FaEnvelope, url: 'mailto:olowixtovar@gmail.com', label: 'olowixtovar@gmail.com' },
  ];

  return (
    <footer className="site-footer">
      <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Info Revista */}
          <div className="md:col-span-1">
            <h3 className="font-display italic text-lg mb-4">Saberes Politécnicos</h3>
            <p className="text-sm text-color-text-muted mb-6">
              Revista científica de acceso abierto. 
              Universidad Politécnica Territorial del Estado Aragua (UPTA).
            </p>
            <p className="text-xs text-color-text-faint">
              Desarrollado para la comunidad universitaria.
            </p>
          </div>

          {/* Enlaces de contacto (Discretos) */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-8 md:justify-end">
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                className="flex items-center gap-3 text-color-text-muted hover:text-color-primary transition-colors"
              >
                <item.icon size={16} />
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Inferior */}
        <div className="mt-12 pt-8 border-t border-color-divider flex flex-col md:flex-row justify-between items-center gap-4 text-color-text-faint text-xs">
          <p>© {new Date().getFullYear()} UPTA — Saberes Politécnicos</p>
          <p>Gestión técnica por Jorge Tovar</p>
        </div>
      </div>
    </footer>
  );
}
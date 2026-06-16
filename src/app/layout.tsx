import type { Metadata } from "next";
// Cambiamos las fuentes por las que definiste en tu HTML original
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Metadata actualizada a la nueva identidad
export const metadata: Metadata = {
  title: "Saberes Politécnicos | Revista Científica Digital",
  description: "Revista científica digital de acceso abierto de la UPTA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Quitamos la clase 'text-white' forzada y dejamos que CSS maneje el tema
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Cargamos las fuentes de Google Fonts aquí o vía CSS imports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      
      <body className="min-h-screen flex flex-col antialiased">
        
        {/* Eliminamos los divs de "glamour tecnológico" y permitimos que 
            tu CSS (var(--color-bg)) gestione el color de fondo real */}
        
        <AuthProvider>
          <Navbar /> 
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          
          {/* Ajustamos el Toaster para que se adapte al tema */}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Cargamos tus fuentes "cool" de siempre
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} 
      suppressHydrationWarning
    >
      <head>
        {/* Mantenemos tus fuentes editoriales de la revista para los títulos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      
      {/* Aplicamos la tipografía Geist por defecto para una lectura moderna */}
      <body className="min-h-screen flex flex-col font-sans">
        
        <AuthProvider>
          <Navbar /> 
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
          
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
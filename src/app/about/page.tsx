"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AboutPage() {
  return (
     <ProtectedRoute>   <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Acerca de</h1>
      <p className="text-slate-300">
        Aquí va la info... mision, visión, objetivos, etc. de la revista científica.
      </p>
    </div></ProtectedRoute>
    
  );
}
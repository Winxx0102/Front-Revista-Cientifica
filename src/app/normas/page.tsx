"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function NormasPage() {
  return (
     <ProtectedRoute>   <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Normas</h1>
      <p className="text-slate-300">
        Aquí están las normas de la revista científica.
      </p>
    </div></ProtectedRoute>
    
  );
}
'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import UserActionMenu from '@/components/admin/UserActionMenu';
import AdminGuard from '@/components/AdminGuard';
import { Bell, CheckCircle2, Eye, X } from 'lucide-react';

type AdminUser = {
  id: number;
  email: string;
  role: string;
  isBlocked: boolean;
  _count?: { chronicles: number };
};

type PendingArticle = {
  id: number;
  title: string;
  author: string;
  materia?: string;
  file_path?: string;
  createdAt: string;
};

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingArticles, setPendingArticles] = useState<PendingArticle[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsData, pendingResponse] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats'),
        fetchApi('/revista/pending')
      ]);

      const usersArray = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || []);
      const pendingArray = Array.isArray(pendingResponse) ? pendingResponse : (pendingResponse?.data || []);
        
      setUsers(usersArray);
      setPendingArticles(pendingArray);
      setStats(statsData || { totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
      
    } catch (err) {
      console.error("Error cargando datos:", err);
      toast.error("Error al cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        toast.error("Acceso denegado");
        router.push('/');
      } else {
        const t = setTimeout(() => { loadData(); }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [isLoading, user, router]);

  const handleAction = async (id: number, action: 'block' | 'unblock' | 'role', newRole?: string) => {
    try {
      if (action === 'role') {
        await fetchApi(`/users/role/${id}`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
      } else {
        await fetchApi(`/users/${action}/${id}`, { method: 'PATCH' });
      }
      toast.success("Operación exitosa");
      await loadData();
    } catch (err) {
      console.error("Error en acción:", err);
      toast.error("Error al procesar la solicitud");
    }
  };

  // Función para aprobar artículo
  const handleApproveArticle = async (id: number) => {
    try {
      await fetchApi(`/revista/${id}/approve`, { method: 'PATCH' });
      toast.success("Artículo autorizado y publicado con éxito.");
      await loadData(); // Recarga la lista de pendientes y métricas
    } catch (err) {
      console.error("Error al aprobar:", err);
      toast.error("No se pudo autorizar el artículo.");
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase())), 
    [users, search]
  );

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) return null;

  return ( 
    <AdminGuard>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8 pb-32 pt-8 px-6 relative">
        
        {/* Encabezado del Panel con Campana de Notificaciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-white">Panel de Control</h1>
            <p className="text-gray-400 text-sm">Gestión centralizada de usuarios, auditoría de artículos y métricas.</p>
          </div>

          {/* Botón de Campana de Auditoría */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-3 bg-gray-900/80 border border-white/10 rounded-2xl hover:border-sky-500/50 transition-all text-white flex items-center gap-2 group"
            >
              <Bell className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Auditoría</span>
              {pendingArticles.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {pendingArticles.length}
                </span>
              )}
            </button>

            {/* Menú Desplegable de Artículos Pendientes */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0e243d] border border-white/10 rounded-3xl shadow-2xl p-6 z-50 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Pendientes de Revisión</h3>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                    {pendingArticles.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No hay artículos pendientes por autorizar.</p>
                    ) : (
                      pendingArticles.map((art) => (
                        <div key={art.id} className="bg-[#0b1b2e] border border-white/5 p-4 rounded-2xl space-y-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{art.title}</h4>
                          <p className="text-[10px] text-slate-400">Autor: <span className="text-slate-200">{art.author}</span></p>
                          <div className="flex items-center justify-between pt-2">
                            <a 
                              href={`/chronicles/${art.id}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Leer
                            </a>
                            <button 
                              onClick={() => handleApproveArticle(art.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Autorizar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Usuarios Totales', val: stats.totalUsers, color: 'indigo' },
            { title: 'Usuarios Bloqueados', val: stats.blockedUsers, color: 'red' },
            { title: 'Total Crónicas Publicadas', val: stats.totalchronicles, color: 'emerald' }
          ].map((item, i) => (
            <div key={i} className="group bg-gray-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className={`text-${item.color}-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2`}>{item.title}</h3>
              <p className="text-4xl font-black text-white">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Directorio de Usuarios */}
        <div className="bg-gray-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Directorio de Usuarios</h2>
            <input 
              placeholder="Buscar por email..."
              className="w-full md:w-64 bg-gray-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Rol</th>
                  <th className="p-4 text-center font-bold">Crónicas</th>
                  <th className="p-4 text-center font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 text-sm text-gray-300 font-medium">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${
                        u.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-400 font-mono text-sm">{u._count?.chronicles || 0}</td>
                    <td className="p-4 flex justify-center">
                      <UserActionMenu 
                        userRole={user.role ?? ''}
                        currentUserId={Number(user.id)}
                        targetUser={{ id: u.id, role: u.role, isBlocked: u.isBlocked }}
                        onAction={handleAction}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminGuard>
  );
}
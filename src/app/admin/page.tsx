'use client';
import { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import UserActionMenu from '@/components/admin/UserActionMenu';
import AdminGuard from '@/components/AdminGuard';
type AdminUser = {
  id: number;
  email: string;
  role: string;
  isBlocked: boolean;
  _count?: { chronicles: number };
};

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    // carga de datos del panel de administración
    try {
      setLoading(true);
      const [usersResponse, statsData] = await Promise.all([
        fetchApi('/users'),
        fetchApi('/users/admin/stats')
      ]);

      // --- LOGS DE DEPURACIÓN ---
      console.log("Raw Users Response:", usersResponse);
      console.log("Raw Stats Response:", statsData);
      
      // Manejo flexible de la respuesta (por si viene como { data: [] } o como array directo)
      const usersArray = Array.isArray(usersResponse) 
        ? usersResponse 
        : (usersResponse?.data || []);
        
      setUsers(usersArray);
      setStats(statsData || { totalUsers: 0, blockedUsers: 0, totalchronicles: 0 });
      
    } catch (err) {
      console.error("Error cargando datos:", err);
      toast.error("Error al cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  // 1. Verificación de seguridad y carga de datos
  useEffect(() => {
    if (!isLoading) {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        toast.error("Acceso denegado");
        router.push('/');
      } else {
        // avoid synchronous setState inside effect — schedule load on next tick
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

  const filteredUsers = useMemo(() => 
    users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase())), 
    [users, search]
  );

  // 2. Pantalla de carga o denegación
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Cargando...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) return null;
// ... (mantiene la lógica igual, cambia el JSX del return)

  return ( 
  <AdminGuard>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8 pb-32 pt-8 px-6">
      {/* Encabezado del Panel */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white">Panel de Control</h1>
        <p className="text-gray-400 text-sm">Gestión centralizada de usuarios y métricas del sistema.</p>
      </div>

      {/* Tarjetas de Métricas con diseño de gradiente sutil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Usuarios Totales', val: stats.totalUsers, color: 'indigo' },
          { title: 'Usuarios Bloqueados', val: stats.blockedUsers, color: 'red' },
          { title: 'Total Crónicas', val: stats.totalchronicles, color: 'emerald' }
        ].map((item, i) => (
          <div key={i} className="group bg-gray-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <h3 className={`text-${item.color}-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2`}>{item.title}</h3>
            <p className="text-4xl font-black text-white">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Tabla con estilo limpio y profesional */}
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
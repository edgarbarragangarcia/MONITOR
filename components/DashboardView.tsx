import React from 'react';
import { Message } from '../types';
import { Users, MessageCircle, Clock, TrendingUp, AlertTriangle, PauseCircle } from 'lucide-react';

interface DashboardViewProps {
  messages: Message[];
  status: string;
  isMonitoring: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ messages, status, isMonitoring }) => {
  
  // Calculate Stats
  const totalMessages = messages.length;
  
  const uniqueUsers = new Set(messages.filter(m => m.role === 'user').map(m => m.sender)).size;
  
  const agentMessages = messages.filter(m => m.role === 'agent').length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  
  const responseRate = userMessages > 0 ? Math.round((agentMessages / userMessages) * 100) : 0;

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoy</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        {subtext && <p className="text-xs text-emerald-600 mt-2 flex items-center font-medium"><TrendingUp size={12} className="mr-1"/> {subtext}</p>}
    </div>
  );

  const getStatusConfig = () => {
      if (!isMonitoring) {
          return { text: 'DETENIDO', icon: PauseCircle, color: 'bg-gray-500 text-gray-600' };
      }
      return status === 'SUCCESS' 
        ? { text: 'En Línea', icon: Clock, color: 'bg-green-500 text-green-600' }
        : { text: 'Conectando', icon: Clock, color: 'bg-orange-500 text-orange-600' };
  }

  const statusConfig = getStatusConfig();

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
                <p className="text-slate-500">Resumen de actividad de Chat Monitor Regina</p>
            </div>
            {!isMonitoring && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <PauseCircle size={16} /> EL MONITOR ESTÁ APAGADO
                </div>
            )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Usuarios Activos" 
            value={uniqueUsers} 
            icon={Users} 
            color="bg-blue-500 text-blue-600"
            subtext="+2 nuevos"
        />
        <StatCard 
            title="Mensajes Totales" 
            value={totalMessages} 
            icon={MessageCircle} 
            color="bg-purple-500 text-purple-600"
            subtext="En tiempo real"
        />
        <StatCard 
            title="Tasa de Respuesta" 
            value={`${responseRate}%`} 
            icon={TrendingUp} 
            color="bg-emerald-500 text-emerald-600"
            subtext="Agente vs Usuario"
        />
        <StatCard 
            title="Estado del Sistema" 
            value={statusConfig.text} 
            icon={statusConfig.icon} 
            color={statusConfig.color}
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Actividad Reciente de Ingenes</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">Ver reporte completo</button>
        </div>
        <div className="p-0">
            {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Esperando datos...</div>
            ) : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Usuario</th>
                            <th className="px-6 py-3 font-semibold">Último Mensaje</th>
                            <th className="px-6 py-3 font-semibold">Hora</th>
                            <th className="px-6 py-3 font-semibold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {messages.slice(-5).reverse().map((msg, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{msg.sender}</td>
                                <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">{msg.text}</td>
                                <td className="px-6 py-4 text-slate-500">{msg.timestamp}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${msg.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {msg.role === 'agent' ? 'Respuesta' : 'Entrante'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};
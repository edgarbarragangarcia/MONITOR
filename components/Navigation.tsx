
import React from 'react';
import { LayoutDashboard, MessageSquare, Settings, Activity, Power, LogOut } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'chats' | 'settings';
  onTabChange: (tab: 'dashboard' | 'chats' | 'settings') => void;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  user: { name: string; email: string; avatar: string } | null;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isMonitoring, onToggleMonitoring, user, onLogout }) => {
  
  const NavItem = ({ id, icon: Icon, label }: { id: 'dashboard' | 'chats' | 'settings', icon: any, label: string }) => (
    <button
      onClick={() => onTabChange(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-emerald-800/50 text-emerald-100 border-r-4 border-emerald-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-emerald-400' : 'group-hover:text-white'} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="w-[240px] h-full bg-slate-900 flex flex-col flex-shrink-0 shadow-2xl z-30">
      {/* App Title / Logo Area */}
      <div className="h-[80px] flex items-center px-5 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-lg transition-all duration-500 ${isMonitoring ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-900/20' : 'bg-slate-700'}`}>
                <Activity className="text-white" size={20} />
            </div>
            <div>
                <h1 className="text-slate-100 font-bold text-sm leading-tight tracking-wide">CHAT MONITOR</h1>
                <span className={`text-xs font-bold tracking-[0.2em] transition-colors duration-500 ${isMonitoring ? 'text-emerald-500' : 'text-slate-500'}`}>REGINA</span>
            </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4 space-y-1">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Principal</div>
        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem id="chats" icon={MessageSquare} label="Chats en Vivo" />
        
        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistema</div>
        <NavItem id="settings" icon={Settings} label="Ajustes" />
      </div>

      {/* Power Button / Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
         <div className="mb-4">
            <button 
                onClick={onToggleMonitoring}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    isMonitoring 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20'
                }`}
            >
                <Power size={14} />
                {isMonitoring ? 'ENCENDIDO' : 'APAGADO'}
            </button>
         </div>

         {user && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-emerald-500/30" />
                <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-medium truncate">{user.name}</p>
                    <p className="text-slate-500 text-[10px] truncate cursor-pointer hover:text-red-400 flex items-center gap-1" onClick={onLogout}>
                        <LogOut size={10} /> Cerrar Sesión
                    </p>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

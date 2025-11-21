
import React, { useMemo } from 'react';
import { Message } from '../types';
import { User, Search, AlertCircle, Clock, Zap, AlertTriangle, Activity, Power } from 'lucide-react';

interface SidebarProps {
  messages: Message[];
  selectedUser: string | null;
  onSelectUser: (user: string | null) => void;
  isOpen: boolean;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
}

interface UserSummary {
  name: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  status: 'normal' | 'emergency' | 'anger' | 'inactive';
  avatarColor: string;
  intentEmoji: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ messages, selectedUser, onSelectUser, isOpen, isMonitoring, onToggleMonitoring }) => {
  
  // Helper function to determine status based on text and time
  const analyzeStatus = (text: string, timeStr: string): 'normal' | 'emergency' | 'anger' | 'inactive' => {
    const lowerText = text.toLowerCase();
    
    const emergencyKeywords = ['emergencia', 'urgente', 'sangrado', 'dolor', 'hospital', 'grave', 'ayuda', 'morir', 'aborto', 'ambulancia', 'desmayo'];
    if (emergencyKeywords.some(k => lowerText.includes(k))) return 'emergency';

    const angerKeywords = ['molesto', 'enojado', 'pésimo', 'queja', 'cancelar', 'reembolso', 'estafa', 'demanda', 'profeco', 'inútil', 'no sirve', 'fraude', 'hart', 'maldit', 'robo', 'ratas'];
    if (angerKeywords.some(k => lowerText.includes(k))) return 'anger';

    return 'normal';
  };

  const determineIntentEmoji = (text: string, status: string) => {
      if (status === 'emergency') return '🚨';
      if (status === 'anger') return '😡';

      const lower = text.toLowerCase();
      const has = (words: string[]) => words.some(w => new RegExp(`\\b${w}\\b`, 'i').test(lower));
      const contains = (fragments: string[]) => fragments.some(f => lower.includes(f));

      if (has(['hola', 'buenos', 'buenas', 'hey', 'que tal', 'saludos', 'buen dia', 'buenas tardes', 'buenas noches'])) return '👋';
      if (contains(['precio', 'costo', 'cuanto', 'cuánto', 'pago', 'cotiz', 'dinero', 'tarjeta', 'promo', 'descuento', 'paquete', 'bec', 'interes', 'informes'])) return '💰';
      if (contains(['cita', 'agendar', 'fecha', 'hora', 'mañana', 'lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo', 'calendario', 'disponible', 'horario'])) return '📅';
      if (contains(['donde', 'dónde', 'ubicacion', 'ubicación', 'direccion', 'dirección', 'calle', 'sucursal', 'cdmx', 'guadalajara', 'monterrey', 'puebla', 'queretaro', 'ciudad'])) return '📍';
      if (contains(['bebe', 'bebé', 'embarazo', 'embarazada', 'hijo', 'hija', 'familia', 'mama', 'mamá', 'pbb', 'in vitro', 'fiv', 'tratamiento', 'biologia', 'reproduccion'])) return '🤰';
      if (has(['si', 'sí', 'ok', 'claro', 'perfecto', 'bueno', 'va', 'esta bien', 'está bien', 'seguro', 'simon'])) return '👍';
      if (has(['no', 'nunca', 'jamas', 'tampoco', 'nada'])) return '✋';
      if (contains(['gracias', 'agradezco', 'amable'])) return '🙏';
      if (lower.includes('?') || contains(['duda', 'pregunta', 'información', 'info', 'saber', 'conocer', 'explica'])) return 'ℹ️';

      return '💬';
  };

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'emergency': return 'bg-red-600 ring-2 ring-red-400 ring-offset-2 animate-pulse';
          case 'anger': return 'bg-orange-500';
          case 'inactive': return 'bg-slate-400';
          default: return 'bg-emerald-500';
      }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'emergency': return <AlertTriangle size={14} className="text-red-600" />;
        case 'anger': return <Zap size={14} className="text-orange-500" />;
        case 'inactive': return <Clock size={14} className="text-slate-400" />;
        default: return null;
    }
  };

  const userList = useMemo(() => {
    const usersMap = new Map<string, UserSummary>();

    messages.forEach(msg => {
      if (msg.role !== 'user') return;

      const currentStatus = analyzeStatus(msg.text, msg.timestamp);
      const currentEmoji = determineIntentEmoji(msg.text, currentStatus);

      const existing = usersMap.get(msg.sender);
      
      if (!existing) {
        usersMap.set(msg.sender, {
          name: msg.sender,
          lastMessage: msg.text,
          timestamp: msg.timestamp,
          messageCount: 1,
          status: currentStatus,
          avatarColor: getStatusColor(currentStatus),
          intentEmoji: currentEmoji
        });
      } else {
        usersMap.set(msg.sender, {
          ...existing,
          lastMessage: msg.text,
          timestamp: msg.timestamp,
          messageCount: existing.messageCount + 1,
          status: currentStatus,
          avatarColor: getStatusColor(currentStatus),
          intentEmoji: currentEmoji
        });
      }
    });

    return Array.from(usersMap.values()).sort((a, b) => {
        const priority = { emergency: 3, anger: 2, normal: 1, inactive: 0 };
        if (priority[a.status] !== priority[b.status]) {
            return priority[b.status] - priority[a.status];
        }
        return 0; 
    });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-[320px] bg-white h-full border-r border-gray-200 flex flex-col flex-shrink-0 z-20 absolute md:relative shadow-xl md:shadow-none">
      
      {/* BRAND HEADER */}
      <div className="bg-slate-900 p-4 h-[70px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
                <Activity className="text-emerald-400" size={20} />
            </div>
            <div>
                <h1 className="text-slate-100 font-bold text-sm leading-none">CHAT MONITOR</h1>
                <span className="text-emerald-500 text-[10px] font-bold tracking-widest">REGINA</span>
            </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-3 bg-white border-b border-gray-100 shrink-0">
        <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700"
            />
        </div>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {userList.length === 0 && (
             <div className="p-6 text-center text-gray-400 text-sm">
                No se han detectado usuarios aún.
             </div>
        )}

        {userList.map((user, idx) => (
            <div 
                key={idx}
                onClick={() => onSelectUser(user.name)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedUser === user.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-all ${user.avatarColor}`}>
                    {user.status === 'emergency' ? <AlertCircle size={20} /> : <span className="text-lg filter drop-shadow-sm">{user.intentEmoji}</span>}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                        <h3 className={`font-semibold text-sm truncate capitalize ${user.status === 'emergency' ? 'text-red-600' : 'text-gray-800'}`}>
                            {user.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-1">
                            {user.timestamp.split(' ').pop() || user.timestamp}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className={`text-xs truncate max-w-[140px] ${user.status === 'emergency' ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                            {user.lastMessage}
                        </p>
                        {user.status === 'emergency' && (
                             <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 rounded-sm">SOS</span>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* POWER CONTROL FOOTER */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 shrink-0">
         <button 
            onClick={onToggleMonitoring}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all shadow-sm ${
                isMonitoring 
                ? 'bg-white text-emerald-600 border border-emerald-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' 
                : 'bg-slate-800 text-white hover:bg-emerald-600'
            }`}
         >
            <Power size={14} />
            {isMonitoring ? 'MONITOREANDO' : 'SISTEMA APAGADO'}
         </button>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { fetchSheetData } from './services/sheetService';
import { analyzeConversation } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Sidebar } from './components/Sidebar';
import { Message, SheetStatus, AnalysisResult } from './types';
import { RefreshCw, AlertCircle, MessageSquare, Power } from 'lucide-react';

// 3 seconds interval
const POLLING_INTERVAL = 3000; 

export default function App() {
  // DATA STATE
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<SheetStatus>(SheetStatus.IDLE);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // System Control State
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);

  // Analysis State
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  // Fetch Data Function
  const loadData = async () => {
    try {
      if (isFirstLoad.current) {
         setStatus(SheetStatus.LOADING);
      }

      const data = await fetchSheetData();
      
      if (data.length > 0) {
        if (JSON.stringify(data) !== JSON.stringify(messages)) {
            setMessages(data);
            // Scroll to bottom if new messages arrive for current user?
            // We'll let the chat view handle scrolling based on its own logic
            previousCount.current = data.length;
        }
        setStatus(SheetStatus.SUCCESS);
      } else {
          if (isFirstLoad.current && messages.length === 0) {
             setStatus(SheetStatus.SUCCESS);
          }
      }
      isFirstLoad.current = false;

    } catch (err: any) {
      console.warn("Polling error:", err);
      if (messages.length === 0) {
          setStatus(SheetStatus.ERROR);
      }
      isFirstLoad.current = false;
    }
  };

  // Polling Effect
  useEffect(() => {
    if (!isMonitoring) {
        setStatus(SheetStatus.IDLE);
        return;
    }

    loadData();
    const intervalId = setInterval(loadData, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isMonitoring]); 

  // Auto-Select User Effect
  useEffect(() => {
    if (!selectedUser && messages.length > 0) {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMsg) {
            setSelectedUser(lastUserMsg.sender);
        }
    }
  }, [messages, selectedUser]);

  // Scroll effect when messages change for selected user
  useEffect(() => {
      if (selectedUser && bottomRef.current) {
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
  }, [messages, selectedUser]);

  // Analysis Handler
  const handleAnalyze = async () => {
    if (filteredMessages.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzeConversation(filteredMessages);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const filteredMessages = selectedUser 
    ? messages.filter(m => m.conversationId === selectedUser) 
    : [];

  // MAIN LAYOUT - Pure Monitoring View
  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden font-sans text-slate-900">
      
      {/* LEFT SIDEBAR: Users & Controls */}
      <Sidebar 
          messages={messages} 
          selectedUser={selectedUser} 
          onSelectUser={(user) => {
              setSelectedUser(user);
          }}
          isOpen={true}
          isMonitoring={isMonitoring}
          onToggleMonitoring={() => setIsMonitoring(!isMonitoring)}
      />

      {/* MIDDLE: Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#efeae2] relative border-r border-gray-300 h-full shadow-inner">
          {selectedUser ? (
              <div className="bg-[#f0f2f5] px-4 py-3 flex items-center justify-between text-gray-600 border-b border-gray-300 shadow-sm h-[60px] shrink-0 z-10">
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {selectedUser.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <h2 className="font-bold text-gray-800 leading-tight truncate max-w-[200px]">{selectedUser}</h2>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                              {isMonitoring ? 'Monitoreando en vivo' : 'Desconectado'}
                          </div>
                      </div>
                  </div>

                  {status === SheetStatus.ERROR && isMonitoring && (
                      <div className="flex items-center text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-full border border-red-100 font-bold animate-bounce">
                          <AlertCircle size={14} className="mr-1" />
                          Error de Conexión
                      </div>
                  )}
                  {!isMonitoring && (
                      <div className="flex items-center text-gray-500 text-xs bg-gray-200 px-3 py-1.5 rounded-full border border-gray-300 font-medium">
                          <Power size={12} className="mr-1" />
                          Pausado
                      </div>
                  )}
              </div>
          ) : (
                  <div className="bg-[#f0f2f5] h-[60px] border-b border-gray-300 flex items-center px-4">
                      <span className="text-gray-500 font-medium">Selecciona un usuario</span>
                  </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
              {(!selectedUser) ? (
                  <div className="flex h-full flex-col items-center justify-center text-center p-8">
                      <div className="bg-white p-5 rounded-full mb-4 shadow-md">
                          <MessageSquare size={48} className="text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Chat Monitor Regina</h3>
                      <p className="text-gray-500 text-sm max-w-xs">
                          {status === SheetStatus.LOADING && isMonitoring 
                              ? "Conectando con base de datos..." 
                              : "Selecciona una conversación de la izquierda para comenzar el análisis."}
                      </p>
                  </div>
              ) : (
                  <>
                      {filteredMessages.map((msg) => (
                          <ChatMessage key={msg.id} message={msg} />
                      ))}
                      <div ref={bottomRef} />
                  </>
              )}
          </div>

          {selectedUser && (
              <div className="bg-[#f0f2f5] px-4 py-2 text-[10px] text-gray-500 flex justify-between border-t border-gray-200 shrink-0">
                <span className="font-medium">{filteredMessages.length} mensajes procesados</span>
                <span className="flex items-center gap-1 font-mono">
                    {status === SheetStatus.LOADING && isMonitoring && <RefreshCw size={8} className="animate-spin" />}
                    {isMonitoring ? 'SYNC: ON' : 'SYNC: OFF'}
                </span>
              </div>
          )}
      </div>

      {/* RIGHT: Gemini Analysis Panel (Hidden on mobile, visible on large screens) */}
      <div className="hidden xl:flex w-[350px] bg-gray-50 flex-col border-l border-gray-200 h-full shadow-xl z-10">
          <div className="h-[60px] bg-white border-b border-gray-200 flex items-center px-5 shrink-0">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-purple-100 p-1 rounded text-purple-600">✨</span> 
                IA Insights
              </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
              {selectedUser ? (
                  <AnalysisPanel 
                      analysis={analysis} 
                      loading={isAnalyzing} 
                      onAnalyze={handleAnalyze} 
                  />
              ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center p-8">
                         <p>Selecciona un usuario para habilitar el análisis de IA.</p>
                      </div>
              )}
          </div>
      </div>

    </div>
  );
}

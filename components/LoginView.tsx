
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Copy, Info } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [originUrl, setOriginUrl] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Get the current domain to show the user what to authorize
    if (typeof window !== 'undefined') {
        setOriginUrl(window.location.origin);
    }

    const initializeGoogle = () => {
      /* global google */
      if (typeof window !== 'undefined' && (window as any).google) {
        try {
            (window as any).google.accounts.id.initialize({
                client_id: "1013946083817-hjurarp6eq6mq3m2kvdm4str23t52dlr.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: false
            });
            
            const buttonDiv = document.getElementById("googleButtonDiv");
            if (buttonDiv) {
                // FIXED: Removed invalid width: "100%". GSI only supports pixel strings or auto.
                (window as any).google.accounts.id.renderButton(
                    buttonDiv,
                    { theme: "outline", size: "large", text: "continue_with" } 
                );
                setScriptLoaded(true);
            }
        } catch (e) {
            console.error("Google Auth Init Error:", e);
        }
      }
    };

    // Try immediately
    if ((window as any).google) {
        initializeGoogle();
    } else {
        // Poll for script load
        const intervalId = setInterval(() => {
            if ((window as any).google) {
                initializeGoogle();
                clearInterval(intervalId);
            }
        }, 200);
        return () => clearInterval(intervalId);
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
      setIsLoading(true);
      console.log("Encoded JWT ID token: " + response.credential);
      
      // Decode JWT (Simple implementation for frontend)
      try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const payload = JSON.parse(jsonPayload);
          
          // Create User Object
          const user = {
              name: payload.name,
              email: payload.email,
              avatar: payload.picture
          };
          
          onLogin(user);
      } catch (e) {
          console.error("Error parsing token", e);
          setIsLoading(false);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(originUrl);
      alert("URL copiada al portapapeles: " + originUrl);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        
        {/* Header / Brand */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="flex justify-center mb-4">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <Activity className="text-emerald-400" size={32} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">CHAT MONITOR</h1>
            <p className="text-emerald-400 text-xs font-bold tracking-[0.3em]">REGINA</p>
        </div>

        {/* Login Body */}
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-gray-800 font-semibold text-lg">Bienvenido de nuevo</h2>
                <p className="text-gray-500 text-sm mt-1">Inicia sesión para acceder al panel de control</p>
            </div>

            {/* Google Button Container */}
            <div className="w-full h-[50px] mb-6 flex justify-center relative">
                 {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
                        Verificando...
                    </div>
                 ) : (
                    <div id="googleButtonDiv" className="flex justify-center">
                         {!scriptLoaded && !isLoading && (
                            <span className="text-xs text-gray-400 animate-pulse">Cargando servicios de Google...</span>
                         )}
                    </div>
                 )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
                    <ShieldCheck size={14} />
                    <span>Conexión Segura</span>
                </div>
                <p className="text-xs text-gray-400 max-w-xs mt-2">
                    Al continuar, accedes al sistema de monitoreo exclusivo para personal autorizado.
                </p>
            </div>
        </div>
        
        {/* Config Helper (Only visible in Dev/Preview) */}
        <div className="bg-yellow-50 p-4 border-t border-yellow-100 text-xs text-yellow-800">
            <div className="flex items-start gap-2">
                <Info size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                    <p className="font-bold mb-1">Configuración de Google Cloud:</p>
                    <p className="mb-2">Asegúrate de añadir esta URL en <span className="font-mono bg-yellow-100 px-1">Orígenes de JavaScript autorizados</span>:</p>
                    <div className="flex items-center gap-2 bg-white border border-yellow-200 p-2 rounded font-mono text-gray-600 break-all">
                        <span className="flex-1">{originUrl}</span>
                        <button onClick={copyToClipboard} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                            <Copy size={14} />
                        </button>
                    </div>
                    <p className="mt-2 opacity-70 text-[10px]">*Si usas Firebase, añádelo en Authentication &gt; Settings &gt; Authorized Domains</p>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
             <p className="text-[10px] text-gray-400">© 2025 Chat Monitor System v2.0</p>
        </div>

      </div>
    </div>
  );
};

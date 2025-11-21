import React from 'react';
import { AnalysisResult } from '../types';
import { BrainCircuit, ThumbsUp, ThumbsDown, AlertTriangle, Minus, Sparkles } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, loading, onAnalyze }) => {
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="text-green-500" size={20} />;
      case 'negative': return <ThumbsDown className="text-red-500" size={20} />;
      case 'alert': return <AlertTriangle className="text-orange-500" size={20} />;
      default: return <Minus className="text-gray-400" size={20} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
     switch (sentiment) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      case 'alert': return 'bg-orange-50 border-orange-200 animate-pulse';
      default: return 'bg-gray-50 border-gray-200';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-100">
        <div className="flex items-center gap-2">
            <BrainCircuit className="text-purple-600" />
            <h2 className="font-semibold text-gray-800">Gemini Live Insight</h2>
        </div>
        <button 
            onClick={onAnalyze}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
                loading ? 'bg-gray-100 text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
            }`}
        >
            {loading ? (
                <>Pensando...</>
            ) : (
                <><Sparkles size={12} /> Analizar Ahora</>
            )}
        </button>
      </div>

      {!analysis ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-6">
          <BrainCircuit size={48} className="mb-2 opacity-20" />
          <p className="text-sm">Presiona "Analizar Ahora" para obtener insights de la conversación en tiempo real.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
            
          {/* Sentiment Card */}
          <div className={`p-3 rounded-lg border ${getSentimentColor(analysis.sentiment)}`}>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Sentimiento</span>
                {getSentimentIcon(analysis.sentiment)}
            </div>
            <div className="font-medium text-gray-800 capitalize">{analysis.sentiment}</div>
          </div>

          {/* Intent Card */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
             <span className="text-xs font-bold uppercase text-blue-400 tracking-wider block mb-1">Intención Detectada</span>
             <p className="text-gray-800 font-medium">{analysis.intent}</p>
          </div>

          {/* Summary */}
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-1">Resumen</span>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Suggestions */}
          <div>
            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-2">Sugerencias para Agente</span>
            <ul className="space-y-2">
                {analysis.suggestions.map((sug, idx) => (
                    <li key={idx} className="text-sm p-2 bg-purple-50 text-purple-800 rounded-md border border-purple-100 flex gap-2 items-start">
                        <span className="text-purple-400 font-bold select-none">{idx + 1}.</span>
                        {sug}
                    </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

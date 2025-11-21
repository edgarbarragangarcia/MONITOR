import { GoogleGenAI, Type } from "@google/genai";
import { Message, AnalysisResult } from '../types';

// Initialize the client with the API Key from the environment
// Note: In a production app, this should be proxied or handled carefully.
// For this prototype, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeConversation = async (messages: Message[]): Promise<AnalysisResult> => {
  try {
    // Format conversation for the prompt
    const conversationText = messages.slice(-15).map(m => // Analyze last 15 messages for context
      `[${m.timestamp}] ${m.sender} (${m.role}): ${m.text}`
    ).join('\n');

    const model = "gemini-2.5-flash";
    
    const prompt = `
      Actúa como un supervisor de calidad y analista de conversaciones.
      Analiza la siguiente transcripción de chat entre un usuario y un agente de IA en WhatsApp.
      
      Transcripción:
      ${conversationText}
      
      Proporciona un análisis en formato JSON con los siguientes campos:
      - sentiment: "positive", "neutral", "negative", o "alert" (si el usuario está muy enojado o requiere humano).
      - summary: Un resumen muy breve (1 frase) de lo que está pasando.
      - intent: La intención principal del usuario (ej. "Comprar", "Soporte", "Queja").
      - suggestions: Una lista de 3 sugerencias cortas de respuesta para el agente.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative", "alert"] },
            summary: { type: Type.STRING },
            intent: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["sentiment", "summary", "intent", "suggestions"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error analyzing conversation:", error);
    return {
      sentiment: 'neutral',
      summary: 'Error al analizar la conversación.',
      intent: 'Desconocido',
      suggestions: []
    };
  }
};

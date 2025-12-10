export const USERS = [
    { id: 1, name: 'Deni 🖤✨🌻', time: '09:14', message: 'Me ayudas a saber có...', status: 'sos', type: 'alert' },
    { id: 2, name: 'Edgar Barragán G', time: '09:35', message: 'Dame el costo', status: 'online', type: 'money' },
    { id: 3, name: 'Ro', time: '09:32', message: '¿me podrías explicar c...', status: 'online', type: 'info' },
    { id: 4, name: 'Miguel Leon', time: '09:08', message: 'como se aplica el mera...', status: 'online', type: 'info' },
    { id: 5, name: 'Yann', time: '09:19', message: 'ok de nuevo ignorada', status: 'online', type: 'like' },
    { id: 6, name: 'Mary Abascal', time: '05:56', message: 'Bendecido sábado hoy...', status: 'online', type: 'money' },
    { id: 7, name: 'Tere.', time: '05:57', message: 'Gracias pero no conta...', status: 'online', type: 'hand' },
    { id: 8, name: 'Fpcervantes27', time: '05:59', message: 'Les mando mensaje y ...', status: 'online', type: 'user' },
    { id: 9, name: 'Gestor Heriberto 🇲🇽', time: '06:01', message: 'Pero no sé me dio seg...', status: 'online', type: 'hand' },
];

// Mock data representing the "Sheet" exports
export const DASHBOARD_METRICS = {
    totalChats: 2845,
    activeUsers: USERS.length,
    avgResponseTime: 42, // seconds
    resolutionRate: 96.5, // percentage
};

export const HOURLY_TRAFFIC = [
    { time: '06:00', messages: 45 },
    { time: '07:00', messages: 89 },
    { time: '08:00', messages: 132 },
    { time: '09:00', messages: 284 },
    { time: '10:00', messages: 356 },
    { time: '11:00', messages: 312 },
    { time: '12:00', messages: 290 },
    { time: '13:00', messages: 245 },
    { time: '14:00', messages: 210 },
    { time: '15:00', messages: 280 },
    { time: '16:00', messages: 412 },
    { time: '17:00', messages: 395 },
    { time: '18:00', messages: 380 },
    { time: '19:00', messages: 260 },
    { time: '20:00', messages: 150 },
    { time: '21:00', messages: 110 },
    { time: '22:00', messages: 84 },
];

export const TOP_TOPICS = [
    { topic: 'Costos y Presupuesto', count: 854 },
    { topic: 'Ubicación de Clínicas', count: 623 },
    { topic: 'Agenda Citas', count: 489 },
    { topic: 'Programas de Fertilidad', count: 356 },
    { topic: 'Especialistas', count: 210 },
    { topic: 'Horarios', count: 185 },
];

export const SENTIMENT_DATA = [
    { name: 'Positivo', value: 68, color: '#10b981' },
    { name: 'Neutral', value: 24, color: '#94a3b8' },
    { name: 'Negativo', value: 8, color: '#ef4444' },
];

export const FREQUENT_QUESTIONS = [
    { question: "¿Cuál es el costo de la primer consulta?", count: 432 },
    { question: "¿Aceptan seguro de gastos médicos?", count: 321 },
    { question: "¿Dónde están ubicados?", count: 289 },
    { question: "¿Cómo puedo agendar una cita?", count: 256 },
    { question: "¿Qué incluye el programa Bajando Estrellas?", count: 198 },
];

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

// Conversaciones por usuario
export const USER_CONVERSATIONS: Record<number, Array<{ id: string; text: string; author: 'user' | 'bot'; timestamp: Date }>> = {
    1: [ // Deni (SOS - urgente)
        { id: '1-1', text: 'Me ayudas a saber cómo funciona el programa de fertilidad?', author: 'user', timestamp: new Date('2024-12-10T09:10:00') },
        { id: '1-2', text: 'Claro, con gusto te ayudo. Nuestro programa de fertilidad incluye consulta inicial, estudios de diagnóstico y tratamiento personalizado. ¿Qué aspecto te interesa conocer más?', author: 'bot', timestamp: new Date('2024-12-10T09:10:30') },
        { id: '1-3', text: 'El costo total, tengo urgencia', author: 'user', timestamp: new Date('2024-12-10T09:11:00') },
        { id: '1-4', text: 'Entiendo tu urgencia. El programa completo tiene un costo desde $45,000 MXN. Incluye consultas, medicamentos y procedimientos básicos. ¿Te gustaría agendar una cita con un especialista hoy mismo?', author: 'bot', timestamp: new Date('2024-12-10T09:11:45') },
        { id: '1-5', text: 'Sí por favor, lo antes posible', author: 'user', timestamp: new Date('2024-12-10T09:14:00') },
    ],
    2: [ // Edgar Barragán G
        { id: '2-1', text: 'Dame el costo', author: 'user', timestamp: new Date('2024-12-10T09:30:00') },
        { id: '2-2', text: 'Hola Edgar, con gusto. ¿Te refieres al costo de algún tratamiento en particular o de la consulta inicial?', author: 'bot', timestamp: new Date('2024-12-10T09:30:15') },
        { id: '2-3', text: 'La consulta inicial y los tratamientos de fertilización in vitro', author: 'user', timestamp: new Date('2024-12-10T09:32:00') },
        { id: '2-4', text: 'La consulta inicial tiene un costo de $1,200 MXN. El tratamiento de FIV completo varía entre $65,000 y $95,000 MXN dependiendo del caso. Contamos con planes de financiamiento sin intereses.', author: 'bot', timestamp: new Date('2024-12-10T09:33:00') },
        { id: '2-5', text: 'Perfecto, mándame info del financiamiento', author: 'user', timestamp: new Date('2024-12-10T09:35:00') },
    ],
    3: [ // Ro
        { id: '3-1', text: '¿me podrías explicar cómo funciona el proceso?', author: 'user', timestamp: new Date('2024-12-10T09:28:00') },
        { id: '3-2', text: 'Por supuesto. El proceso inicia con una consulta de valoración, luego realizamos estudios de fertilidad tanto a ti como a tu pareja. Basados en los resultados, diseñamos un plan personalizado.', author: 'bot', timestamp: new Date('2024-12-10T09:29:00') },
        { id: '3-3', text: '¿Cuánto tiempo toma todo el proceso?', author: 'user', timestamp: new Date('2024-12-10T09:30:30') },
        { id: '3-4', text: 'El tiempo varía según cada caso, pero generalmente el proceso completo desde la primera consulta hasta el tratamiento toma entre 2-4 meses. Los estudios iniciales se completan en 2-3 semanas.', author: 'bot', timestamp: new Date('2024-12-10T09:31:15') },
        { id: '3-5', text: 'Entiendo, gracias por la información', author: 'user', timestamp: new Date('2024-12-10T09:32:00') },
    ],
    4: [ // Miguel Leon
        { id: '4-1', text: 'como se aplica el meralgin?', author: 'user', timestamp: new Date('2024-12-10T09:05:00') },
        { id: '4-2', text: 'El Meralgin es un medicamento que se utiliza durante tratamientos de fertilidad. Se aplica vía intramuscular, generalmente en el glúteo. Te recomiendo seguir las indicaciones específicas de tu médico tratante.', author: 'bot', timestamp: new Date('2024-12-10T09:06:00') },
        { id: '4-3', text: '¿Tiene efectos secundarios?', author: 'user', timestamp: new Date('2024-12-10T09:07:00') },
        { id: '4-4', text: 'Puede presentar dolor en el sitio de aplicación, molestias abdominales leves o náuseas. Si experimentas síntomas severos, contacta inmediatamente a tu médico. ¿Estás actualmente en tratamiento?', author: 'bot', timestamp: new Date('2024-12-10T09:07:45') },
        { id: '4-5', text: 'Sí, inicio la próxima semana', author: 'user', timestamp: new Date('2024-12-10T09:08:00') },
    ],
    5: [ // Yann
        { id: '5-1', text: 'Buenos días', author: 'user', timestamp: new Date('2024-12-10T09:15:00') },
        { id: '5-2', text: 'Buenos días, ¿en qué puedo ayudarte hoy?', author: 'bot', timestamp: new Date('2024-12-10T09:15:10') },
        { id: '5-3', text: 'Les escribí ayer y no me respondieron', author: 'user', timestamp: new Date('2024-12-10T09:16:00') },
        { id: '5-4', text: 'Lamento mucho esa situación. Déjame revisar tu caso. ¿Sobre qué tema necesitabas información?', author: 'bot', timestamp: new Date('2024-12-10T09:17:00') },
        { id: '5-5', text: 'ok de nuevo ignorada', author: 'user', timestamp: new Date('2024-12-10T09:19:00') },
    ],
    6: [ // Mary Abascal
        { id: '6-1', text: 'Bendecido sábado hoy quisiera información', author: 'user', timestamp: new Date('2024-12-10T05:50:00') },
        { id: '6-2', text: 'Buen día Mary, con gusto te ayudo. ¿Qué información necesitas?', author: 'bot', timestamp: new Date('2024-12-10T05:51:00') },
        { id: '6-3', text: '¿Tienen planes de pago para los tratamientos?', author: 'user', timestamp: new Date('2024-12-10T05:53:00') },
        { id: '6-4', text: 'Sí, contamos con diferentes opciones de financiamiento: pagos a meses sin intereses (3, 6, 9 y 12 meses), descuentos por pago de contado, y planes especiales según el tratamiento. ¿Te interesa alguno en particular?', author: 'bot', timestamp: new Date('2024-12-10T05:54:30') },
        { id: '6-5', text: 'El de 12 meses sin intereses', author: 'user', timestamp: new Date('2024-12-10T05:56:00') },
    ],
};

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

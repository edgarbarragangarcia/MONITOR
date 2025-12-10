// lib/sheets.ts - Google Sheets integration
export interface SheetMessage {
    pregunta: string;
    respuesta: string;
    telefono: string;
    nombre: string;
}

export interface ConversationMessage {
    id: string;
    text: string;
    author: 'user' | 'bot';
    timestamp: Date;
}

/**
 * Fetch data from Google Sheets published as CSV
 */
export async function fetchSheetData(): Promise<SheetMessage[]> {
    try {
        const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
        const gid = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_GID;

        if (!sheetId || !gid) {
            console.error('Missing Google Sheets configuration');
            return [];
        }

        // Using the CSV export URL from Google Sheets
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

        const response = await fetch(url, {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
        }

        const csvText = await response.text();
        const rows = parseCSV(csvText);

        return rows;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}

/**
 * Parse CSV text into structured data
 */
function parseCSV(csvText: string): SheetMessage[] {
    const lines = csvText.split('\n').filter(line => line.trim());

    if (lines.length === 0) return [];

    // Skip header row
    const dataLines = lines.slice(1);

    const messages: SheetMessage[] = [];

    for (const line of dataLines) {
        // Simple CSV parsing (handles quoted fields)
        const fields = parseCSVLine(line);

        if (fields.length >= 4) {
            messages.push({
                pregunta: fields[0] || '',
                respuesta: fields[1] || '',
                telefono: fields[2] || '',
                nombre: fields[3] || '',
            });
        }
    }

    return messages;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field delimiter
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    result.push(current);

    return result;
}

/**
 * Transform sheet messages into conversation format grouped by phone number
 */
export function groupMessagesByPhone(sheetMessages: SheetMessage[]): Record<string, ConversationMessage[]> {
    const conversations: Record<string, ConversationMessage[]> = {};

    sheetMessages.forEach((msg, index) => {
        const phone = msg.telefono.trim();
        if (!phone) return;

        if (!conversations[phone]) {
            conversations[phone] = [];
        }

        // Add user message (pregunta)
        if (msg.pregunta.trim()) {
            conversations[phone].push({
                id: `${phone}-${index}-user`,
                text: msg.pregunta,
                author: 'user',
                timestamp: new Date(), // You might want to parse real timestamps if available
            });
        }

        // Add bot response (respuesta)
        if (msg.respuesta.trim()) {
            conversations[phone].push({
                id: `${phone}-${index}-bot`,
                text: msg.respuesta,
                author: 'bot',
                timestamp: new Date(),
            });
        }
    });

    return conversations;
}

/**
 * Extract unique users from sheet data
 */
export function extractUsers(sheetMessages: SheetMessage[]) {
    const userMap = new Map<string, { name: string; phone: string; lastMessage: string }>();

    sheetMessages.forEach((msg) => {
        const phone = msg.telefono.trim();
        const name = msg.nombre.trim();

        if (phone && !userMap.has(phone)) {
            userMap.set(phone, {
                name: name || phone,
                phone,
                lastMessage: msg.pregunta || msg.respuesta || '',
            });
        }
    });

    return Array.from(userMap.values());
}

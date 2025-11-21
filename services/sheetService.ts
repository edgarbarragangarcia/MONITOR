
import { Message } from '../types';

// Internal Sheet ID (extracted from your edit link)
const SHEET_ID = '1rzTMY2f58shSJUNnuEyRs2uYxh28tUr8gN5eC--0yu0';

// The specific Sheet GID provided
const GID = '858654878';

// Published ID (from your pubhtml link)
const PUBLISHED_ID = '2PACX-1vRczmobnE9jf6ezfOQGFLX6AB8MSSLZQWqrfrNmwKtnLMv4ZePTAIPSMItz_LmABNFVDrUpe7zGy0N5';

// Helper to get fresh URLs to avoid caching issues
const getUrlOptions = () => {
  const timestamp = Date.now();
  return [
    // 1. User provided pubhtml (via HTML parsing) - Often most reliable for public web views
    `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pubhtml?gid=${GID}&single=true&t=${timestamp}`,

    // 2. Direct CSV Export (Best for data if permissions allow)
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${timestamp}`,
    
    // 3. Published CSV (Backup)
    `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pub?gid=${GID}&single=true&output=csv&t=${timestamp}`
  ];
};

// Proxies to bypass CORS
// Added cache busting param to proxy url itself where possible
const PROXIES = [
    (url: string) => `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&disableCache=true`
];

// Helper to parse CSV text
const parseCSV = (text: string): string[][] => {
  const trimmed = text.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.includes('<body')) {
      return [];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const nextChar = normalizedText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
    }
  }
  return rows;
};

// Helper to parse HTML Table from pubhtml
const parseHtmlTable = (html: string): string[][] => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Google sheets usually puts data in 'waffle' grid or main table
        const tables = doc.querySelectorAll('table');
        let bestTable: HTMLTableElement | null = null;
        let maxRows = 0;

        // Find the table with the most rows (likely the data table)
        tables.forEach(t => {
            const trs = t.querySelectorAll('tr');
            if (trs.length > maxRows) {
                maxRows = trs.length;
                bestTable = t;
            }
        });

        if (!bestTable) return [];

        const rows: string[][] = [];
        const trs = bestTable.querySelectorAll('tr');

        trs.forEach((trNode) => {
            const tr = trNode as HTMLElement;
            // Skip purely hidden rows (often used for spacing in google sheets)
            if (tr.style.display === 'none') return;

            const rowData: string[] = [];
            const tds = tr.querySelectorAll('td');
            
            tds.forEach(td => {
                rowData.push(td.textContent?.trim() || '');
            });

            // Only add row if it has some content
            if (rowData.some(cell => cell.length > 0)) {
                rows.push(rowData);
            }
        });

        return rows;
    } catch (e) {
        console.warn("Error parsing HTML table:", e);
        return [];
    }
};

const processDataToMessages = (data: string[][]): Message[] => {
    if (data.length < 2) return []; 

    // Filter technical garbage rows often found in scraped HTML
    const cleanData = data.filter(row => {
        const rowStr = row.join(' ').toLowerCase();
        if (rowStr.includes('function(') || rowStr.includes('var ') || rowStr.includes('<!doctype') || rowStr.includes('google-site-verification')) return false;
        return true;
    });

    // LOCATE HEADERS
    let headerRowIndex = -1;
    
    // Scan first 20 rows for the header
    for(let i = 0; i < Math.min(cleanData.length, 20); i++) {
        const row = cleanData[i].map(c => c.toLowerCase());
        // Flexible matching
        if ((row.some(c => c.includes('pregunta')) && row.some(c => c.includes('respuesta'))) ||
            (row.includes('marca temporal') && row.includes('usuario'))) {
            headerRowIndex = i;
            break;
        }
    }

    // Default to 0 if not found
    if (headerRowIndex === -1) headerRowIndex = 0;

    const headers = cleanData[headerRowIndex].map(h => h.toLowerCase());
    
    // Column Mapping
    let questionIdx = headers.findIndex(h => h.includes('pregunta'));
    let answerIdx = headers.findIndex(h => h.includes('respuesta'));
    let nameIdx = headers.findIndex(h => h.includes('nombre'));
    const phoneIdx = headers.findIndex(h => h.includes('teléfono') || h.includes('telefono'));
    const timeIdx = headers.findIndex(h => h.includes('marca') || h.includes('timestamp') || h.includes('fecha'));

    // FALLBACK: If headers failed detection, assume A=Pregunta, B=Respuesta
    if (questionIdx === -1 && answerIdx === -1) {
        // Only fallback if row likely has data (not empty)
        if (cleanData[0] && cleanData[0].length >= 2) {
            questionIdx = 0; // Column A
            answerIdx = 1;   // Column B
            if (cleanData[0].length > 3) nameIdx = 3; // Guessing Column D for name
        }
    }

    const messages: Message[] = [];
    
    // Process content rows
    cleanData.slice(headerRowIndex + 1).forEach((row, index) => {
        if (!row) return;

        const question = (questionIdx !== -1 && row[questionIdx]) ? row[questionIdx] : '';
        const answer = (answerIdx !== -1 && row[answerIdx]) ? row[answerIdx] : '';
        
        // Skip empty rows
        if (!question && !answer) return;

        let userName = (nameIdx !== -1 && row[nameIdx]) ? row[nameIdx] : 'Usuario';
        const userPhone = (phoneIdx !== -1 && row[phoneIdx]) ? row[phoneIdx] : '';
        
        if (userPhone) userName += ` (${userPhone})`;
        if (!userName || userName === 'undefined') userName = 'Usuario Desconocido';

        // Generate a valid timestamp
        let timeDisplay = (timeIdx !== -1 && row[timeIdx]) ? row[timeIdx] : '';
        if (!timeDisplay) {
            // Fallback: generate fake times that look consecutive so list is ordered
            // We assume list is chronological. We subtract minutes from "now".
            const offset = cleanData.length - index;
            const date = new Date(Date.now() - offset * 1000 * 60); // 1 minute per message diff
            timeDisplay = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        // Unique Conversation ID for this user/row
        // We use the formatted User Name (+ Phone) as the unique ID for the conversation thread
        const conversationId = userName;

        // 1. User Question Message
        if (question) {
            messages.push({
                id: `msg-${index}-q`,
                timestamp: timeDisplay,
                sender: userName,
                text: question,
                role: 'user',
                conversationId: conversationId
            });
        }

        // 2. Agent Answer Message
        if (answer) {
            messages.push({
                id: `msg-${index}-a`,
                timestamp: timeDisplay,
                sender: 'Agente IA', 
                text: answer,
                role: 'agent',
                conversationId: conversationId
            });
        }
    });
    
    return messages;
};

export const fetchSheetData = async (): Promise<Message[]> => {
  let lastError = null;
  const urls = getUrlOptions();

  // Try different proxies/URLs
  for (const proxyFunc of PROXIES) {
      for (const url of urls) {
        try {
            const fullUrl = proxyFunc(url);
            
            // Abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);

            const response = await fetch(fullUrl, { 
                cache: 'no-store',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) continue;
            
            let text = '';
            if (fullUrl.includes('allorigins')) {
                const json = await response.json();
                text = json.contents;
            } else {
                text = await response.text();
            }

            if (!text) continue;

            let parsedData: string[][] = [];

            // Determine format based on content
            if (text.trim().startsWith('<') && text.includes('<table')) {
                 parsedData = parseHtmlTable(text);
            } else {
                 parsedData = parseCSV(text);
            }

            if (parsedData.length > 0) {
                const msgs = processDataToMessages(parsedData);
                if (msgs.length > 0) {
                    return msgs;
                }
            }
        } catch (error) {
            lastError = error;
            // Quiet fail, try next option
        }
      }
  }
  
  if (lastError) console.error("Connection failed after all attempts.", lastError);
  return [];
};

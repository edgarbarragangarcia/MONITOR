import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
        const gid = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_GID;

        console.log('🔍 Checking sheet config:', {
            hasSheetId: !!sheetId,
            sheetIdLength: sheetId?.length,
            hasGid: !!gid,
            gid: gid
        });

        if (!sheetId) {
            console.error('❌ Missing NEXT_PUBLIC_GOOGLE_SHEETS_ID environment variable');
            return NextResponse.json({ error: 'Missing sheet configuration' }, { status: 500 });
        }

        // Use the public CSV export method (simpler, no auth needed)
        const finalGid = gid || '0';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${finalGid}`;

        const response = await fetch(url, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const csvText = await response.text();

        // Use PapaParse for robust CSV parsing
        const parseResult = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => {
                // Normalize headers to match our interface
                const normalized = header.trim().toLowerCase();
                if (normalized.includes('pregunta')) return 'pregunta';
                if (normalized.includes('respuesta')) return 'respuesta';
                if (normalized.includes('tel') || normalized.includes('fono')) return 'telefono';
                if (normalized.includes('nombre')) return 'nombre';
                return header;
            }
        });

        if (parseResult.errors.length > 0) {
            console.error('CSV parsing errors:', parseResult.errors);
        }

        // Transform parsed data to our interface
        const data: SheetRow[] = parseResult.data.map((row: any) => ({
            pregunta: row.pregunta?.trim() || '',
            respuesta: row.respuesta?.trim() || '',
            telefono: row.telefono?.trim() || '',
            nombre: row.nombre?.trim() || '',
        }));

        console.log(`✅ Parsed ${data.length} rows from sheet`);
        console.log('First 3 rows:', data.slice(0, 3));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return NextResponse.json({
            error: 'Failed to fetch sheet data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

interface SheetRow {
    pregunta: string;
    respuesta: string;
    telefono: string;
    nombre: string;
}

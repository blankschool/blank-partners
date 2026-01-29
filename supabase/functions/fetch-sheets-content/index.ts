import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentItem {
  id: string;
  status: string;
  date: string;
  format: string;
  url: string;
  socialMedia: string;
  client: string;
}

function parseCSV(csvText: string): ContentItem[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find column indices
  const idIndex = headers.findIndex(h => h.includes('content') && h.includes('id'));
  const statusIndex = headers.findIndex(h => h === 'status' || h.includes('status'));
  const dateIndex = headers.findIndex(h => h === 'data' || h === 'date');
  const formatIndex = headers.findIndex(h => h === 'format' || h.includes('format'));
  const urlIndex = headers.findIndex(h => h === 'url' || h.includes('url'));
  const smIndex = headers.findIndex(h => h === 'sm' || h.includes('social') || h.includes('mídia'));

  console.log('Found headers:', headers);
  console.log('Column indices:', { idIndex, statusIndex, dateIndex, formatIndex, urlIndex, smIndex });

  const items: ContentItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV parsing with potential quoted values
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const id = idIndex >= 0 ? values[idIndex] || '' : '';
    const status = statusIndex >= 0 ? values[statusIndex] || '' : '';
    const date = dateIndex >= 0 ? values[dateIndex] || '' : '';
    const format = formatIndex >= 0 ? values[formatIndex] || '' : '';
    const url = urlIndex >= 0 ? values[urlIndex] || '' : '';
    const socialMedia = smIndex >= 0 ? values[smIndex] || '' : '';

    // Extract client from ID (format: "ClientName - ContentTitle" or similar)
    let client = '';
    if (id.includes(' - ')) {
      client = id.split(' - ')[0].trim();
    } else if (id.includes('_')) {
      client = id.split('_')[0].trim();
    }

    if (id || status || date) {
      items.push({
        id,
        status,
        date,
        format,
        url,
        socialMedia,
        client,
      });
    }
  }

  console.log(`Parsed ${items.length} content items`);
  return items;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const sheetsUrl = Deno.env.get('GOOGLE_SHEETS_URL');
    
    if (!sheetsUrl) {
      console.error('GOOGLE_SHEETS_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Google Sheets URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Google Sheets CSV...');
    
    const response = await fetch(sheetsUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch sheets:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch Google Sheets data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const csvText = await response.text();
    console.log('CSV fetched, length:', csvText.length);

    const items = parseCSV(csvText);

    return new Response(
      JSON.stringify({ items, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in fetch-sheets-content:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

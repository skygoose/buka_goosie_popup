import { createClient } from '@supabase/supabase-js';

function parseRawJson(req){
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch(e){ reject(e); }
    });
    req.on('error', err => reject(err));
  });
}

export default async function handler(req, res){
  // Allow simple CORS for testing (adjust for production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY){
    console.error('Missing SUPABASE env vars');
    return res.status(500).json({ error: 'Server misconfiguration: missing SUPABASE env vars' });
  }

  // Create client per-request to ensure envs are available
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Support both parsed body (platform may provide) and raw JSON
    let body = req.body;
    if (!body || Object.keys(body).length === 0){
      try { body = await parseRawJson(req); } catch(e){ /* ignore, handled below */ }
    }

    const name = (body && body.name) || null;
    const breads = (body && body.breads) || [];
    const drinks = (body && body.drinks) || [];

    if ((!Array.isArray(breads) || breads.length === 0) && (!Array.isArray(drinks) || drinks.length === 0)){
      return res.status(400).json({ error: 'No items selected' });
    }

    const payload = { name, breads, drinks, source: 'website' };

    const { data, error } = await supabase.from('submissions').insert([payload]).select();
    if (error){
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: 'DB insert error', details: error.message });
    }

    return res.status(200).json({ ok: true, inserted: data && data[0] ? { id: data[0].id } : null });
  } catch (err){
    console.error('Handler unexpected error', err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}

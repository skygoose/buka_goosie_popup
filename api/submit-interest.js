import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { name, breads, drinks } = req.body || {};
    if ((!breads || breads.length === 0) && (!drinks || drinks.length === 0)) {
      return res.status(400).json({ error: 'No items selected' });
    }

    const payload = { name: name || null, breads, drinks, source: 'website' };
    const { error } = await supabase.from('submissions').insert([payload]);
    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: 'DB insert error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Handler error', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

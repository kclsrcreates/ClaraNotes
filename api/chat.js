const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { system, message } = req.body;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://clara-notes.vercel.app',
        'X-Title': 'ClaraNotes'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response received.';
    res.status(200).json({ content: [{ text: reply }] });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = handler;

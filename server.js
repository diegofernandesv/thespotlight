app.post('/api/generate-summary', async (req, res) => {
  const { answers } = req.body;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }
const prompt = `
From the answers below, choose the 3 most important answers and summarize it in ONE short, warm sentence. DO NOT EXCEED 100 CHARACTERS.

${Object.values(answers).map((a, i) => `Q${i + 1}: ${a.question}<br/>A: ${a.answer}<br/>`).join('')}
Core values: empathy, engagement, awareness, authenticity.
`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.8,
      }),
    });
    if (!response.ok) {
      throw new Error('OpenAI API error');
    }
    const data = await response.json();
    // Here is the change: .trim().slice(0, 100) guarantees 100 characters max.
    const summary = data.choices[0].message.content.trim().slice(0, 100);
    res.status(200).json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
});

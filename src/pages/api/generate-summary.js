// pages/api/generate-summary.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { answers } = req.body;
  // const apiKey = process.env.OPENAI_API_KEY;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'Missing OpenAI API key' });
    return;
  }

  // Create prompt from answers
const prompt = `
Summarize the following visitor's quiz answers in ONE short paragraph of MAXIMUM 100 characters.

Here are the visitor's answers to a museum quiz:
${Object.values(answers).map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}\n`).join('\n')}

Focus on values like empathy, engagement, awareness, and authenticity. Make it warm and personal.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Or 'gpt-4o'/'gpt-4.1-mini' if you want
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    res.status(200).json({ summary: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
}

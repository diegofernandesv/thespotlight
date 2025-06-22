// pages/api/generate-summary.js
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { answers } = req.body;
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    res.status(500).json({ error: 'Missing OpenAI API key' });
    return;
  }

  // Create prompt from answers
  const prompt = `
Write a warm, friendly, and personal summary of what these answers reveal about the visitor's values, attitudes, and reflections. DO NOT EXCEED 400 CHARACTERS

Here are the visitor's answers to a museum quiz:
${Object.values(answers).map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}\n`).join('\n')}

Your summary must:
- Talk to them in the second person.
- Use a casual, serious, respectful andconversational, positive tone.
- Focus on what makes the visitor's perspective unique and thoughtful.
- Avoid generic feedback—connect each insight to specific answers.
- Keep paragraphs short (max 2–3 sentences each, about 150 characters per paragraph) for easy reading on screens.
- Limit the summary to 3–4 short paragraphs, so it's easy to scan and doesn't feel overwhelming.

Focus on values like empathy, engagement, awareness, and authenticity.
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

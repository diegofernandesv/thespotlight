import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();

app.post('/api/generate-summary', async (req, res) => {
  const { answers } = req.body;

  if (!OPENAI_API_KEY) {
    console.error('Missing OpenAI API key!');
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }
  if (!answers) {
    console.error("No answers provided in request!");
    return res.status(400).json({ error: 'No answers provided' });
  }

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
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('OpenAI API error');
    }
    const data = await response.json();
    const summary = data.choices[0].message.content.trim();
    res.status(200).json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Summary API server running on http://localhost:${PORT}`);
});

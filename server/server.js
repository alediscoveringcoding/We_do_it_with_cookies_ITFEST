// Express server for OpenAI API calls
// Keeps API key server-side only

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { question, careerContext } = req.body;
  
  const systemPrompt = careerContext 
    ? `You are a helpful career advisor for high school students. The student is asking about a career. Here is context about the career: ${careerContext}. Give a concise, encouraging, and practical answer in 2-3 sentences.` 
    : `You are a helpful career advisor for high school students. Give concise, encouraging, practical advice in 2-3 sentences.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ]
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT || 3000));

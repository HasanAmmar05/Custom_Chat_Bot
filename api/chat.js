const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
You are an advanced real estate assistant. You provide detailed information on properties, streets, and neighborhoods in Kuala Lumpur, Selangor, Putrajaya, and Cyberjaya.

**Guidelines:**
1. Use clear headings, bullet points, and tables.
2. Format currency as RM X,XXX,XXX.
3. Present data in structured formats with images and summaries.
4. Use **bold** and *italic* text for emphasis.
5. Conclude with key takeaways or a summary.`,
          },
          { role: 'user', content: req.body.message },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        n: 1,
      });

      const response = chatCompletion.choices[0]?.message?.content || '';
      res.status(200).json({ message: response });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

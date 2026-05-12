const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot-groq.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: req.body.messages,
        max_tokens: 1000
      })
    });
    const data = await response.json();
    res.json({
      content: [{
        text: data.choices[0].message.content
      }]
    });
  } catch(err) {
    console.log('Error:', err.message);
    res.status(500).json({error: err.message});
  }
});

app.listen(process.env.PORT || 3001, () => console.log('Groq Server chal raha hai!'));
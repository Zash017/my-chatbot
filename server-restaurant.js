const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot-groq.html'));
});

function detectLanguage(text) {
  const urduScript = /[\u0600-\u06FF]/;
  if (urduScript.test(text)) return 'urdu';
  const romanUrduWords = /\b(kya|hai|hain|karo|mujhe|aap|ka|ki|ke|mein|se|ko|tha|thi|bhi|nahi|hoga|kaise|kab|kahan|kyun|dikhao|batao|chahiye|milega|order|menu)\b/i;
  if (romanUrduWords.test(text)) return 'roman';
  return 'english';
}

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages;
    const lastMessage = messages[messages.length - 1].content;
    const lang = detectLanguage(lastMessage);

    let langInstruction = '';
    if (lang === 'urdu') {
      langInstruction = 'IMPORTANT: Reply ONLY in Urdu script (اردو). Do not use English or Roman Urdu.';
    } else if (lang === 'roman') {
      langInstruction = 'IMPORTANT: Reply ONLY in Roman Urdu. Do not use English or Urdu script.';
    } else {
      langInstruction = 'IMPORTANT: Reply ONLY in English. Do not use Urdu or Roman Urdu.';
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are "Ali", the AI assistant for Pizza Palace restaurant in Karachi.

${langInstruction}

MENU:
- Margherita Pizza: Rs. 800
- Chicken BBQ Pizza: Rs. 1200
- Beef Burger: Rs. 600
- French Fries: Rs. 300
- Cold Drink: Rs. 150

HOURS: 12pm to 12am (7 days a week)
LOCATION: Karachi, Gulshan-e-Iqbal
PHONE: 0300-1234567
DELIVERY: Available (30-45 mins)

YOUR JOB:
- Answer ONLY what is asked
- Keep replies short and to the point
- Only help with Pizza Palace related questions
- If unrelated question: reply accordingly in detected language`
          },
          ...messages
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log('Groq Response:', JSON.stringify(data));
    console.log('Detected Language:', lang);
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

app.listen(process.env.PORT || 8080, () => console.log('Restaurant Server chal raha hai!'));
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

app.post('/chat', async (req, res) => {
  try {
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
- Answer only what the customer asks — no extra information
- Keep replies short and to the point
- Help with menu, orders, timing, location, delivery
- If asked anything unrelated to Pizza Palace, say: "I can only help with Pizza Palace information."
- Suggest a drink or side only if customer is placing an order

STRICT LANGUAGE RULE:
- Detect the language of the user's message
- Reply in that EXACT language and script
- English message → English reply only
- Urdu script (اردو) → Urdu script reply only
- Roman Urdu → Roman Urdu reply only
- NEVER switch languages mid-conversation
- NEVER default to Urdu or Roman Urdu
- Match the user's language every single time, no exceptions`
          },
          ...req.body.messages
        ],
        max_tokens: 1000
      })
    });
    const data = await response.json();
    console.log('Groq Response:', JSON.stringify(data));
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
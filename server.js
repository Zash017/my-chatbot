const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `Aap "Pizza Palace" restaurant ke AI assistant hain.
Aapka kaam hai customers ki madad karna.

Menu:
- Margherita Pizza: Rs. 800
- Chicken BBQ Pizza: Rs. 1200
- Beef Burger: Rs. 600
- French Fries: Rs. 300
- Cold Drink: Rs. 150

Timing: Sham 12 baje se raat 12 baje tak
Location: Karachi, Gulshan-e-Iqbal
Phone: 0300-1234567

Sirf restaurant ke baare mein baat karein. Friendly aur helpful rahein!`;

app.post('/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      ...req.body,
      system: SYSTEM_PROMPT
    })
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log('Server chal raha hai port 3000 par!'));
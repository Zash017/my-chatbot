const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      ...req.body
    })
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log('Server chal raha hai port 3000 par!'));
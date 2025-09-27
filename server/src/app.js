import express from 'express';
import cors from 'cors';
import employeesRouter from './routes/employees.js';
import projectsRouter from './routes/projects.js';
import matchRouter from './routes/match.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'SkillSync API' });
});

app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      projects: '/api/projects',
      match: '/api/match'
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/match', matchRouter);

export default app;

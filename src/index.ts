import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';
import { serve } from '@hono/node-server'
import todosRouter from './routes/todos';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Hono CRUD API is running!',
    version: '1.0.0',
    endpoints: {
      todos: '/todos',
    },
  });
});

// Routes
app.route('/todos', todosRouter);

// Error handling
app.onError(errorHandler);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

serve(app);

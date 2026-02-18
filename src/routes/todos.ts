import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { todos } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const todosRouter = new Hono();

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// GET /todos - List all todos
todosRouter.get('/', async (c) => {
  try {
    const allTodos = await db.select().from(todos);
    return c.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new HTTPException(500, { message: 'Failed to fetch todos' });
  }
});

// GET /todos/:id - Get a single todo
todosRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  
  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid todo ID' });
  }

  try {
    const todo = await db.select().from(todos).where(eq(todos.id, id));
    
    if (todo.length === 0) {
      throw new HTTPException(404, { message: 'Todo not found' });
    }

    return c.json(todo[0]);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error('Error fetching todo:', error);
    throw new HTTPException(500, { message: 'Failed to fetch todo' });
  }
});

// POST /todos - Create a new todo
todosRouter.post('/', zValidator('json', createTodoSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const newTodo = await db
      .insert(todos)
      .values({
        title: data.title,
        description: data.description,
        completed: data.completed,
      })
      .returning();

    return c.json(newTodo[0], 201);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new HTTPException(500, { message: 'Failed to create todo' });
  }
});

// PUT /todos/:id - Update a todo
todosRouter.put('/:id', zValidator('json', updateTodoSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');

  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid todo ID' });
  }

  try {
    // Check if todo exists
    const existing = await db.select().from(todos).where(eq(todos.id, id));
    
    if (existing.length === 0) {
      throw new HTTPException(404, { message: 'Todo not found' });
    }

    const updated = await db
      .update(todos)
      .set({
        ...data,
        updatedAt: sql`NOW()`,
      })
      .where(eq(todos.id, id))
      .returning();

    return c.json(updated[0]);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error('Error updating todo:', error);
    throw new HTTPException(500, { message: 'Failed to update todo' });
  }
});

// DELETE /todos/:id - Delete a todo
todosRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid todo ID' });
  }

  try {
    // Check if todo exists
    const existing = await db.select().from(todos).where(eq(todos.id, id));
    
    if (existing.length === 0) {
      throw new HTTPException(404, { message: 'Todo not found' });
    }

    await db.delete(todos).where(eq(todos.id, id));

    return c.json({ message: 'Todo deleted successfully' }, 200);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error('Error deleting todo:', error);
    throw new HTTPException(500, { message: 'Failed to delete todo' });
  }
});

export default todosRouter;

import { test, expect } from '@playwright/test';

test.describe('Hono CRUD API E2E Tests', () => {
  let createdTodoId: number;

  test('should return API information on root endpoint', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('endpoints');
  });

  test('should create a new todo (CREATE)', async ({ request }) => {
    const newTodo = {
      title: 'Test Todo from E2E',
      description: 'This is a test todo created by Playwright',
      completed: false,
      priority: 'high',
    };

    const response = await request.post('/todos', {
      data: newTodo,
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    
    expect(data).toHaveProperty('id');
    expect(data.title).toBe(newTodo.title);
    expect(data.description).toBe(newTodo.description);
    expect(data.completed).toBe(false);
    expect(data.priority).toBe('high');
    expect(data).toHaveProperty('createdAt');
    expect(data).toHaveProperty('updatedAt');

    // Store the ID for later tests
    createdTodoId = data.id;
  });

  test('should get all todos (READ)', async ({ request }) => {
    const response = await request.get('/todos');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('should get a specific todo by ID (READ)', async ({ request }) => {
    // First create a todo to ensure we have one
    const newTodo = {
      title: 'Specific Todo',
      description: 'To be fetched by ID',
      priority: 'medium',
    };
    const createResponse = await request.post('/todos', { data: newTodo });
    const created = await createResponse.json();

    const response = await request.get(`/todos/${created.id}`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.id).toBe(created.id);
    expect(data.title).toBe(newTodo.title);
    expect(data.description).toBe(newTodo.description);
    expect(data.priority).toBe('medium');
  });

  test('should return 404 for non-existent todo', async ({ request }) => {
    const response = await request.get('/todos/999999');
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should update a todo (UPDATE)', async ({ request }) => {
    // First create a todo
    const newTodo = {
      title: 'Todo to Update',
      description: 'Original description',
      priority: 'low',
    };
    const createResponse = await request.post('/todos', { data: newTodo });
    const created = await createResponse.json();

    // Update the todo
    const updateData = {
      title: 'Updated Todo',
      description: 'Updated description',
      completed: true,
      priority: 'high',
    };

    const response = await request.put(`/todos/${created.id}`, {
      data: updateData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data.id).toBe(created.id);
    expect(data.title).toBe(updateData.title);
    expect(data.description).toBe(updateData.description);
    expect(data.completed).toBe(true);
    expect(data.priority).toBe('high');
  });

  test('should partially update a todo', async ({ request }) => {
    // First create a todo
    const newTodo = {
      title: 'Partial Update Test',
      description: 'Original',
      completed: false,
      priority: 'medium',
    };
    const createResponse = await request.post('/todos', { data: newTodo });
    const created = await createResponse.json();

    // Partially update (only completed field)
    const updateData = {
      completed: true,
    };

    const response = await request.put(`/todos/${created.id}`, {
      data: updateData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data.id).toBe(created.id);
    expect(data.title).toBe(newTodo.title); // Should remain unchanged
    expect(data.description).toBe(newTodo.description); // Should remain unchanged
    expect(data.completed).toBe(true); // Should be updated
    expect(data.priority).toBe('medium'); // Should remain unchanged
  });

  test('should delete a todo (DELETE)', async ({ request }) => {
    // First create a todo to delete
    const newTodo = {
      title: 'Todo to Delete',
      description: 'Will be deleted',
      priority: 'low',
    };
    const createResponse = await request.post('/todos', { data: newTodo });
    const created = await createResponse.json();

    // Delete the todo
    const deleteResponse = await request.delete(`/todos/${created.id}`);
    expect(deleteResponse.ok()).toBeTruthy();
    
    const deleteData = await deleteResponse.json();
    expect(deleteData).toHaveProperty('message');

    // Verify it's deleted
    const getResponse = await request.get(`/todos/${created.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 when deleting non-existent todo', async ({ request }) => {
    const response = await request.delete('/todos/999999');
    expect(response.status()).toBe(404);
  });

  test('should validate required fields on create', async ({ request }) => {
    const invalidTodo = {
      description: 'Missing title',
    };

    const response = await request.post('/todos', {
      data: invalidTodo,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should validate empty title', async ({ request }) => {
    const invalidTodo = {
      title: '',
      description: 'Empty title',
    };

    const response = await request.post('/todos', {
      data: invalidTodo,
    });

    expect(response.status()).toBe(400);
  });

  test('should handle invalid todo ID format', async ({ request }) => {
    const response = await request.get('/todos/invalid-id');
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should return 404 for unknown routes', async ({ request }) => {
    const response = await request.get('/unknown-route');
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should complete full CRUD flow', async ({ request }) => {
    // 1. Create
    const newTodo = {
      title: 'Full CRUD Flow Test',
      description: 'Testing complete flow',
      completed: false,
      priority: 'medium',
    };

    const createResponse = await request.post('/todos', { data: newTodo });
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    const todoId = created.id;

    // 2. Read (single)
    const getResponse = await request.get(`/todos/${todoId}`);
    expect(getResponse.ok()).toBeTruthy();
    const fetched = await getResponse.json();
    expect(fetched.id).toBe(todoId);

    // 3. Read (list)
    const listResponse = await request.get('/todos');
    expect(listResponse.ok()).toBeTruthy();
    const list = await listResponse.json();
    const found = list.find((t: any) => t.id === todoId);
    expect(found).toBeDefined();

    // 4. Update
    const updateResponse = await request.put(`/todos/${todoId}`, {
      data: { completed: true, priority: 'high' },
    });
    expect(updateResponse.ok()).toBeTruthy();
    const updated = await updateResponse.json();
    expect(updated.completed).toBe(true);
    expect(updated.priority).toBe('high');

    // 5. Delete
    const deleteResponse = await request.delete(`/todos/${todoId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // 6. Verify deletion
    const verifyResponse = await request.get(`/todos/${todoId}`);
    expect(verifyResponse.status()).toBe(404);
  });
});

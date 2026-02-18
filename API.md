# API Documentation

## Base Information

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **API Version**: 1.0.0

## Endpoints

### Health Check

Check if the API is running.

```http
GET /
```

**Response** `200 OK`
```json
{
  "message": "Hono CRUD API is running!",
  "version": "1.0.0",
  "endpoints": {
    "todos": "/todos"
  }
}
```

---

### List All Todos

Retrieve all todos from the database.

```http
GET /todos
```

**Response** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Write documentation",
    "description": "Complete API docs",
    "completed": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
]
```

---

### Get Single Todo

Retrieve a specific todo by ID.

```http
GET /todos/:id
```

**Parameters**
- `id` (integer, required) - The todo ID

**Response** `200 OK`
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**

`400 Bad Request` - Invalid ID format
```json
{
  "error": "Invalid todo ID"
}
```

`404 Not Found` - Todo not found
```json
{
  "error": "Todo not found"
}
```

---

### Create Todo

Create a new todo item.

```http
POST /todos
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "New Todo",
  "description": "Optional description",
  "completed": false
}
```

**Field Validation**
- `title` (string, required) - 1-255 characters
- `description` (string, optional) - Any length
- `completed` (boolean, optional) - Default: `false`

**Response** `201 Created`
```json
{
  "id": 3,
  "title": "New Todo",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

**Error Responses**

`400 Bad Request` - Validation error
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

---

### Update Todo

Update an existing todo. All fields are optional - only include fields you want to update.

```http
PUT /todos/:id
Content-Type: application/json
```

**Parameters**
- `id` (integer, required) - The todo ID

**Request Body** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

**Field Validation**
- `title` (string, optional) - 1-255 characters
- `description` (string, optional) - Any length
- `completed` (boolean, optional)

**Response** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

**Error Responses**

`400 Bad Request` - Invalid ID or validation error
```json
{
  "error": "Invalid todo ID"
}
```

`404 Not Found` - Todo not found
```json
{
  "error": "Todo not found"
}
```

---

### Delete Todo

Delete a todo by ID.

```http
DELETE /todos/:id
```

**Parameters**
- `id` (integer, required) - The todo ID

**Response** `200 OK`
```json
{
  "message": "Todo deleted successfully"
}
```

**Error Responses**

`400 Bad Request` - Invalid ID format
```json
{
  "error": "Invalid todo ID"
}
```

`404 Not Found` - Todo not found
```json
{
  "error": "Todo not found"
}
```

---

## Common Error Responses

### 404 Not Found (Unknown Route)
```json
{
  "error": "Not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Example Usage

### Using cURL

**Create a todo**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Hono", "description": "Study the Hono framework"}'
```

**Get all todos**
```bash
curl http://localhost:3000/todos
```

**Update a todo**
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a todo**
```bash
curl -X DELETE http://localhost:3000/todos/1
```

### Using JavaScript (fetch)

```javascript
// Create a todo
const response = await fetch('http://localhost:3000/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Learn Hono',
    description: 'Study the Hono framework',
  }),
});
const todo = await response.json();

// Get all todos
const todos = await fetch('http://localhost:3000/todos').then(r => r.json());

// Update a todo
await fetch(`http://localhost:3000/todos/${todo.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    completed: true,
  }),
});

// Delete a todo
await fetch(`http://localhost:3000/todos/${todo.id}`, {
  method: 'DELETE',
});
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error occurred |

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production deployments.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

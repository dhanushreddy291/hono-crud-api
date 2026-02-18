# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│         (Browser, Postman, cURL, etc.)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         │ (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      HONO SERVER                            │
│                   (src/index.ts)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Pipeline                                  │  │
│  │  • Logger (request logging)                          │  │
│  │  • CORS (cross-origin requests)                      │  │
│  │  • Zod Validator (input validation)                  │  │
│  │  • Error Handler (error management)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (src/routes/todos.ts)                        │  │
│  │  • GET    /             - Health check               │  │
│  │  • GET    /todos        - List all todos             │  │
│  │  • GET    /todos/:id    - Get single todo            │  │
│  │  • POST   /todos        - Create todo                │  │
│  │  • PUT    /todos/:id    - Update todo                │  │
│  │  • DELETE /todos/:id    - Delete todo                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Drizzle ORM
                         │ (src/db/index.ts)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                        │
│                     (Neon Cloud)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  todos Table                                          │  │
│  │  • id (serial, PK)                                    │  │
│  │  • title (text, NOT NULL)                            │  │
│  │  • description (text)                                │  │
│  │  • completed (boolean, default: false)               │  │
│  │  • createdAt (timestamp)                             │  │
│  │  • updatedAt (timestamp)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Example: Create Todo

```
1. Client Request
   POST /todos
   Content-Type: application/json
   {
     "title": "Buy groceries",
     "description": "Milk, eggs, bread"
   }
   
                  ↓
                  
2. Hono Middleware
   • Logger: Log request details
   • CORS: Validate origin
   • Zod Validator: Validate JSON against schema
   
                  ↓
                  
3. Route Handler (src/routes/todos.ts)
   • Extract validated data
   • Call Drizzle ORM
   
                  ↓
                  
4. Database Layer (src/db/)
   • Insert todo into database
   • Return created record
   
                  ↓
                  
5. Response
   Status: 201 Created
   {
     "id": 1,
     "title": "Buy groceries",
     "description": "Milk, eggs, bread",
     "completed": false,
     "createdAt": "2024-01-15T10:30:00Z",
     "updatedAt": "2024-01-15T10:30:00Z"
   }
```

## Error Handling Flow

```
Request → Middleware → Route Handler
                          ↓
                    Error Occurs?
                          ↓
                    ┌─────┴─────┐
                    │           │
                   YES         NO
                    │           │
                    ↓           ↓
            Error Handler    Success Response
            (middleware/     
            errorHandler.ts)
                    │
                    ↓
            JSON Error Response
            {
              "error": "message",
              "status": 4xx/5xx
            }
```

## Component Responsibilities

### src/index.ts (Main Server)
- Initialize Hono app
- Setup middleware
- Register routes
- Export server config

### src/routes/todos.ts (Route Handlers)
- Define API endpoints
- Validate input
- Handle business logic
- Return responses

### src/db/schema.ts (Database Schema)
- Define table structure
- Set constraints
- Define types
- Export schema

### src/db/index.ts (Database Connection)
- Create database client
- Initialize Drizzle
- Export db instance

### src/middleware/errorHandler.ts (Error Handling)
- Catch all errors
- Format error responses
- Log errors
- Return appropriate status codes

### tests/todos.spec.ts (E2E Tests)
- Test CRUD operations
- Validate responses
- Test error cases
- Verify database state

## Data Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│  Client  │ ───> │  Hono   │ ───> │ Drizzle  │ ───> │ Database │
└──────────┘      └─────────┘      └──────────┘      └──────────┘
     ▲                                                      │
     │                                                      │
     └──────────────────────────────────────────────────────┘
                    Response with data
```

## Validation Pipeline

```
Input Data
    │
    ↓
Zod Schema Validation
    │
    ├─ Valid ──────────> Continue to handler
    │
    └─ Invalid ────────> Return 400 Bad Request
                         with validation errors
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  • Hono (Web Framework)                 │
│  • TypeScript (Type Safety)             │
└────────────┬────────────────────────────┘
             │
┌────────────┴────────────────────────────┐
│         Middleware Layer                │
│  • Zod (Validation)                     │
│  • CORS (Security)                      │
│  • Error Handler (Error Management)     │
└────────────┬────────────────────────────┘
             │
┌────────────┴────────────────────────────┐
│         Database Layer                  │
│  • Drizzle ORM (Query Builder)          │
│  • PostgreSQL (Database)                │
│  • Neon (Cloud Hosting)                 │
└─────────────────────────────────────────┘
```

## Development Workflow

```
1. Write Code (TypeScript)
         ↓
2. Type Check (tsc)
         ↓
3. Build (tsc)
         ↓
4. Test (Playwright)
         ↓
5. Deploy
```

## Testing Strategy

```
┌──────────────────────────────────────────┐
│          E2E Tests (Playwright)          │
│                                          │
│  • Start test server                     │
│  • Make HTTP requests                    │
│  • Validate responses                    │
│  • Check database state                  │
│  • Test error scenarios                  │
└──────────────────────────────────────────┘
```

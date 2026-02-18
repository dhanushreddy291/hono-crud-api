# Hono CRUD API

A production-ready CRUD API built with [Hono](https://hono.dev/), TypeScript, PostgreSQL (Neon), and Drizzle ORM.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete todos
- ✅ **Input Validation** - Zod schema validation for all inputs
- ✅ **Error Handling** - Comprehensive error handling middleware
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **PostgreSQL** - Hosted on Neon with Drizzle ORM
- ✅ **E2E Tests** - Complete test suite with Playwright
- ✅ **Clean Architecture** - Well-structured codebase
- ✅ **Development Tools** - Hot reload, migrations, database studio

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Ultrafast web framework
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Testing**: Playwright
- **Runtime**: Node.js

## Project Structure

```
hono-crud-api/
├── src/
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts          # Database schema
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── routes/
│   │   └── todos.ts           # Todo routes
│   └── index.ts               # Application entry point
├── tests/
│   └── todos.spec.ts          # E2E tests
├── drizzle/                   # Database migrations
├── .env.example               # Environment variables example
├── drizzle.config.ts          # Drizzle configuration
├── package.json
├── playwright.config.ts       # Playwright configuration
└── tsconfig.json              # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon account)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/dhanushreddy291/hono-crud-api.git
cd hono-crud-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your database URL:

```env
DATABASE_URL=your_neon_postgresql_connection_string
PORT=3000
```

4. **Push database schema**

Generate and push the database schema to Neon:

```bash
npm run db:push
```

Alternatively, generate migrations:

```bash
npm run db:generate
npm run db:migrate
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

#### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

```http
GET /
```

**Response:**
```json
{
  "message": "Hono CRUD API is running!",
  "version": "1.0.0",
  "endpoints": {
    "todos": "/todos"
  }
}
```

#### 2. List All Todos

```http
GET /todos
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Todo",
    "description": "This is a sample todo",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 3. Get Single Todo

```http
GET /todos/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Sample Todo",
  "description": "This is a sample todo",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 4. Create Todo

```http
POST /todos
Content-Type: application/json

{
  "title": "New Todo",
  "description": "Optional description",
  "completed": false
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "New Todo",
  "description": "Optional description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 5. Update Todo

```http
PUT /todos/:id
Content-Type: application/json

{
  "title": "Updated Todo",
  "completed": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Todo",
  "description": "Optional description",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:01:00.000Z"
}
```

#### 6. Delete Todo

```http
DELETE /todos/:id
```

**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

## Validation Rules

### Create Todo
- `title`: Required, string (1-255 characters)
- `description`: Optional, string
- `completed`: Optional, boolean (default: false)

### Update Todo
- `title`: Optional, string (1-255 characters)
- `description`: Optional, string
- `completed`: Optional, boolean

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [...]
}
```

### 404 Not Found
```json
{
  "error": "Todo not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

## Testing

The project includes comprehensive E2E tests using Playwright.

### Run Tests

```bash
npm test
```

### Run Tests in UI Mode

```bash
npm run test:ui
```

### Test Coverage

The test suite covers:
- Full CRUD operations
- Input validation
- Error handling
- Edge cases (invalid IDs, missing fields, etc.)
- Complete workflow testing

## Database Schema

### Todos Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PRIMARY KEY |
| title | text | NOT NULL |
| description | text | nullable |
| completed | boolean | NOT NULL, DEFAULT false |
| createdAt | timestamp | NOT NULL, DEFAULT NOW() |
| updatedAt | timestamp | NOT NULL, DEFAULT NOW() |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run E2E tests |
| `npm run test:ui` | Run tests in UI mode |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## Development

### Database Management

**Drizzle Studio** - Visual database browser:
```bash
npm run db:studio
```

### Hot Reload

The development server uses `tsx watch` for automatic reloading on file changes.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the server:
```bash
npm start
```

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `PORT`: Server port (default: 3000)

## Best Practices

- ✅ Input validation on all endpoints
- ✅ Proper HTTP status codes
- ✅ Error handling middleware
- ✅ Type safety with TypeScript
- ✅ Database migrations
- ✅ Comprehensive testing
- ✅ Clean code structure
- ✅ Environment configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

ISC

## Author

Built with ❤️ using Hono and TypeScript

## Support

For issues and questions, please open an issue on GitHub.
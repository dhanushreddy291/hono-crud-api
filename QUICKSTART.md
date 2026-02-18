# Quick Start Guide

Get up and running with the Hono CRUD API in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (free tier available at https://neon.tech)

## Step 1: Clone and Install

```bash
git clone https://github.com/dhanushreddy291/hono-crud-api.git
cd hono-crud-api
npm install
```

## Step 2: Configure Database

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Neon database URL:
```env
DATABASE_URL=your_neon_postgresql_connection_string
PORT=3000
```

## Step 3: Setup Database Schema

Push the schema to your database:
```bash
npm run db:push
```

Or manually run the SQL from `setup.sql` in your Neon SQL editor.

## Step 4: Start Development Server

```bash
npm run dev
```

The API will be available at http://localhost:3000

## Step 5: Test the API

### Option 1: Using cURL

```bash
# Health check
curl http://localhost:3000/

# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My first todo", "description": "Testing the API"}'

# Get all todos
curl http://localhost:3000/todos
```

### Option 2: Using the HTTP file

Open `requests.http` in VS Code with the REST Client extension and click "Send Request" on any request.

### Option 3: Run E2E Tests

```bash
npm test
```

## What's Next?

- 📖 Read the full [README](README.md) for detailed documentation
- 🔌 Check [API.md](API.md) for complete API reference
- 🧪 Explore the test suite in `tests/todos.spec.ts`
- 🎨 Use Drizzle Studio to view your database: `npm run db:studio`

## Common Issues

### Database Connection Error

If you see `ENOTFOUND` or connection errors:
1. Check your DATABASE_URL in `.env`
2. Ensure your Neon database is active
3. Verify network connectivity

### Port Already in Use

If port 3000 is busy:
1. Change PORT in `.env` to another port (e.g., 3001)
2. Or stop the process using port 3000

### Build Errors

If TypeScript errors occur:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run build` to check for errors

## Need Help?

- Check the [README](README.md) for detailed setup instructions
- Review [API.md](API.md) for API documentation
- Open an issue on GitHub for bugs or questions

Enjoy building with Hono! 🚀

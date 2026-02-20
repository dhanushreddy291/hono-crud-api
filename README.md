# Hono CRUD API

A production-ready CRUD API built with [Hono](https://hono.dev/), TypeScript, PostgreSQL (Neon), and Drizzle ORM.

> **Note:** This repository serves as a working example for the [Automate branching with CircleCI: Example CircleCI configuration](https://neon.com/docs/guides/branching-circleci#example-circleci-configuration) guide. It demonstrates how to use the Neon CircleCI Orb to provision ephemeral Postgres branches for every CI pipeline run.

## Features

- ✅ Full CRUD Operations with Zod validation
- ✅ TypeScript + Drizzle ORM
- ✅ PostgreSQL (Neon)
- ✅ E2E Tests with Playwright
- ✅ CircleCI with Neon Orb (branch per PR)

## Tech Stack

- **Framework**: [Hono](https://hono.dev/)
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Testing**: Playwright
- **CI/CD**: CircleCI + [Neon Orb](https://circleci.com/developer/orbs/orb/dhanushreddy291/neon)

## CircleCI Integration with Neon

This project uses CircleCI with the Neon CircleCI Orb to provision fresh, isolated Postgres databases for every pull request.

**How it works:**
1. Branch created per PR → fresh isolated database
2. Migrations run → `npm run db:migrate`
3. E2E tests execute → against isolated database
4. Branch deleted → automatic cleanup

**Environment variables in CircleCI:**
- `NEON_API_KEY`: Your Neon API key
- `NEON_PROJECT_ID`: Your Neon project ID

**Pipeline triggers:** PR opened/pushed to, default branch and tag pushes

## Quick Start

```bash
git clone https://github.com/dhanushreddy291/hono-crud-api.git
cd hono-crud-api
npm install
cp .env.example .env
# Update DATABASE_URL in .env
npm run db:push
npm run dev
```

## API Endpoints

Base URL: `http://localhost:3000`

- `GET /` - Health check
- `GET /todos` - List all todos
- `GET /todos/:id` - Get single todo
- `POST /todos` - Create todo (`{title, description?, completed?}`)
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Testing

**Local:**
```bash
npm test
npm run test:ui
```

**CI with Neon branches:** Tests run automatically against ephemeral database branches in CircleCI.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run E2E tests |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## Database Schema

**Todos Table:**
- `id` (serial, PRIMARY KEY)
- `title` (text, NOT NULL)
- `description` (text, nullable)
- `completed` (boolean, DEFAULT false)
- `createdAt` (timestamp, DEFAULT NOW())
- `updatedAt` (timestamp, DEFAULT NOW())

## CircleCI Orb

Uses [Neon CircleCI Orb](https://circleci.com/developer/orbs/orb/dhanushreddy291/neon) to automate database branching in CI.

**Orb Commands:**
- `neon/run_tests` - Create branch → run tests → delete branch
- `neon/create_branch` - Create branch
- `neon/delete_branch` - Delete branch
- `neon/reset_branch` - Reset branch to parent state

## Project Structure

```
hono-crud-api/
├── .circleci/config.yml        # CircleCI + Neon Orb
├── src/
│   ├── db/                     # Database connection & schema
│   ├── routes/todos.ts         # Todo routes
│   └── index.ts                # App entry
├── tests/todos.spec.ts         # E2E tests
└── drizzle/                    # Migrations
```

# Contributing to Hono CRUD API

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/hono-crud-api.git
   cd hono-crud-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup Database**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── db/              # Database configuration and schema
├── middleware/      # Custom middleware functions
├── routes/          # API route handlers
└── index.ts         # Application entry point

tests/               # E2E tests
```

## Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run build    # Check for TypeScript errors
   npm test         # Run E2E tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Keep functions small and focused
- Add types for all parameters and return values

### Adding New Features

1. **API Endpoints**
   - Add new routes in `src/routes/`
   - Include input validation using Zod
   - Handle errors appropriately
   - Return proper HTTP status codes

2. **Database Changes**
   - Update schema in `src/db/schema.ts`
   - Generate migration: `npm run db:generate`
   - Test migration: `npm run db:push`

3. **Tests**
   - Add tests for new features in `tests/`
   - Test happy paths and error cases
   - Ensure all tests pass before submitting

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/todos.spec.ts
```

### Writing Tests

- Use Playwright's request API for API testing
- Test both success and error scenarios
- Verify response status codes and data
- Clean up test data after tests

Example:
```typescript
test('should create a todo', async ({ request }) => {
  const response = await request.post('/todos', {
    data: { title: 'Test Todo' }
  });
  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data).toHaveProperty('id');
});
```

## Database Management

### Drizzle ORM Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema directly to database (dev)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Schema Changes

1. Modify `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `drizzle/` folder
4. Apply migration: `npm run db:push`

## Pull Request Process

1. **Update documentation**
   - Update README.md if needed
   - Update API.md for API changes
   - Add comments for complex code

2. **Ensure code quality**
   - All tests pass
   - No TypeScript errors
   - Code follows project style

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Describe what changes were made and why
   - Reference any related issues
   - Include screenshots for UI changes

4. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Keep PR focused and small

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add user authentication`
- `fix: Correct todo update validation`
- `docs: Update API documentation`
- `test: Add tests for delete endpoint`
- `refactor: Simplify error handling`

## Issues and Bug Reports

### Reporting Bugs

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node version, OS, etc.)

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)

## Questions?

- Check existing issues and documentation
- Open a new issue for questions
- Join discussions in pull requests

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

Thank you for contributing! 🎉

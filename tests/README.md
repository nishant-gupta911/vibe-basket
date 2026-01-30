# Test Suite Documentation

## Overview
Comprehensive testing infrastructure covering unit tests, integration tests, frontend logic tests, and end-to-end user flows.

# Test Suite Documentation

## Overview
Comprehensive testing infrastructure covering unit tests, integration tests, frontend logic tests, and end-to-end user flows.

## Test Structure
```
tests/
├── unit/                 # Unit tests for business logic (run from backend/)
│   ├── mood-finder.test.ts       # Mood profile matching logic
│   └── product-filter.test.ts    # Product filtering and ranking
├── integration/          # API endpoint integration tests (run from backend/)
│   ├── auth.test.ts              # Authentication endpoints
│   ├── products.test.ts          # Product API endpoints
│   └── ai.test.ts                # AI chatbot & mood finder endpoints
├── e2e/                  # End-to-end user flows (run from root)
│   └── user-flows.spec.ts        # Complete user journeys
└── setup.ts              # Test database setup & cleanup

frontend/tests/           # Frontend tests (run from frontend/)
└── utils.test.ts         # Frontend utility functions
```

## Running Tests

### All Tests
```bash
npm run test:all        # Run all tests including e2e
npm test                # Run unit, integration, and frontend tests
```

### Specific Test Types
```bash
npm run test:unit           # Run backend unit tests
npm run test:integration    # Run API integration tests
npm run test:frontend       # Run frontend logic tests
npm run test:e2e            # Run e2e user flow tests with Playwright
```

### Individual Test Files
```bash
# Backend tests
cd backend && npm test -- mood-finder.test.ts
cd backend && npm test -- --testPathPattern=integration

# Frontend tests
cd frontend && npm test -- auth.test.tsx

# E2E tests
npx playwright test user-flows.spec.ts
```

### Watch Mode
```bash
cd backend && npm run test:watch
cd frontend && npm run test:watch
```

### Coverage Reports
```bash
cd backend && npm run test:cov
cd frontend && npm run test:cov
```

## Test Coverage

### Unit Tests (2 files, 23 tests) ✅
- **mood-finder.test.ts**: Mood profile matching, budget strategies, tag system, product recommendations
- **product-filter.test.ts**: Product filtering by budget/category/stock, ranking algorithms

### Integration Tests (3 files, ~45 tests)
- **auth.test.ts**: Register, login, profile endpoints, token validation, error handling
- **products.test.ts**: Product listing, search, filters, pagination, stock management
- **ai.test.ts**: Chatbot interactions (greetings, search, budget advice), mood finder recommendations

### Frontend Tests (1 file, 4 tests) ✅
- **utils.test.ts**: Utility functions (classNames merger, token manager)

### E2E Tests (1 file, 12 tests)
- **user-flows.spec.ts**: Browse products, filter/search, register/login, cart operations, mood finder, chatbot, complete purchase journey

## Prerequisites

### Database Setup
Integration tests require a seeded database. Make sure to run:
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### Environment Variables
Ensure `.env` files are configured in both backend and frontend directories.

### Install Dependencies
```bash
npm run install:all
```

## Test Characteristics

### Deterministic
- No flaky timing dependencies
- All async operations use proper awaits
- Mock external services (no real API calls)
- Consistent test data

### Maintainable
- Clear test names describing what's being tested
- Grouped related tests with describe blocks
- Proper setup/teardown with beforeEach/afterEach
- Comments explaining complex test logic

### Fast
- Unit tests: ~2-3 seconds
- Integration tests: ~15-20 seconds (database operations)
- Frontend tests: ~3-5 seconds
- E2E tests: ~30-45 seconds (browser automation)

## Known Limitations

1. **E2E Tests**: Require frontend server running on port 3000 (auto-started by Playwright config)
2. **Integration Tests**: Use real database, so require proper cleanup between test runs
3. **AI Tests**: Test rule-based logic only, not external OpenAI API integration
4. **Payment Tests**: Payment processing is stubbed (no real Stripe integration)

## Debugging Tests

### Run with Verbose Output
```bash
cd backend && npm test -- --verbose
```

### Run Single Test
```bash
cd backend && npm test -- -t "should match happy mood profile"
```

### Debug E2E Tests
```bash
npx playwright test --debug
npx playwright test --headed  # Run in visible browser
```

### View E2E Test Report
```bash
npx playwright show-report
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:
```bash
npm run install:all
npm run test:all
```

Expected exit code 0 if all tests pass.

## Adding New Tests

### Unit Tests
- Create `.test.ts` files in `/tests/unit/`
- Import the function/module to test
- Use mock data, no external dependencies
- Focus on business logic

### Integration Tests
- Create `.test.ts` files in `/tests/integration/`
- Use `Test.createTestingModule()` for NestJS
- Use Supertest for HTTP requests
- Clean up database in beforeEach/afterEach

### Frontend Tests
- Create `.test.tsx` files in `/tests/frontend/`
- Use `@testing-library/react` for component testing
- Mock external dependencies (fetch, router)
- Test hooks and state management

### E2E Tests
- Create `.spec.ts` files in `/tests/e2e/`
- Use Playwright API
- Test complete user journeys
- Simulate real user interactions

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)

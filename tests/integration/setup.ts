import { PrismaClient } from '@prisma/client';

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const isSQLite = process.env.TEST_DB_PROVIDER === 'sqlite' ||
  (process.env.DATABASE_URL || '').startsWith('file:');

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();

  if (isSQLite) {
    console.log('[test-setup] Running in SQLite fallback mode');
  }
});

afterAll(async () => {
  // Only disconnect — full DB cleanup is handled by the test-integration.sh
  // script via `prisma db push --force-reset` before each run.  Truncating here
  // would destroy shared test data that other suites depend on.
  await prisma.$disconnect();
});

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/devops/docker/docker-compose.yml"
BACKEND_DIR="$ROOT_DIR/backend"
SQLITE_DB="$BACKEND_DIR/prisma/test.db"

export NODE_ENV=test

# ── helpers ──────────────────────────────────────────────────────────
has_docker() {
  command -v docker >/dev/null 2>&1
}

docker_pg_ready() {
  has_docker && docker exec ecommerce_postgres pg_isready -U postgres >/dev/null 2>&1
}

local_db_ready() {
  if command -v pg_isready >/dev/null 2>&1; then
    pg_isready -h localhost -p 5432 >/dev/null 2>&1
    return $?
  fi
  if command -v nc >/dev/null 2>&1; then
    nc -z localhost 5432 >/dev/null 2>&1
    return $?
  fi
  return 1
}

# ── postgres setup & run ─────────────────────────────────────────────
run_pg_tests() {
  # Prefer explicit test URL → env var from .env → sensible local default
  if [ -z "${DATABASE_URL_TEST:-}" ]; then
    # Read the normal DATABASE_URL from backend/.env and derive a test DB URL
    if [ -f "$BACKEND_DIR/.env" ]; then
      _base_url=$(grep '^DATABASE_URL=' "$BACKEND_DIR/.env" | head -1 | sed 's/^DATABASE_URL=//' | tr -d '"')
      if [ -n "$_base_url" ]; then
        # Replace the database name with vibebasket_test
        DATABASE_URL_TEST=$(echo "$_base_url" | sed 's|/[^/?]*\?|/vibebasket_test?|')
      fi
    fi
    # Final fallback
    DATABASE_URL_TEST="${DATABASE_URL_TEST:-postgresql://$(whoami)@localhost:5432/vibebasket_test?schema=public}"
  fi

  export TEST_DATABASE_URL="$DATABASE_URL_TEST"
  export DATABASE_URL="$TEST_DATABASE_URL"

  # Ensure test database exists
  _pg_base=$(echo "$DATABASE_URL_TEST" | sed 's|/vibebasket_test.*|/postgres|')
  echo "  Ensuring vibebasket_test database exists …"
  psql "$_pg_base" -tc "SELECT 1 FROM pg_database WHERE datname='vibebasket_test'" 2>/dev/null | grep -q 1 \
    || psql "$_pg_base" -c "CREATE DATABASE vibebasket_test" 2>/dev/null \
    || echo "  (could not auto-create DB — assuming it exists)"

  pushd "$BACKEND_DIR" >/dev/null
  npm run prisma:generate
  npx prisma db push --skip-generate --accept-data-loss --force-reset
  npx ts-node prisma/seed.test.ts
  popd >/dev/null

  npm run test:integration:run
}

# ── sqlite fallback setup & run ──────────────────────────────────────
run_sqlite_tests() {
  echo "════════════════════════════════════════════════════════════"
  echo "  FALLBACK: Running integration tests against SQLite"
  echo "  (Some PostgreSQL-specific tests may fail — that is expected)"
  echo "════════════════════════════════════════════════════════════"

  export DATABASE_URL="file:${SQLITE_DB}"
  export TEST_DB_PROVIDER=sqlite

  # Clean previous test DB
  rm -f "$SQLITE_DB" "$SQLITE_DB-journal"

  pushd "$BACKEND_DIR" >/dev/null
  # Generate client from SQLite-compatible schema and push tables
  npx prisma generate --schema=prisma/schema.sqlite.prisma
  npx prisma db push --schema=prisma/schema.sqlite.prisma --skip-generate --accept-data-loss --force-reset
  npx ts-node prisma/seed.test.sqlite.ts
  popd >/dev/null

  # Run tests — allow non-zero exit so the script always reports
  set +e
  npm run test:integration:run
  TEST_EXIT=$?
  set -e

  # Clean up
  rm -f "$SQLITE_DB" "$SQLITE_DB-journal"

  if [ "$TEST_EXIT" -ne 0 ]; then
    echo ""
    echo "[sqlite-fallback] Some tests failed (exit $TEST_EXIT)."
    echo "[sqlite-fallback] This is expected for features requiring PostgreSQL arrays."
    # Still exit with the test status so CI sees a non-zero code
    exit "$TEST_EXIT"
  fi
}

# ── main flow ────────────────────────────────────────────────────────
if has_docker; then
  echo "▶ Attempting integration tests with Docker Postgres …"
  docker compose -f "$COMPOSE_FILE" up -d postgres 2>/dev/null || true
  trap 'docker compose -f "$COMPOSE_FILE" stop postgres >/dev/null 2>&1' EXIT

  echo "  Waiting for postgres …"
  for i in $(seq 1 30); do
    if docker_pg_ready; then break; fi
    sleep 1
  done

  if docker_pg_ready; then
    docker exec ecommerce_postgres psql -U postgres -tc \
      "SELECT 1 FROM pg_database WHERE datname='vibebasket_test'" \
      | grep -q 1 \
      || docker exec ecommerce_postgres createdb -U postgres vibebasket_test
    run_pg_tests
    exit 0
  fi
  echo "  Docker Postgres did not become ready — trying next option …"
fi

if local_db_ready; then
  echo "▶ Running integration tests with local Postgres …"
  run_pg_tests
  exit 0
fi

echo "▶ No PostgreSQL available — falling back to SQLite …"
run_sqlite_tests

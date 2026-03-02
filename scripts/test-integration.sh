#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/devops/docker/docker-compose.yml"

export TEST_DATABASE_URL="${DATABASE_URL_TEST:-postgresql://postgres:postgres@localhost:5432/vibebasket_test?schema=public}"
export DATABASE_URL="$TEST_DATABASE_URL"
export NODE_ENV=test

has_docker() {
  command -v docker >/dev/null 2>&1
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

run_setup_and_tests() {
  pushd "$ROOT_DIR/backend" >/dev/null
  npm run prisma:generate
  npx prisma migrate deploy
  npx ts-node prisma/seed.test.ts
  popd >/dev/null

  npm run test:integration:run
}

if has_docker; then
  echo "Running integration tests with Docker"
  docker compose -f "$COMPOSE_FILE" up -d postgres
  trap 'docker compose -f "$COMPOSE_FILE" stop postgres >/dev/null 2>&1' EXIT

  echo "Waiting for postgres..."
  for i in {1..30}; do
    if docker exec ecommerce_postgres pg_isready -U postgres >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  if ! docker exec ecommerce_postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo "Postgres did not become ready" >&2
    exit 1
  fi

  docker exec ecommerce_postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='vibebasket_test'" | grep -q 1 || \
    docker exec ecommerce_postgres createdb -U postgres vibebasket_test

  run_setup_and_tests
  exit 0
fi

if local_db_ready; then
  echo "Running integration tests with local DB"
  run_setup_and_tests
  exit 0
fi

echo "Skipping integration tests (no DB available)"
exit 0

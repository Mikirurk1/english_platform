#!/usr/bin/env bash
# Playwright webServer: start turbo dev and block until API + web respond.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API="${API_PROXY_TARGET:-http://127.0.0.1:3000}"
API="${API%/}"
WEB="${PLAYWRIGHT_BASE_URL:-http://localhost:4200}"
WEB="${WEB%/}"
EMAIL="${PLAYWRIGHT_TEST_EMAIL:-jest-student@soenglish.test}"
PASSWORD="${PLAYWRIGHT_TEST_PASSWORD:-TestPass123!}"

npm run dev &
DEV_PID=$!
trap 'kill "$DEV_PID" 2>/dev/null || true; wait "$DEV_PID" 2>/dev/null || true' EXIT INT TERM

deadline=$((SECONDS + 180))
until curl -sf "$API/api" >/dev/null 2>&1 && curl -sf -o /dev/null -w '' "$WEB" >/dev/null 2>&1; do
  if (( SECONDS >= deadline )); then
    echo "E2E: timed out waiting for API ($API/api) and web ($WEB)" >&2
    exit 1
  fi
  sleep 2
done

echo "E2E: API and web responded"

login_deadline=$((SECONDS + 60))
payload=$(printf '{"email":"%s","password":"%s"}' "$EMAIL" "$PASSWORD")
until [ "$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d "$payload")" = "201" ]; do
  if (( SECONDS >= login_deadline )); then
    echo "E2E: timed out waiting for seeded login ($EMAIL)" >&2
    exit 1
  fi
  sleep 2
done

echo "E2E: seeded login OK"
wait "$DEV_PID"

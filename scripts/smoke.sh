#!/usr/bin/env bash
set -euo pipefail
API="${1:-http://localhost:3000}"
echo "Health:"; curl -fsS "$API/api/health" | jq .
echo "List (before):"; curl -fsS "$API/api/books" | jq .
NEW=$(curl -fsS -H "Content-Type: application/json" -d '{"title":"Refactoring","author":"Martin Fowler","year":1999}' "$API/api/books")
echo "Created:"; echo "$NEW" | jq .
ID=$(echo "$NEW" | jq -r .id)
echo "Get one:"; curl -fsS "$API/api/books/$ID" | jq .
echo "Patch:"; curl -fsS -X PATCH -H "Content-Type: application/json" -d '{"year":2018}' "$API/api/books/$ID" | jq .
echo "Delete:"; curl -fsS -X DELETE "$API/api/books/$ID" | jq .
echo "List (after):"; curl -fsS "$API/api/books" | jq .
echo "OK"

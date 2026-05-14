#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SQL_FILE="$ROOT_DIR/db/001_create_submissions.sql"
if [ ! -f "$SQL_FILE" ]; then echo "SQL file not found: $SQL_FILE"; exit 1; fi
if [ -z "${SUPABASE_DB_URL:-}" ]; then echo "Please set SUPABASE_DB_URL environment variable (Postgres connection string)"; exit 1; fi
echo "Running migration against $SUPABASE_DB_URL"
psql "$SUPABASE_DB_URL" -f "$SQL_FILE"
echo "Migration complete"

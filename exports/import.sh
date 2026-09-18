#!/usr/bin/env bash
# Prominence — Import preview data into a target MongoDB.
#
# Usage:
#   MONGO_URL="mongodb://user:pass@host:27017" DB_NAME="prominence_prod" ./import.sh
# Or set them inline:
#   ./import.sh "mongodb://user:pass@host:27017" "prominence_prod"
#
# Modes:
#   By default, this uses --drop on the target collections, so existing
#   data with the same names will be REPLACED. Remove --drop below if you
#   want to merge instead.
set -euo pipefail

MONGO_URL="${1:-${MONGO_URL:-}}"
DB_NAME="${2:-${DB_NAME:-}}"

if [[ -z "$MONGO_URL" || -z "$DB_NAME" ]]; then
  echo "Usage: MONGO_URL=... DB_NAME=... $0"
  echo "   or: $0 <mongo_url> <db_name>"
  exit 1
fi

DIR="$(cd "$(dirname "$0")" && pwd)"
DUMP_DIR="$DIR/dump/test_database"

if [[ ! -d "$DUMP_DIR" ]]; then
  echo "Expected BSON dump at: $DUMP_DIR"
  exit 1
fi

echo "Restoring into:"
echo "  uri: $MONGO_URL"
echo "  db : $DB_NAME"
echo

mongorestore \
  --uri="$MONGO_URL" \
  --nsFrom="test_database.*" \
  --nsTo="${DB_NAME}.*" \
  --drop \
  "$DUMP_DIR/.."

echo
echo "Import complete. Verify:"
echo "  mongosh \"$MONGO_URL\" --eval 'use $DB_NAME; db.users.countDocuments(); db.insights.countDocuments(); db.faqs.countDocuments();'"

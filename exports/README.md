# Prominence — Preview Data Export

Snapshot of the preview MongoDB taken on **2026-06-25**.

## Contents

| File / Folder | Purpose |
|---|---|
| `dump/test_database/*.bson` | Full lossless mongodump (recommended for import) |
| `json/*.json` | Human-readable JSON exports (mongoexport, jsonArray) |
| `import.sh` | One-command restore into your production MongoDB |

## What's inside

| Collection | Docs |
|---|---|
| `users` | 1 (admin: `admin@prominence.id`, bcrypt-hashed) |
| `insights` | 1 (the starter "Why Indonesia needs sovereign cloud now" article, EN+ID) |
| `faqs` | 4 (bilingual FAQ items) |
| `contact_inquiries` | 3 (test inquiries — feel free to delete after import) |
| `newsletter_subs` | 4 (test subscribers — feel free to delete after import) |
| `login_attempts` | brute-force rate-limit records (safe to ignore/skip) |

> The `status_checks` collection is empty; not exported.

## How to import into production

### Option A — Use the helper script (recommended)

```bash
cd exports
chmod +x import.sh
./import.sh "mongodb://user:pass@host:27017" "<your_prod_db_name>"
```

The script remaps the source DB (`test_database`) to your production DB name and uses `--drop` to replace matching collections cleanly.

### Option B — Use `mongorestore` manually

```bash
mongorestore \
  --uri="<PROD_MONGO_URL>" \
  --nsFrom="test_database.*" \
  --nsTo="<PROD_DB_NAME>.*" \
  --drop \
  exports/dump/
```

### Option C — Import individual collections from JSON

```bash
mongoimport \
  --uri="<PROD_MONGO_URL>" \
  --db "<PROD_DB_NAME>" \
  --collection users \
  --jsonArray \
  --file exports/json/users.json
```
Repeat for `insights`, `faqs`, etc.

## After import — important next steps

1. **Rotate the admin password**: the exported `users` document contains a bcrypt hash of the preview password. In production set fresh `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars; the backend's startup hook will overwrite the password hash on the next boot.
2. **Rotate `JWT_SECRET`**: do not reuse the preview secret in production.
3. **Clean up test data** (optional):
   ```bash
   mongosh "<PROD_MONGO_URL>" --eval 'use <PROD_DB>; db.contact_inquiries.deleteMany({email: /test/}); db.newsletter_subs.deleteMany({email: /test/});'
   ```
4. **Confirm indexes were rebuilt** (mongodump captures index metadata in `*.metadata.json`):
   ```bash
   mongosh "<PROD_MONGO_URL>" --eval 'use <PROD_DB>; db.users.getIndexes(); db.insights.getIndexes();'
   ```
   You should see unique indexes on `users.email`, `insights.slug`, `newsletter_subs.email`.

## Re-export (if you keep editing in preview before going live)

From `/app`:
```bash
DB="$(grep ^DB_NAME backend/.env | cut -d'"' -f2)"
URL="$(grep ^MONGO_URL backend/.env | cut -d'"' -f2)"
mongodump --uri="$URL" --db="$DB" --out=exports/dump/
for c in users insights faqs contact_inquiries newsletter_subs; do
  mongoexport --uri="$URL" --db="$DB" --collection="$c" --out="exports/json/${c}.json" --jsonArray
done
```

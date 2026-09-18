# Arsip ekspor MongoDB

Snapshot preview lama (2026-06-25), bukan backup production terkini.
`json/` berisi mongoexport JSON array; `dump/` menyimpan arsip BSON asli.
Backend sekarang menggunakan MySQL.

Dari direktori `backend/`, setelah konfigurasi `.env` dan `python migrate.py`:

```bash
python import_mongo_json.py ../exports/json --dry-run
python import_mongo_json.py ../exports/json
```

Tambahkan `--include-users` hanya untuk memindahkan akun/hash bcrypt lama.
Data uji preview ikut diimpor; gunakan ekspor terbaru untuk cutover production.
Impor tidak menimpa ID yang ada dan rollback seluruh transaksi jika email/slug
bentrok dengan ID berbeda. Lockout login sementara tidak dipindahkan.

`import.sh` hanya helper pemulihan arsip ke MongoDB lama; bukan importer MySQL.
Lihat [panduan migrasi](../DEPLOYMENT.md) untuk urutan cutover dan rotasi kredensial.

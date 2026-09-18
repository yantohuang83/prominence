# Deployment Prominence — MySQL

Backend tetap FastAPI; seluruh data aplikasi disimpan di MySQL 8.0+ menggunakan
SQLAlchemy async + aiomysql. Frontend React dan endpoint `/api` tetap kompatibel.
Gunakan Python 3.11+ dan MySQL dengan InnoDB/utf8mb4.

## 1. Siapkan MySQL

Contoh Ubuntu 22.04/24.04 (jalankan sebagai administrator):

```bash
sudo apt update
sudo apt install mysql-server python3-venv python3-pip nginx
sudo systemctl enable --now mysql
sudo mysql
```

Jalankan SQL berikut, ganti password contoh:

```sql
CREATE DATABASE prominence CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'prominence'@'127.0.0.1' IDENTIFIED BY 'GANTI_PASSWORD_KUAT';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER
  ON prominence.* TO 'prominence'@'127.0.0.1';
```

Bind database ke localhost; tidak perlu membuka port 3306 ke internet.
Hak CREATE/INDEX/ALTER diperlukan saat migrasi. Untuk operasional, Anda dapat
memisahkan akun migrasi dari akun aplikasi yang hanya membutuhkan DML.

## 2. Instal backend

Letakkan repository di `/opt/prominence` milik user layanan `prominence`.
Buat user tersebut bila belum ada: `sudo adduser --disabled-password --gecos "" prominence`.

```bash
cd /opt/prominence/backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements-production.txt
cp .env.example .env
python -c 'import secrets; print(secrets.token_hex(48))'
```

Edit `.env`:

```dotenv
DATABASE_URL=mysql+aiomysql://prominence:GANTI_PASSWORD_KUAT@127.0.0.1:3306/prominence?charset=utf8mb4
JWT_SECRET=HASIL_GENERATOR_SECRET
ADMIN_EMAIL=admin@prominence.id
ADMIN_PASSWORD=PASSWORD_ADMIN_BARU
CORS_ORIGINS=https://prominence.id,https://www.prominence.id
```

Percent-encode karakter khusus password dalam DATABASE_URL (`@` menjadi `%40`,
`#` menjadi `%23`, dan seterusnya). `MONGO_URL` dan `DB_NAME` tidak digunakan lagi.
Lindungi `.env` dengan `chmod 600 .env`; jangan commit file ini.

```bash
python migrate.py
uvicorn server:app --host 127.0.0.1 --port 8001
```

Migrasi membuat tujuh tabel aplikasi dan `schema_migrations`. Jalankan sebelum
API dimulai, satu kali per deployment. Versi awal idempotent dan dapat dilanjutkan
jika terputus. Migrasi berikutnya harus ditambahkan sebagai langkah versi baru di
`migrate.py`; `create_all` bukan mekanisme alter tabel yang sudah ada.
Startup API tidak menjalankan DDL.

Admin baru memerlukan ADMIN_PASSWORD. Untuk admin yang sudah ada, variabel ini
mengganti password saat startup bila nilainya berbeda. Hapus variabel tersebut
sesudah rotasi jika ingin mempertahankan hash yang sudah tersimpan.
Cookie autentikasi tetap Secure: gunakan HTTPS di production; pada HTTP lokal,
frontend dapat memakai header `X-Access-Token` sebagai Bearer token seperti sebelumnya.

## 3. Pindahkan data MongoDB (opsional)

Hentikan penulisan ke backend lama selama ekspor/cutover. Simpan backup MongoDB.
Ekspor tiap koleksi sebagai JSON array menggunakan `mongoexport --jsonArray`:
`users`, `insights`, `faqs`, `contact_inquiries`, `newsletter_subs`, `status_checks`.
Gunakan snapshot terkini untuk production; `exports/json` di repository adalah
snapshot preview lama yang mengandung data uji.

```bash
cd /opt/prominence/backend
python import_mongo_json.py ../exports/json --dry-run
python import_mongo_json.py ../exports/json
# Hanya jika ingin memindahkan akun beserta hash bcrypt:
python import_mongo_json.py ../exports/json --include-users
```

Impor mempertahankan ID, slug, waktu UTC, konten bilingual dan hash password.
`_id` Mongo diabaikan. Baris dengan ID yang sama dilewati tanpa ditimpa.
Bentrok email/slug dengan ID berbeda menggagalkan seluruh transaksi impor.
Tidak ada penghapusan tabel atau data. Semua file terpilih divalidasi sebelum
penulisan; `--dry-run` hanya memvalidasi file dan tidak mendeteksi konflik di DB.
`login_attempts` tidak dipindahkan: lockout sementara dimulai ulang.
Impor pengguna sebelum startup pertama jika ingin mempertahankan ID admin lama.
Ganti JWT_SECRET dan password admin setelah memindahkan akun preview.

Verifikasi jumlah dan isi data sebelum mengalihkan trafik. Jika rollback diperlukan,
gunakan deployment lama dengan backup MongoDB; penulisan baru ke MySQL tidak
otomatis disalin kembali ke MongoDB.

## 4. systemd

```bash
sudo cp deploy/prominence-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now prominence-backend
curl http://127.0.0.1:8001/api/health
```

Jalankan perintah copy dari root repository. Health endpoint memeriksa koneksi
MySQL dan mengembalikan HTTP 503 bila database tidak tersedia.

## 5 · Frontend — build production static

```bash
sudo -u prominence -i
cd /opt/prominence/frontend

# .env untuk build — domain produksi Anda
cat > .env <<'EOF'
REACT_APP_BACKEND_URL=https://prominence.id
WDS_SOCKET_PORT=443
EOF

yarn install --frozen-lockfile
yarn build
exit
```

Output build ada di `/opt/prominence/frontend/build/`.

> **Penting**: setiap kali Anda mengubah `REACT_APP_BACKEND_URL`, frontend harus di-build ulang (`yarn build`). Variabel React di-inline saat build, bukan saat runtime.

---

## 6. Nginx dan HTTPS

Dari root repository, pasang konfigurasi HTTP terlebih dahulu agar penerbitan
sertifikat tidak terhambat konfigurasi SSL yang belum memiliki sertifikat:

```bash
sudo cp deploy/nginx-prominence-http.conf /etc/nginx/sites-available/prominence
sudo ln -sf /etc/nginx/sites-available/prominence /etc/nginx/sites-enabled/prominence
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d prominence.id -d www.prominence.id --redirect
```

Sesuaikan `server_name` dengan domain Anda. Untuk VPS dengan banyak site,
sesuaikan `default_server` dan jangan menonaktifkan konfigurasi site lain.
Arahkan DNS domain ke VPS dan buka port 80/443 sebelum menjalankan Certbot.
Certbot memasang sertifikat dan redirect HTTPS setelah verifikasi berhasil.

## Backup dan pengujian

```bash
mysqldump --single-transaction --no-tablespaces -h 127.0.0.1 -u prominence -p prominence > prominence.sql
```

Gunakan database pengujian terpisah (jangan database production):

```bash
cd backend
pip install -r requirements-test.txt
export TEST_DATABASE_URL='mysql+aiomysql://USER:PASSWORD@127.0.0.1:3306/prominence_test'
python -m pytest tests/test_mysql.py -q
```

Suite ini menggunakan MySQL asli, membuat skema, dan menulis data uji.
Jalankan pada database kosong untuk hasil terisolasi; data uji tidak semuanya dihapus.
Tanpa TEST_DATABASE_URL, suite akan di-skip. Test HTTP lama `backend_test.py`
memerlukan server aktif dan konfigurasi `REACT_APP_BACKEND_URL`, `ADMIN_EMAIL`,
`ADMIN_PASSWORD` pada environment.

# Hasil rewrite MySQL

Basis repository: `69440fcc3068c959abea62848d1cea6f65604f73`.
Perubahan dikembangkan pada branch `backend-mysql`.

## Perubahan

- Motor/MongoDB diganti dengan SQLAlchemy async + aiomysql.
- Tujuh tabel aplikasi dengan primary key, indeks unik email/slug, utf8mb4,
  timestamp UTC dengan presisi mikrodetik, dan kolom JSON untuk konten bilingual.
- Endpoint publik/admin, JWT dan bentuk respons frontend dipertahankan.
- Newsletter berulang mengembalikan ID tersimpan; transaksi menangani permintaan paralel.
- Percobaan login diperbarui atomik menggunakan row lock MySQL.
- Konflik slug pada pembuatan paralel dicoba ulang; konflik update menghasilkan 409.
- Health endpoint memeriksa koneksi database dan menghasilkan 503 jika gagal.
- Migrasi skema eksplisit, template environment, importer JSON MongoDB, systemd,
  dan panduan deployment sudah disesuaikan.
- Model validasi dipisahkan ke `backend/models.py` agar importer tidak perlu
  menginisialisasi aplikasi atau koneksi database saat dry-run.

## Verifikasi

Diuji dengan Python 3.12 dan **MySQL Community Server 8.0.30 asli**, di instance
sementara pada loopback port 13316 dengan database pengujian terpisah.

`python -m pytest backend/tests/test_mysql.py -q`: **14 passed**.

Cakupan: migrasi berulang, status/timestamp Unicode, login/me/refresh/logout,
kontak dan statistik unread, update idempotent, respons 404, newsletter paralel,
CRUD insight dan slug paralel, draft/publish, FAQ bilingual dan sorting,
validasi limit, lockout login dan expiry, increment paralel, health 503,
validasi impor, impor berulang, dan rollback transaksi saat bentrok email.

Dry-run snapshot repository termasuk users berhasil: 3 kontak, 4 newsletter,
1 insight, 4 FAQ, 0 status checks, 1 user. Importer default tidak memindahkan users;
gunakan `--include-users` bila diperlukan. `pip check` lulus.

Dua warning deprecation berasal dari dependency Starlette (python_multipart dan
alias AnyIO BlockingPortal); tidak ada kegagalan pengujian.

Pengujian tidak mencakup deployment VPS, MySQL production atau browser frontend.
Database production belum dipindahkan. Snapshot repo adalah data preview lama.
Ikuti `DEPLOYMENT.md` untuk backup, ekspor terbaru, cutover dan konfigurasi secret.

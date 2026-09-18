# Production deployment

Ikuti [DEPLOYMENT.md](../DEPLOYMENT.md) untuk MySQL, migrasi dan konfigurasi.
Instal `backend/requirements-production.txt`, isi `DATABASE_URL`, lalu jalankan
`python migrate.py` sebelum menyalakan service. Service bergantung pada `mysql.service`.

Jika Nginx mengembalikan 404 untuk `/` atau `/api/health`, periksa server block
aktif. Template HTTP ada di `nginx-prominence-http.conf`; tambahkan TLS untuk
cookie autentikasi Secure di production.

# Prominence

Website React dengan backend FastAPI dan **MySQL 8.0+**.

Backend menggunakan SQLAlchemy async + aiomysql untuk akun admin, insight CMS,
FAQ bilingual, kontak, newsletter, status checks, dan pembatasan login.
Endpoint serta bentuk respons tetap kompatibel dengan frontend yang ada.

## Mulai

1. Buat database dan user MySQL (lihat [panduan deployment](DEPLOYMENT.md)).
2. Instal `backend/requirements-production.txt` pada virtualenv Python 3.11+.
3. Salin `backend/.env.example` ke `backend/.env`, isi DATABASE_URL dan secret.
4. Dari `backend/`, jalankan `python migrate.py`.
5. Jalankan `uvicorn server:app --host 127.0.0.1 --port 8001`.
6. Dari `frontend/`, jalankan `yarn install --frozen-lockfile` dan `yarn start`.
   Atur REACT_APP_BACKEND_URL sesuai alamat backend.

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk production, impor data MongoDB lama,
systemd, frontend, Nginx, TLS, backup dan pengujian MySQL.

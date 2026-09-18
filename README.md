# Production Deployment Guide — Prominence

Panduan deploy ke VPS/cloud server sendiri (tanpa GitHub, tanpa platform Emergent). Cocok untuk: Ubuntu/Debian VPS di DigitalOcean, Linode, AWS EC2, Hetzner, Niagahoster Cloud, dll.

**Arsitektur target**
```
                        ┌───────────────────────────┐
   (HTTPS, port 443) ──▶│  Nginx (reverse proxy)    │
                        │  - serve React static     │
                        │  - proxy /api → backend   │
                        └────────┬──────────────────┘
                                 │
                       ┌─────────┴─────────┐
                       ▼                   ▼
              ┌──────────────┐     ┌──────────────┐
              │ FastAPI 8001 │     │   MongoDB    │
              │  (systemd)   │     │  (27017)     │
              └──────────────┘     └──────────────┘
```

---

## 0 · Prasyarat

- 1 VPS Ubuntu 22.04 LTS (≥ 2 GB RAM, ≥ 20 GB disk)
- Domain (mis. `prominence.id`) dengan akses ke DNS-nya
- Akses SSH root atau user dengan sudo

Persiapan domain (sebelum lanjut):
- `A` record  `prominence.id`     → IP VPS
- `A` record  `www.prominence.id` → IP VPS

---

## 1 · Install dependencies di VPS

```bash
ssh root@<IP_VPS>

apt update && apt upgrade -y
apt install -y curl git build-essential nginx ufw certbot python3-certbot-nginx \
               python3.11 python3.11-venv python3-pip

# Node.js 20 (untuk build frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g yarn

# MongoDB 7 (opsi A — self-hosted)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org
systemctl enable --now mongod

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

> **Opsi B — MongoDB Atlas (managed)**: lewati instalasi MongoDB lokal. Buat cluster M0 gratis di [cloud.mongodb.com](https://cloud.mongodb.com), tambah IP VPS ke whitelist, dan simpan connection string — nanti dipakai sebagai `MONGO_URL` di langkah 4.

---

## 2 · Buat user aplikasi & upload source

Di lokal (komputer Anda):
```bash
cd /app
tar --exclude='node_modules' --exclude='__pycache__' --exclude='.git' \
    -czf prominence.tar.gz backend frontend exports
scp prominence.tar.gz root@<IP_VPS>:/tmp/
```

Di VPS:
```bash
adduser --disabled-password --gecos "" prominence
mkdir -p /opt/prominence
tar -xzf /tmp/prominence.tar.gz -C /opt/prominence
chown -R prominence:prominence /opt/prominence
```

---

## 3 · MongoDB — security & user aplikasi

Hanya jika **self-hosted** (opsi A). Skip kalau pakai Atlas.

```bash
mongosh <<'EOF'
use admin
db.createUser({
  user: "root",
  pwd:  "GANTI_PASSWORD_ROOT_KUAT",
  roles: [{ role: "root", db: "admin" }]
})
use prominence
db.createUser({
  user: "prominence",
  pwd:  "GANTI_PASSWORD_APP_KUAT",
  roles: [{ role: "readWrite", db: "prominence" }]
})
EOF

# Aktifkan auth
sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
systemctl restart mongod
```

Connection string yang akan dipakai:
```
mongodb://prominence:GANTI_PASSWORD_APP_KUAT@127.0.0.1:27017/prominence?authSource=prominence
```

---

## 4 · Backend — virtualenv + .env + systemd

```bash
sudo -u prominence -i
cd /opt/prominence/backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements-production.txt
deactivate
exit
```

Buat `.env` production (jangan reuse nilai preview):

```bash
nano /opt/prominence/backend/.env
```

Isi:
```
MONGO_URL="mongodb://prominence:GANTI_PASSWORD_APP_KUAT@127.0.0.1:27017/prominence?authSource=prominence"
DB_NAME="prominence"
CORS_ORIGINS="https://prominence.id,https://www.prominence.id"
JWT_SECRET="<HASIL python3 -c 'import secrets;print(secrets.token_hex(48))'>"
ADMIN_EMAIL="admin@prominence.id"
ADMIN_PASSWORD="<PASSWORD_ADMIN_BARU_YANG_KUAT>"
```

Permission ketat (file ini punya secret):
```bash
chmod 600 /opt/prominence/backend/.env
chown prominence:prominence /opt/prominence/backend/.env
```

Service systemd:

```bash
cat > /etc/systemd/system/prominence-backend.service <<'EOF'
[Unit]
Description=Prominence FastAPI backend
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
User=prominence
Group=prominence
WorkingDirectory=/opt/prominence/backend
EnvironmentFile=/opt/prominence/backend/.env
ExecStart=/opt/prominence/backend/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=3
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now prominence-backend
systemctl status prominence-backend --no-pager
```

Smoke test:
```bash
curl http://127.0.0.1:8001/api/health
# {"status":"healthy","timestamp":"..."}
```

---

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

## 6 · Nginx — reverse proxy + static

```bash
cat > /etc/nginx/sites-available/prominence <<'EOF'
server {
    listen 80;
    server_name prominence.id www.prominence.id;
    # Sertifikat & redirect ditangani oleh certbot di langkah berikut
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name prominence.id www.prominence.id;

    # SSL akan ditambahkan certbot otomatis
    # ssl_certificate     /etc/letsencrypt/live/prominence.id/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/prominence.id/privkey.pem;

    # Frontend (static SPA)
    root /opt/prominence/frontend/build;
    index index.html;

    # Long-cache static assets
    location ~* \.(js|css|woff2?|ttf|otf|eot|svg|png|jpe?g|webp|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback — semua route non-asset dikirim ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API — proxy ke FastAPI lokal
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;

        # Buka header X-Access-Token agar SPA bisa membacanya
        proxy_pass_header X-Access-Token;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 10m;
}
EOF

ln -sf /etc/nginx/sites-available/prominence /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 7 · HTTPS — Let's Encrypt

```bash
certbot --nginx -d prominence.id -d www.prominence.id \
        --redirect --agree-tos -m admin@prominence.id --no-eff-email

# auto-renew sudah aktif lewat certbot.timer; verifikasi:
systemctl list-timers | grep certbot
```

Setelah sertifikat terbit, Nginx otomatis di-reload. Buka `https://prominence.id` — site harus tampil.

---

## 8 · Import data preview (opsional)

Upload bundle dari preview:
```bash
scp /app/exports/prominence-data-*.tar.gz root@<IP_VPS>:/tmp/
ssh root@<IP_VPS>
mkdir -p /opt/prominence/exports
tar -xzf /tmp/prominence-data-*.tar.gz -C /opt/prominence/exports
cd /opt/prominence/exports
chmod +x import.sh

# Import — ganti URL & nama DB sesuai .env Anda
./import.sh "mongodb://prominence:GANTI_PASSWORD_APP_KUAT@127.0.0.1:27017/?authSource=prominence" "prominence"

# Restart backend supaya admin di-seed ulang dengan password dari .env
systemctl restart prominence-backend
```

Setelah import:
- Login admin di `https://prominence.id/admin/login` dengan `ADMIN_EMAIL`/`ADMIN_PASSWORD` di `.env`
- Hapus inquiry/subscriber test:
  ```bash
  mongosh "mongodb://prominence:...@127.0.0.1:27017/prominence?authSource=prominence" --eval '
    db.contact_inquiries.deleteMany({email: /test|example/});
    db.newsletter_subs.deleteMany({email: /test|example/});
  '
  ```

---

## 9 · Operations — cheat-sheet

```bash
# Backend
systemctl status prominence-backend
systemctl restart prominence-backend
journalctl -u prominence-backend -f          # follow logs
journalctl -u prominence-backend -n 200      # last 200 lines

# Nginx
nginx -t                                     # syntax check
systemctl reload nginx                       # apply config

# MongoDB
systemctl status mongod
mongosh "mongodb://prominence:...@127.0.0.1:27017/prominence?authSource=prominence"
```

### Backup otomatis MongoDB (harian)

```bash
mkdir -p /var/backups/prominence
cat > /etc/cron.daily/prominence-mongo-backup <<'EOF'
#!/usr/bin/env bash
set -e
TS=$(date +%Y%m%d-%H%M%S)
OUT=/var/backups/prominence/$TS
mkdir -p "$OUT"
mongodump --uri="mongodb://prominence:GANTI_PASSWORD@127.0.0.1:27017/prominence?authSource=prominence" --out="$OUT"
# rotate: keep last 14 days
find /var/backups/prominence -maxdepth 1 -type d -mtime +14 -exec rm -rf {} \;
EOF
chmod +x /etc/cron.daily/prominence-mongo-backup
```

---

## 10 · Update / re-deploy (workflow tanpa Git)

Setiap kali Anda mengubah kode di lokal:

**Lokal:**
```bash
cd /app
tar --exclude='node_modules' --exclude='__pycache__' --exclude='build' --exclude='.git' \
    -czf /tmp/prominence-update.tar.gz backend frontend
scp /tmp/prominence-update.tar.gz root@<IP_VPS>:/tmp/
```

**VPS:**
```bash
# Hot-swap source
cd /opt/prominence
tar -xzf /tmp/prominence-update.tar.gz

# Update backend deps (kalau requirements-production.txt berubah)
sudo -u prominence /opt/prominence/backend/.venv/bin/pip install \
     -r /opt/prominence/backend/requirements-production.txt

# Rebuild frontend
sudo -u prominence -i bash -c "cd /opt/prominence/frontend && yarn install --frozen-lockfile && yarn build"

# Restart backend, reload Nginx
systemctl restart prominence-backend
systemctl reload nginx
```

---

## 11 · Hardening tambahan (rekomendasi)

- Aktifkan **fail2ban** untuk SSH dan Nginx:
  ```bash
  apt install -y fail2ban
  systemctl enable --now fail2ban
  ```
- Nonaktifkan login root SSH dan pakai SSH key.
- Aktifkan **logrotate** untuk log Nginx (default sudah ada).
- Tambahkan **monitoring**: Uptime Kuma / Healthchecks.io memanggil `https://prominence.id/api/health` tiap 1 menit.
- Set **CORS_ORIGINS** ketat (hanya domain Anda) — jangan biarkan `*` di produksi.
- Set **CSP** header di Nginx kalau perlu.

---

## 12 · Post-deploy checklist

- [ ] `https://prominence.id` tampil dengan benar
- [ ] Sertifikat SSL valid (lihat ikon gembok di browser)
- [ ] `https://prominence.id/api/health` → `{"status":"healthy",...}`
- [ ] Login admin di `/admin/login` bekerja
- [ ] Submit form Contact dari halaman publik → masuk ke `/admin/inquiries`
- [ ] Toggle bahasa EN/ID di header bekerja
- [ ] Publish 1 insight dari CMS → muncul di `/resources`
- [ ] Backup cron job aktif (`ls /var/backups/prominence/`)
- [ ] Logs bersih: `journalctl -u prominence-backend -n 50`

Selesai. Site siap di produksi.

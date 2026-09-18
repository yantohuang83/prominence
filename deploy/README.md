# Prominence Production Deploy

Use the production backend dependencies:

```bash
cd /opt/prominence/backend
source .venv/bin/activate
pip install -r requirements-production.txt
```

If Nginx returns its own `404 Not Found` for `/` or `/api/health`, the Prominence site is not the active/default server block. Install `nginx-prominence-http.conf` as `/etc/nginx/sites-available/prominence`, enable it, and disable the default site.

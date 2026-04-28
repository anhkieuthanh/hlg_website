# VPS Deployment

## Prerequisites

- VPS with Docker and Docker Compose.
- Domain records for public site, API, admin, and staging.
- SMTP credentials for transactional email.
- Office/VPN static IPs when admin IP allowlist is ready.

## First Deploy

```bash
cp .env.example .env
docker compose build
docker compose up -d db
docker compose run --rm api npm run prisma:migrate -w apps/api
docker compose run --rm api npm run seed -w apps/api
docker compose up -d
```

## DNS Targets

- `hoanglong.example` and `www.hoanglong.example` -> VPS.
- `api.hoanglong.example` -> VPS.
- `admin.hoanglong.example` -> VPS.
- `staging.hoanglong.example` -> VPS.

Replace placeholder domains in `infra/nginx/nginx.conf` before production.

## Staging

Staging is protected with basic auth and `X-Robots-Tag: noindex, nofollow`. Generate a real password file before deployment:

```bash
htpasswd -c infra/nginx/.htpasswd staging
```

## Admin Hardening

- Keep 2FA enabled for all admin users.
- Add office/VPN IPs to the admin Nginx block when available.
- Keep Swagger exposed only in staging/internal environments.
- Rotate `JWT_SECRET`, admin bootstrap password, and SMTP password before launch.

## Backup

Run weekly via cron:

```bash
0 2 * * 0 cd /path/to/project && ./infra/scripts/backup.sh
```

Store backups outside the VPS when possible. Test restore before launch.

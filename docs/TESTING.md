# Testing Checklist

## API

- Auth login requires password and valid TOTP when a secret is configured.
- RBAC blocks users outside allowed roles.
- Public endpoints only return `published` records and hide English records without `enPublished`.
- Contact form creates `new` leads.
- Lead status changes create audit log entries.
- CSV export includes all non-deleted leads.
- Soft delete hides records from collection reads.

## Public Website

- `/vi` and `/en` render without mixed-language fallback.
- Main navigation reaches all v1 pages.
- Project, catalogue, and news detail pages render from slugs.
- Contact form submits to API and shows success/error state.
- Sitemap, robots, canonical and metadata are present before launch.
- Desktop layouts are dense and polished; mobile stacks without overlap.

## Admin

- Login, logout, session restore, dashboard load.
- Lead list, lead status update, and CSV export.
- Collection lists for projects, catalogue products, news, and capabilities.
- Production admin is protected by 2FA and Nginx IP allowlist when IPs are available.

## Deployment

- Docker Compose starts all services.
- Prisma migration and seed run successfully.
- Staging has basic auth and noindex headers.
- Backup script produces DB dump and uploads archive.
- Restore is tested at least once before production launch.

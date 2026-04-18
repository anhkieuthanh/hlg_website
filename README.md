# Hoang Long Group Website Platform

Corporate B2B website platform for Hoang Long Group with a bilingual public site, custom CMS admin, REST API, PostgreSQL schema, and Docker-based VPS deployment baseline.

## Apps

- `apps/web`: public Next.js website at `/vi` and `/en`.
- `apps/admin`: custom Next.js admin CMS.
- `apps/api`: NestJS REST API with OpenAPI, Prisma, RBAC, audit hooks, leads, and CMS endpoints.
- `packages/shared`: shared content types, seed data, locale helpers, roles, and constants.

## Quick Start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Default local URLs:

- Public website: `http://localhost:3000/vi`
- Admin: `http://localhost:3001`
- API: `http://localhost:4000`
- Swagger/OpenAPI: `http://localhost:4000/docs` outside production

## Admin Security Baseline

- Email/password login with TOTP verification.
- JWT sessions for admin API calls.
- Role model: `SUPER_ADMIN`, `CONTENT_EDITOR`, `LEAD_MANAGER`, `VIEWER`.
- Audit log table and service hooks for admin mutations.
- Production deployment should add admin IP allowlist at Nginx when office/VPN IPs are known.

## Content Defaults

The repository includes realistic seed placeholders for:

- Manufacturing and construction capabilities.
- Factories, equipment, certificates.
- Project case studies.
- B2B catalogue categories/products.
- News/SEO articles.
- Contact lead workflow.

Vietnamese content is required by default. English fields are included and can be published per record when ready.

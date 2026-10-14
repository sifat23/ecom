# Multi-Vendor Marketplace

Solo-dev build. See `docs/` for PRD, TRD, phase plan, and flowcharts.

## Quick start

```bash
cp .env.example .env
docker compose up --build

Service	URL
Storefront	http://localhost:5173
Edge (nginx)	http://localhost
API health	http://localhost:3000/api/health
Mailpit UI	http://localhost:8025

docker compose exec api npx prisma migrate dev --name <name>
docker compose exec api npx prisma studio
docker compose exec api npm run seed
docker compose logs -f api
docker compose down -v          # nuke volumes (fresh DB)

Role	    Email                       Password
Admin	    admin@marketplace.local     Password123!
Vendor	    vendor@marketplace.local    Password123!
Customer    customer@marketplace.local  Password123!
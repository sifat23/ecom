# Ops Runbook

## Backups (added properly in Phase 10, but note it now)

Two things must be backed up — not one:

| What              | Where                                    | Why                                   |
|-------------------|------------------------------------------|---------------------------------------|
| PostgreSQL data   | Docker volume `marketplace_postgres_data`| Orders, vendors, users, activities     |
| Uploaded files    | Docker volume `marketplace_uploads_data` | Product images — **easy to forget**   |

```bash
# Manual DB dump
docker compose exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%F).sql

# Manual uploads archive
docker run --rm -v marketplace_uploads_data:/data -v $(pwd):/out alpine \
  tar czf /out/uploads_$(date +%F).tar.gz -C /data .
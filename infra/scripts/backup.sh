#!/usr/bin/env sh
set -eu

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

docker compose exec -T db pg_dump -U hlg -d hlg > "$BACKUP_DIR/db-$STAMP.sql"
docker run --rm -v hoang-long-group-platform_uploads:/uploads:ro -v "$PWD/$BACKUP_DIR:/backup" alpine \
  tar -czf "/backup/uploads-$STAMP.tar.gz" -C /uploads .

find "$BACKUP_DIR" -type f -mtime +30 -delete
echo "Backup completed: $BACKUP_DIR ($STAMP)"

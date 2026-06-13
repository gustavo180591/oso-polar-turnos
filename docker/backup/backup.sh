#!/bin/sh

set -e

BACKUP_DIR="/backups"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

mkdir -p "$BACKUP_DIR"

echo "Iniciando servicio de backups automáticos..."
echo "Intervalo: ${INTERVAL} segundos"
echo "Retención: ${RETENTION_DAYS} días"

while true
do
	TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
	BACKUP_FILE="${BACKUP_DIR}/oso_polar_${TIMESTAMP}.sql.gz"

	echo "Creando backup: ${BACKUP_FILE}"

	PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
		-h postgres \
		-U "$POSTGRES_USER" \
		-d "$POSTGRES_DB" \
		--no-owner \
		--no-privileges \
		| gzip > "$BACKUP_FILE"

	echo "Backup creado correctamente: ${BACKUP_FILE}"

	echo "Eliminando backups con más de ${RETENTION_DAYS} días..."
	find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$RETENTION_DAYS" -delete

	echo "Próximo backup en ${INTERVAL} segundos."
	sleep "$INTERVAL"
done

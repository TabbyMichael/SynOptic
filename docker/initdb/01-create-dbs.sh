#!/bin/bash
set -e

# This script runs inside the official postgres image during initialization.
# It creates two databases: agroinsight_dev and agroinsight_test owned by POSTGRES_USER.

PSQL="psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --no-password"

echo "Checking for existing databases..."
DBS_TO_CREATE=("agroinsight_dev" "agroinsight_test")
for db in "${DBS_TO_CREATE[@]}"; do
  if ! ${PSQL} -tAc "SELECT 1 FROM pg_database WHERE datname='${db}'" | grep -q 1; then
    echo "Creating database: ${db}"
    ${PSQL} -c "CREATE DATABASE ${db};"
  else
    echo "Database ${db} already exists, skipping"
  fi
done

echo "Init db script completed"

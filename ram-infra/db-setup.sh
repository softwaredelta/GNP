#!/usr/bin/sh

if [ -f /checks/db-setup ]; then
    echo "Database already setup"
    exit 0
fi

unset PGHOST
unset PGUSER
unset PGPORT
unset PGDATABASE
until psql -c '\l'; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done

psql -c "ALTER USER postgres WITH PASSWORD '$PGPASSWORD';"

touch /checks/db-setup

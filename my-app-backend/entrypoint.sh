#!/bin/sh
set -e

# Wait for Postgres to accept connections before touching the ORM.
python - <<'PY'
import os
import socket
import sys
import time

host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
deadline = time.time() + 60

while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=3):
            print(f"database {host}:{port} is up", flush=True)
            sys.exit(0)
    except OSError:
        print(f"waiting for database at {host}:{port} ...", flush=True)
        time.sleep(1)

print(f"database at {host}:{port} never became reachable", file=sys.stderr)
sys.exit(1)
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"

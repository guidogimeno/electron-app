#!/bin/sh

sh ./migrations/migrate.sh
sh /app/.venv/bin/flask "run" --host=0.0.0.0 --port=8080

echo "startup completed"


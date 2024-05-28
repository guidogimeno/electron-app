#!/bin/bash

DATABASE_FILE=".database.db"
MIGRATION_DIR="migrations"

if [ -f "$DATABASE_FILE" ]; then
    rm "$DATABASE_FILE"
fi

for MIGRATION_FILE in $(ls "$MIGRATION_DIR"/*.sql | sort); do
    sqlite3 "$DATABASE_FILE" < "$MIGRATION_FILE"

    if [ $? -eq 0 ]; then
        echo "Applied migration: $MIGRATION_FILE"
    else
        echo "Error applying migration: $MIGRATION_FILE"
        exit 1
    fi
done

echo "Migration applied successfully!"

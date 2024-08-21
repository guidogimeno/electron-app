FROM python:3.12.3 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

RUN python -m venv .venv
COPY requirements.txt ./
RUN .venv/bin/pip install -r requirements.txt
FROM python:3.12.3-slim

WORKDIR /app
COPY --from=builder /app/.venv .venv/
COPY . .

RUN apt-get update && apt-get install sqlite3
RUN chmod+x startup.sh
RUN chmod+x migrations/migrate.sh
ENTRYPOINT["./startup.sh"]


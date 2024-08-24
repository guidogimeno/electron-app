FROM python:3.12.3 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app


RUN apt-get update && apt-get install libpq5 -y
RUN python -m venv .venv
COPY requirements.txt ./
RUN .venv/bin/pip install -r requirements.txt

FROM python:3.12.3-slim
WORKDIR /app
COPY --from=builder /app/.venv .venv/
COPY . .

RUN apt update && apt upgrade -y && apt install sqlite3
COPY migrations/ ./migrations/
RUN ls && ./migrations/migrate.sh

CMD ["/app/.venv/bin/flask", "run", "--host=0.0.0.0", "--port=8080"]

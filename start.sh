#!/bin/bash
echo "🚀 Starting containers..."
docker-compose up --build -d

echo "⏳ Waiting 120 seconds for infrastructure to stabilize..."
sleep 120

echo "🔗 Creating TiCDC Changefeed..."
MSYS_NO_PATHCONV=1 docker exec -it ticdc /cdc cli changefeed create \
--server=http://127.0.0.1:8300 \
--sink-uri="kafka://kafka:29092/ti-db-updates?protocol=canal-json" \
--changefeed-id="tidb-to-kafka"

echo "🔄 Restarting Node.js Consumer to refresh metadata..."
docker-compose restart node-consumer

echo "✅ Pipeline is ready! Viewing logs..."
docker logs -f node-app
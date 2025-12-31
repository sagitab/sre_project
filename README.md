TiDB-to-Kafka Real-Time Data Pipeline
This repository contains a full-stack DevOps demonstration of a real-time Change Data Capture (CDC) pipeline. It streams database events from a TiDB cluster into Apache Kafka and processes them using a Node.js consumer.

🏗 System Architecture
TiDB (NewSQL): Distributed database that acts as the data source.

TiCDC: Captures incremental changes from the TiDB TiKV nodes.

Apache Kafka: The message broker that stores and streams the database events.

Node.js Consumer: A microservice that consumes the Canal-JSON events and outputs structured logs.

🛠 Prerequisites
Docker & Docker Compose

Git Bash (Required for Windows users to run the startup script)

Node.js (If you wish to run the consumer outside of Docker)

🚀 Quick Start
The entire pipeline is automated via a shell script to ensure correct startup sequencing and networking connectivity.

1. Clone and Initialize
Bash

# Clone the repository
git clone <your-repo-url>
cd app_DB_ticdc

# Make the start script executable
chmod +x start.sh
2. Run the Pipeline
Execute the startup script. This script will build the images, start the containers, wait for health checks, and initialize the CDC changefeed.

Bash

./start.sh
Note for Windows Users: The script uses MSYS_NO_PATHCONV=1 to ensure Git Bash handles Docker internal paths correctly.

the lifecycle as follows:

Build & Up: Starts all services in detached mode.

Grace Period: Sleeps for 120 seconds to allow the TiDB PD (Placement Driver) and Kafka Controller to stabilize.

Changefeed Creation: Registers the TiCDC changefeed to start monitoring all tables (*.*) and shipping logs to Kafka.

Metadata Refresh: Restarts the node-consumer to ensure it identifies the newly created Kafka topics immediately.

Log Follow: Automatically attaches to the consumer logs for real-time monitoring.

🧪 Testing the Pipeline
To verify the pipeline is working, perform a transaction in TiDB and watch the Node.js console:

Enter the TiDB MySQL Client:

SQL

CREATE DATABASE demo_db;
USE demo_db;
CREATE TABLE test_sync (id INT PRIMARY KEY, message VARCHAR(255));
INSERT INTO test_sync VALUES (1, 'Pipeline is Live!');
Check Consumer Logs: You should see the structured output in your terminal:

JSON

{
  "timestamp": "2025-12-31T13:10:05.123Z",
  "event_type": "INSERT",
  "database": "demo_db",
  "table": "test_sync",
  "data": [{ "id": "1", "message": "Pipeline is Live!" }]
}
🛑 Shutdown
To stop all services and remove the containers:

Bash

docker-compose down
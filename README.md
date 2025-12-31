# SRE Home Test Assignment

This project demonstrates a **real-time Change Data Capture (CDC) pipeline** that streams database events from a distributed **TiDB** cluster into **Apache Kafka** using **TiCDC**, with a **Node.js consumer** processing the live event stream.

The project highlights **automation, container orchestration, and distributed systems concepts**, making it suitable for DevOps and Data Engineering portfolios.

---

## 🔹 Key Features

### 🗄 Distributed NewSQL Database
- Uses **TiDB** (TiDB, PD, and TiKV components)
- High availability and horizontal scalability
- Strong consistency with Raft-based replication

### 🔄 Real-Time CDC Pipeline
- **TiCDC** captures incremental data changes
- Events are streamed into **Kafka**
- Uses **Canal-JSON** protocol for compatibility

### 🐳 Dockerized Infrastructure
- Entire stack orchestrated with **Docker Compose**
- Custom networking between TiDB, Kafka, and consumer
- Health checks and dependency management

### ⚙ Automated Startup Sequencing
- Includes a `start.sh` automation script
- Handles:
  - Raft leader election timing
  - PD metadata synchronization
  - TiCDC changefeed creation
- Built-in **120s grace period** to ensure cluster readiness

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Docker  
- Docker Compose  
- Git Bash (recommended for Windows users)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/sagitab/sre_project.git
cd sre_project
```

---

## start the project

```bash
chmod +x start.sh
./start.sh
```
## 📂 Project Structure

```text
.
├── app/                     # Main application logic (producer / core services)
├── consumer/                # Node.js Kafka consumer (kafkajs)
├── db_script/               # SQL scripts for TiDB schema and test data
├── docker-compose.yml       # Orchestrates TiDB, Kafka, TiCDC, and services
├── prometheus.yml           # Prometheus monitoring configuration (optional need to set up manually)
├── start.sh                 # Automated startup & CDC initialization script
├── README.md                # Project documentation
├── .gitignore               # Ignored files and artifacts
├── cmd.txt                  # Local command notes (optional, ignore)
├── docker-compose.yml.txt   # Backup / reference compose file (ignore)
├── logs.txt                 # Local logs output (ignore)
```
## 🗄 Connect to TiDB Database

Once the pipeline is running, you can connect to the TiDB cluster locally using the MySQL client:

```bash
#connect to server
mysql -h 127.0.0.1 -P 4000 -u root
#select database
use app_db;
#update user name
update users set username = "sagi" where id = 1;
#check the user updated
select * from users;
# now you can see the changes in the consumer logs
```
## CleanUP
```bash
docker-compose down -v
```

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'tidb-processor',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] // Use 'kafka:29092' if running inside Docker
});

const consumer = kafka.consumer({ groupId: 'tidb-group' });

const run = async () => {
  await consumer.connect();
  // Match the topic name you used in your changefeed
  await consumer.subscribe({ topic: 'ti-db-updates', fromBeginning: true });

  console.log('🚀 Consumer connected. Waiting for TiDB changes...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawValue = message.value.toString();
      const payload = JSON.parse(rawValue);

      // Structured Logging Format
      const logEntry = {
        timestamp: new Date().toISOString(),
        event_type: payload.type, // INSERT, UPDATE, DELETE, CREATE, etc.
        database: payload.database,
        table: payload.table,
        is_ddl: payload.isDdl,
        data: payload.data,
        metadata: {
          partition,
          offset: message.offset
        }
      };

      // Process and display
      console.log('-------------------------------------------');
      if (payload.isDdl) {
        console.log(`🛠️  DDL Change detected in ${payload.database}`);
        console.log(`SQL: ${payload.sql}`);
      } else {
        console.log(`📝 Data Change: ${payload.type} on ${payload.database}.${payload.table}`);
        console.log(`Payload:`, JSON.stringify(logEntry, null, 2));
      }
    },
  });
};

run().catch(console.error);
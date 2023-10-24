const { Kafka, logLevel } = require('kafkajs')

exports.kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_BROKER_PORT],
  logLevel: logLevel.ERROR
})
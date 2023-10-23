const { Kafka, logLevel } = require('kafkajs')

exports.kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
  logLevel: logLevel.ERROR
})
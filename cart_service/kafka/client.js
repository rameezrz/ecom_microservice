const {Kafka} = require('kafkajs')

exports.kafka = new Kafka({
    clientId:'ecom_microservice',
    brokers:['localhost:9092']
})
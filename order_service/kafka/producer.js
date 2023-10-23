const {kafka} = require('./client')

const orderProducer = async(message,topic)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic,
        messages:[{
            key:'userId', value: message
        }]
    })

    console.log("message sent");

    await producer.disconnect()
}

module.exports = {orderProducer}
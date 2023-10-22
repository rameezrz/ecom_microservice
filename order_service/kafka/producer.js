const {kafka} = require('./client')

const orderProducer = async(message)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic:'order_to_cart',
        messages:[{
            key:'userId', value: message
        }]
    })

    console.log("message sent");

    await producer.disconnect()
}

module.exports = {orderProducer}
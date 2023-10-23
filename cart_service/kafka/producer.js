const {kafka} = require('./client')


const cartProducer = async(message,topic)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic,
        messages:[{
            key:'user-cart',
            value:message
        }]
    })
    console.log("User cart sent to product service",JSON.stringify(message));
    await producer.disconnect()
}

module.exports = {cartProducer}
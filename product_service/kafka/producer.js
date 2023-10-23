const {kafka} = require('./client')


const productProducer = async(message,topic)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic,
        messages:[{
            key:'user-cart',
            value:message
        }]
    })
    console.log("User cart sent to product service");
    await producer.disconnect()
}

module.exports = {productProducer}